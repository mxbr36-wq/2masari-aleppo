/**
 * chatbot.js — مساري AI
 * مستشار جامعي يجيب عن الدراسة والتخصصات فقط.
 *
 * الطلب يمر عبر Cloudflare Worker. الـ Worker هو من يضيف تعليمات النموذج
 * ويحدد الموديل والحدود، والمتصفح يرسل المحادثة وملخص النتيجة فقط.
 * إذا تعذّر الاتصال نجيب من بيانات التخصصات الموجودة في الموقع.
 */
import { SPECIALIZATIONS } from './specializations.js?v=2.1';
import { getIcon } from './icons.js?v=2.1';

const WORKER_URL = 'https://broad-smoke-e5d9.mxbr36.workers.dev';

const REQUEST_TIMEOUT_MS = 18000;
const MAX_INPUT_CHARS = 300;
const MAX_USER_MESSAGES = 30;
const HISTORY_MESSAGES = 8;
const SCROLL_SHOW_AFTER = 140;
const MIN_SEND_INTERVAL_MS = 1500;

const FALLBACK_REPLY = 'تعذّر الاتصال بالمساعد الآن. جرّب بعد قليل، أو اسألني عن تخصص بالاسم وبجاوبك من معلومات الموقع.';

/* ---------- نصوص ---------- */

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => HTML_ESCAPES[ch]);
}

// الهروب من HTML يسبق التنسيق دائماً، فلا يستطيع نص النموذج حقن وسوم
function formatMessage(text) {
    const lines = escapeHtml(text).split('\n');
    let html = '';
    let inList = false;
    for (const rawLine of lines) {
        const line = rawLine.trim().replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
        const item = line.match(/^(?:[-•*]|\d+[.)])\s+(.*)$/);
        if (item) {
            if (!inList) { html += '<ul>'; inList = true; }
            html += `<li>${item[1]}</li>`;
        } else {
            if (inList) { html += '</ul>'; inList = false; }
            if (line) html += `<p>${line}</p>`;
        }
    }
    if (inList) html += '</ul>';
    return html || '<p>…</p>';
}

// «الآداب (لغات / تاريخ ...)» ← «الآداب»
function shortName(name) {
    return name.replace(/\s*[(（].*$/, '');
}

// يوحّد الكتابة قبل المطابقة: بلا تشكيل ولا تطويل، والألف والياء والتاء المربوطة بصورة واحدة
// (لذلك تُكتب الأنماط أدناه بعد التوحيد: «مفاضله» لا «مفاضلة»)
function normalizeArabic(text) {
    return String(text || '')
        .replace(/[\u064B-\u065F\u0640]/g, '')
        .replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
        .replace(/[^ء-يa-zA-Z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ').trim().toLowerCase();
}

// بعض النماذج تسرّب وسم التفكير، مغلقاً أو مقطوعاً
function stripThinking(text) {
    return String(text || '')
        .replace(/<think>[\s\S]*?<\/think>/gi, '')
        .replace(/<think>[\s\S]*$/i, '')
        .trim();
}

/* ---------- الجواب المحلي (عند فشل الـ Worker) ---------- */

const LOCAL_ANSWERS = [
    [
        /فرق.*(كليه|معهد)|(كليه|معهد).*فرق/,
        'الكلية برنامج جامعي أطول وأعمق نظرياً غالباً، أما المعهد فيركّز على الجانب التطبيقي ومدته أقصر (سنتان غالباً). اختر حسب أسلوب تعلّمك وهدفك المهني.'
    ],
    [
        /موازي|مفتوح|افتراضي|التعليم العام|تعليم خاص|انواع التعليم/,
        'أنواع التعليم:\n- **عام:** رسوم أقل ومقاعد محدودة حسب المفاضلة.\n- **موازي:** رسوم أعلى وفرص قبول أوسع غالباً.\n- **مفتوح:** تعليم مرن وفرص قبول أوسع.\n- **افتراضي:** دراسة عن بُعد بالكامل.\n- **خاص:** جامعات خاصة بشروط ورسوم مستقلة.'
    ],
    [
        /كيف.*(اختار|اختيار).*(تخصص|بين)|(اختار|اختيار).*بين.*تخصص/,
        'لاختيار التخصص:\n- شوف اهتماماتك الحقيقية مو بس المعدل.\n- قارن بين تخصصين: المواد، مدة الدراسة، ومجالات العمل.\n- اسأل طلاب سبقوك عن الصعوبات والفرص.\n- النتيجة في مساري استرشادية؛ استشر أهلك ومن سبقك قبل القرار النهائي.'
    ],
    [
        /(نصيح|نصائح).*(دراس|جامع)/,
        'نصائح للدراسة الجامعية:\n- نظّم وقتك من أول أسبوع وما تؤجّل.\n- طبّق اللي بتدرسه عملياً كل ما قدرت.\n- كوّن علاقات مع زملائك والدكاترة.\n- اهتم بصحتك ونومك؛ الإجهاد بيأثر على التركيز.\n- لا تتردد تطلب مساعدة إذا علقت بمادة.'
    ],
    [
        // «ما هي الجامعة؟» أو «تعريف الجامعة» فقط، لا أي جملة فيها كلمة جامعة
        /^(?:(?:شو|ما|ماهي|ماهو)\s+)?(?:(?:هي|هو)\s+)?(?:تعريف\s+)?(?:ال)?جامعه$/,
        'الجامعة مؤسسة تعليم عالٍ تقدّم برامج بكالوريوس ودراسات عليا في كليات متعددة. تختلف عن المعهد بمدة أطول وعمق نظري أكبر غالباً، وتفتح مجالات بحث وعمل أوسع. في سوريا في جامعات حكومية وخاصة ومفتوحة وافتراضية.'
    ],
    [
        /مفاضله|قبول|معدلات/,
        'معدلات القبول والمفاضلة تتغيّر كل عام حسب عدد المقاعد والطلاب. لا تعتمد على أرقام قديمة؛ راجع موقع وزارة التعليم العالي والجامعة المعنية بعد صدور المفاضلة الرسمية.'
    ]
];

// أطول اسم مطابق يربح، كي لا تلتقط «العلوم» سؤالاً عن «العلوم المالية والمصرفية»
function findSpecialization(normalizedQuestion) {
    let best = null;
    let bestLength = 0;
    for (const spec of SPECIALIZATIONS) {
        const core = normalizeArabic(shortName(spec.name));
        if (core.length > 3 && core.length > bestLength && normalizedQuestion.includes(core)) {
            best = spec;
            bestLength = core.length;
        }
    }
    return best;
}

function describeSpecialization(spec) {
    const studies = spec.whatYouStudy.slice(0, 4).map(item => `- ${item}`).join('\n');
    return `**${shortName(spec.name)}** (${spec.type} • ${spec.duration})\n${spec.description}\n` +
        `**بتدرس فيه:**\n${studies}\n` +
        `**مجالات العمل:** ${spec.careers.slice(0, 4).join('، ')}.\n${spec.advice}`;
}

function findLocalAnswer(question) {
    const text = normalizeArabic(question);
    const rule = LOCAL_ANSWERS.find(([pattern]) => pattern.test(text));
    if (rule) return rule[1];

    const spec = findSpecialization(text);
    return spec ? describeSpecialization(spec) : null;
}

/* ---------- الواجهة ---------- */

export class MasariChat {
    constructor(engine) {
        this.engine = engine;
        this.history = [];
        this.userMessageCount = 0;
        this.isBusy = false;
        this.isOpen = false;
        this.hasShownFab = false;
        this.pillTimer = null;
        this.lastSentAt = 0;
        this.resultEl = document.getElementById('resultBox');

        this.buildDom();
        this.bindEvents();
        this.bindViewport();
        this.watchResult();
    }

    buildDom() {
        const fab = document.createElement('button');
        fab.type = 'button';
        fab.className = 'ai-fab';
        fab.setAttribute('aria-label', 'اسأل مساري AI عن الجامعة والتخصصات');
        fab.innerHTML = '<span class="ai-fab-ring"></span><span class="ai-fab-body"></span>';

        const panel = document.createElement('div');
        panel.className = 'ai-panel';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-modal', 'false');
        panel.setAttribute('aria-label', 'مساري AI');
        panel.setAttribute('aria-hidden', 'true');
        panel.innerHTML = `
            <div class="ai-head">
                <span class="ai-avatar"></span>
                <div class="ai-head-text">
                    <strong>مساري AI</strong>
                    <small><span class="ai-spark">${getIcon('sparkles', 13)}</span> مستشارك الجامعي</small>
                </div>
                <button type="button" class="ai-close" aria-label="إغلاق">${getIcon('x', 20)}</button>
            </div>
            <div class="ai-messages" aria-live="polite"></div>
            <div class="ai-chips"></div>
            <form class="ai-form" autocomplete="off">
                <input class="ai-input" type="text" maxlength="${MAX_INPUT_CHARS}" placeholder="اسأل عن تخصص أو جامعة…" aria-label="اكتب سؤالك" enterkeyhint="send">
                <button class="ai-send" type="submit" aria-label="إرسال">${getIcon('arrowLeft', 20)}</button>
            </form>
            <div class="ai-foot">أجيب فقط عن الدراسة الجامعية • المعلومات استرشادية</div>`;

        document.body.append(fab, panel);

        this.fab = fab;
        this.panel = panel;
        this.messagesEl = panel.querySelector('.ai-messages');
        this.chipsEl = panel.querySelector('.ai-chips');
        this.form = panel.querySelector('.ai-form');
        this.input = panel.querySelector('.ai-input');
        this.sendBtn = panel.querySelector('.ai-send');
    }

    bindEvents() {
        this.fab.addEventListener('click', () => this.open());
        this.panel.querySelector('.ai-close').addEventListener('click', () => this.close());
        this.form.addEventListener('submit', event => {
            event.preventDefault();
            this.send(this.input.value);
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && this.isOpen) this.close();
        });

        // التوسّع عند المرور بالمؤشر للأجهزة التي تدعم hover فقط
        if (window.matchMedia?.('(hover: hover)').matches) {
            this.fab.addEventListener('pointerenter', () => this.fab.classList.add('open'));
            this.fab.addEventListener('pointerleave', () => this.fab.classList.remove('open'));
        }
    }

    // يبقي النافذة فوق لوحة المفاتيح عبر --vv-b و--vv-h (يقرؤهما chatbot.css)
    bindViewport() {
        this.syncViewport = () => {
            const viewport = window.visualViewport;
            if (!this.isOpen || !viewport) {
                this.panel.style.removeProperty('--vv-b');
                this.panel.style.removeProperty('--vv-h');
                return;
            }
            const keyboardHeight = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
            this.panel.style.setProperty('--vv-b', keyboardHeight + 'px');
            this.panel.style.setProperty('--vv-h', viewport.height + 'px');
            this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
        };
        window.visualViewport?.addEventListener('resize', this.syncViewport);
        window.visualViewport?.addEventListener('scroll', this.syncViewport);
    }

    // الأيقونة تظهر في شاشة النتيجة فقط، بعد تمرير بسيط، وما دامت النافذة مغلقة
    updateFabVisibility() {
        const onResult = Boolean(this.resultEl?.classList.contains('active'));
        this.setFabVisible(onResult && window.scrollY > SCROLL_SHOW_AFTER && !this.isOpen);
    }

    watchResult() {
        const update = () => this.updateFabVisibility();
        window.addEventListener('scroll', update, { passive: true });
        if (this.resultEl) {
            new MutationObserver(update).observe(this.resultEl, { attributes: true, attributeFilter: ['class'] });
        }
        update();
    }

    setFabVisible(show) {
        const wasVisible = this.fab.classList.contains('show');
        this.fab.classList.toggle('show', show);
        if (show && !wasVisible && !this.hasShownFab) {
            // أول ظهور فقط: ينزلق جزء «AI» ثم ينسحب بعد 4.5 ثانية
            this.hasShownFab = true;
            clearTimeout(this.pillTimer);
            this.pillTimer = setTimeout(() => {
                this.fab.classList.add('open');
                this.pillTimer = setTimeout(() => this.fab.classList.remove('open'), 4500);
            }, 700);
        }
        if (!show) this.fab.classList.remove('open');
    }

    open() {
        this.isOpen = true;
        this.setFabVisible(false);
        this.panel.classList.add('active');
        this.panel.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        this.syncViewport();
        if (!this.messagesEl.children.length) this.showWelcome();
        setTimeout(() => this.input.focus({ preventScroll: true }), 250);
    }

    close() {
        this.isOpen = false;
        this.panel.classList.remove('active');
        this.panel.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        this.syncViewport();
        this.fab.focus({ preventScroll: true });
        this.updateFabVisibility();
    }

    // ملخص النتيجة يُرسل مع السؤال للتخصيص؛ لا يتضمن اسم الطالب ولا هاتفه
    getResultContext() {
        const result = this.engine?.result;
        if (!result) return null;
        const describe = direction => direction.top2
            .map(spec => `${shortName(spec.name)} (${Math.round(spec.score)}%)`)
            .join('، ');
        return {
            bestName: shortName(result.first.top2[0].name),
            summary: `الاتجاه الأول: ${describe(result.first)}. الاتجاه الثاني: ${describe(result.second)}.`
        };
    }

    showWelcome() {
        const bestName = this.getResultContext()?.bestName;
        this.addBot(bestName
            ? `أهلاً! أنا مساري AI 👋\nشفت إن أقرب تخصص لك **${bestName}**. اسألني عنه أو عن أي تخصص جامعي، وأنا جاهز.`
            : 'أهلاً! أنا مساري AI 👋\nاسألني عن أي تخصص جامعي أو معهد، وأنا جاهز.');

        const suggestions = [
            bestName ? `ما هو تخصص ${bestName}؟` : null,
            'ما الفرق بين الكلية والمعهد؟',
            'كيف أختار بين تخصصين؟',
            'نصائح للدراسة الجامعية'
        ].filter(Boolean);
        this.chipsEl.innerHTML = suggestions.map(text => `<button type="button" class="ai-chip">${escapeHtml(text)}</button>`).join('');
        this.chipsEl.querySelectorAll('.ai-chip').forEach(chip => {
            chip.addEventListener('click', () => this.send(chip.textContent));
        });
    }

    addMessage(role, html) {
        const el = document.createElement('div');
        el.className = `ai-msg ${role}`;
        el.innerHTML = html;
        this.messagesEl.appendChild(el);
        this.scrollToBottom();
        return el;
    }

    addBot(text) {
        return this.addMessage('bot', formatMessage(text));
    }

    addUser(text) {
        return this.addMessage('user', `<p>${escapeHtml(text)}</p>`);
    }

    scrollToBottom() {
        this.messagesEl.scrollTo({ top: this.messagesEl.scrollHeight, behavior: 'smooth' });
    }

    showTyping() {
        return this.addMessage('bot typing', '<span class="ai-typing"><i></i><i></i><i></i></span>');
    }

    // الجواب من النموذج، ثم من بيانات الموقع، ثم رسالة الفشل
    async send(rawText) {
        const text = String(rawText || '').trim().slice(0, MAX_INPUT_CHARS);
        if (!text || this.isBusy) return;
        if (Date.now() - this.lastSentAt < MIN_SEND_INTERVAL_MS) return;
        if (this.userMessageCount >= MAX_USER_MESSAGES) {
            this.addBot('وصلت للحد الأقصى من الأسئلة في هذه الجلسة. حدّث الصفحة لتبدأ محادثة جديدة.');
            return;
        }

        this.lastSentAt = Date.now();
        this.userMessageCount++;
        this.chipsEl.innerHTML = '';
        this.input.value = '';
        this.addUser(text);
        this.history.push({ role: 'user', content: text });

        this.isBusy = true;
        this.sendBtn.disabled = true;
        const typingEl = this.showTyping();

        const answer = (await this.requestModel()) || findLocalAnswer(text) || FALLBACK_REPLY;

        typingEl.remove();
        this.history.push({ role: 'assistant', content: answer });
        this.addBot(answer);
        this.isBusy = false;
        this.sendBtn.disabled = false;
        this.input.focus({ preventScroll: true });
    }

    // يُرجع نص الجواب، أو null عند أي فشل (شبكة، مهلة، رفض من الـ Worker، رد فارغ)
    async requestModel() {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        try {
            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: this.history.slice(-HISTORY_MESSAGES),
                    context: this.getResultContext()?.summary || ''
                }),
                signal: controller.signal
            });
            if (!response.ok) return null;
            const data = await response.json();
            return stripThinking(data?.choices?.[0]?.message?.content) || null;
        } catch (_) {
            return null;
        } finally {
            clearTimeout(timer);
        }
    }
}
