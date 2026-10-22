/**
 * University specializations (31): the content the quiz recommends from.
 *
 * Fields:
 *  - id           unique key
 *  - direction    health | engineering | business | humanities | culture (see directions.js)
 *  - branch       sci (scientific stream only) | lit (literary stream) | both (shared);
 *                 scoring.js filters on it for literary-branch students
 *  - type         كلية (faculty) | معهد (technical institute)
 *  - fingerprint  0-10 for each dimension (see dimensions.js). The student's result is
 *                 matched against it by Pearson correlation, so editing a number changes
 *                 who gets recommended
 *  - icon         key from icons.js
 *
 * After changing a fingerprint or adding a specialization, run `node tools/simulate.mjs`
 * and adjust DIRECTION_CALIBRATION in scoring.js if the direction shares drift. The last
 * round of fingerprint edits is listed in fingerprint-changes.md.
 */

import { DIMENSION_KEYS } from './dimensions.js?v=2.1';
import { DIRECTIONS } from './directions.js?v=2.1';

const BRANCHES = ['sci', 'lit', 'both'];
const TYPES = ['كلية', 'معهد'];

const SPECS = [
  // Health (5)
  {
    id: 'medicine',
    name: 'الطب البشري',
    icon: 'heartPulse',
    type: 'كلية',
    duration: '6 سنوات',
    direction: 'health',
    branch: 'sci',
    fingerprint: { anal: 8, creative: 4, comm: 7, tech: 6, organize: 6, lead: 7, care: 10 },
    description: 'يدرس تشخيص الأمراض وعلاجها وفهم جسم الإنسان وعملياته الحيوية، مع سنوات من التدريب السريري في المستشفيات.',
    whatYouStudy: [
      'التشريح وعلم وظائف الأعضاء',
      'الأمراض وتشخيصها',
      'العلاج والجراحة',
      'الطب الوقائي والصحة العامة',
      'الأخلاقيات الطبية'
    ],
    universities: [
      'جامعة دمشق',
      'جامعة حلب'
    ],
    careers: [
      'المستشفيات والعيادات',
      'مراكز الأبحاث الطبية',
      'وزارة الصحة',
      'الممارسة الحرة',
      'الطب الشرعي'
    ],
    advice: 'إذا أحببت مساعدة الناس وتستطيع تحمل دراسة طويلة ومكثفة، فهذا التخصص يستحق التفكير الجدي.'
  },
  {
    id: 'dentistry',
    name: 'طب الأسنان',
    icon: 'tooth',
    type: 'كلية',
    duration: '5 سنوات',
    direction: 'health',
    branch: 'sci',
    fingerprint: { anal: 7, creative: 5, comm: 7, tech: 8, organize: 8, lead: 5, care: 9 },
    description: 'يختص بصحة الفم والأسنان وتشخيص مشكلاتها وعلاجها، مع مهارات يدوية دقيقة وتقنيات حديثة.',
    whatYouStudy: [
      'تشريح الفم والأسنان',
      'التعويضات السنية',
      'جراحة الفم والوجه',
      'علاج الجذور',
      'طب أسنان الأطفال'
    ],
    universities: [
      'جامعة دمشق',
      'جامعة حلب'
    ],
    careers: [
      'العيادات الخاصة',
      'المستشفيات',
      'مراكز الأسنان',
      'التعليم الجامعي',
      'البحث في طب الأسنان'
    ],
    advice: 'إذا جمعت بين الدقة اليدوية وحب العمل مع الناس، فكر بهذا التخصص الذي يوفر استقلالية مهنية عالية.'
  },
  {
    id: 'pharmacy',
    name: 'الصيدلة',
    icon: 'pill',
    type: 'كلية',
    duration: '5 سنوات',
    direction: 'health',
    branch: 'sci',
    fingerprint: { anal: 8, creative: 4, comm: 4, tech: 5, organize: 9, lead: 5, care: 8 },
    description: 'يدرس الأدوية وتركيبها وتأثيراتها واستخدامها الآمن، مع أساسيات العلوم الطبية والصيدلانية.',
    whatYouStudy: [
      'علم الأدوية',
      'الكيمياء الصيدلانية',
      'الصيدلانيات',
      'علم السموم',
      'الصيدلة السريرية'
    ],
    universities: [
      'جامعة دمشق',
      'جامعة حلب'
    ],
    careers: [
      'الصيدليات',
      'شركات الأدوية',
      'المعامل الدوائية',
      'المستشفيات',
      'البحث والتطوير الدوائي'
    ],
    advice: 'إذا أحببت الدقة والتفاصيل والعلوم التطبيقية، فهذا تخصصك. الصيدلة تجمع بين العلم والتواصل مع الناس.'
  },
  {
    id: 'health_sciences',
    name: 'العلوم الصحية',
    icon: 'cross',
    type: 'كلية',
    duration: '4 سنوات',
    direction: 'health',
    branch: 'sci',
    fingerprint: { anal: 7, creative: 5, comm: 9, tech: 9, organize: 8, lead: 5, care: 10 },
    description: 'تخصصات صحية تطبيقية تركز على رعاية المرضى والتحاليل المخبرية والعلاج الفيزيائي والتصوير الطبي.',
    whatYouStudy: [
      'الرعاية التمريضية',
      'التحاليل المخبرية',
      'التأهيل الفيزيائي',
      'التصوير الشعاعي',
      'إدارة المراكز الصحية'
    ],
    universities: [
      'جامعة دمشق',
      'جامعة حلب'
    ],
    careers: [
      'المستشفيات',
      'المراكز الصحية',
      'العيادات',
      'مراكز التأهيل',
      'المختبرات الطبية'
    ],
    advice: 'إذا أحببت رعاية الناس مباشرة وتريد مساراً صحياً عملياً أسرع من الطب، فهذه خياراتك.'
  },
  {
    id: 'veterinary',
    name: 'الطب البيطري',
    icon: 'pawPrint',
    type: 'كلية',
    duration: '5 سنوات',
    direction: 'health',
    branch: 'sci',
    fingerprint: { anal: 7, creative: 3, comm: 7, tech: 7, organize: 7, lead: 5, care: 9 },
    description: 'يختص بصحة الحيوان وتشخيص أمراضه وعلاجها والوقاية منها، مع أساسيات الصحة العامة البيطرية.',
    whatYouStudy: [
      'تشريح الحيوان',
      'الأمراض الحيوانية',
      'الجراحة البيطرية',
      'الصحة العامة البيطرية',
      'الإنتاج الحيواني'
    ],
    universities: [
      'جامعة دمشق',
      'جامعة حلب'
    ],
    careers: [
      'العيادات البيطرية',
      'المزارع',
      'وزارة الزراعة',
      'مصانع الأغذية',
      'البحث العلمي'
    ],
    advice: 'إذا أحببت الحيوانات والعلوم الطبية معاً، فهذا التخصص يجمع بين الشغفين في مسار مهني مميز.'
  },

  // Engineering and technology (8)
  {
    id: 'informatics',
    name: 'الهندسة المعلوماتية',
    icon: 'binary',
    type: 'كلية',
    duration: '5 سنوات',
    direction: 'engineering',
    branch: 'sci',
    fingerprint: { anal: 10, creative: 6, comm: 4, tech: 10, organize: 8, lead: 6, care: 3 },
    description: 'تجمع بين علوم الحاسوب والرياضيات والأنظمة الذكية والذكاء الاصطناعي، وتؤهل لبناء أنظمة برمجية متقدمة.',
    whatYouStudy: [
      'الخوارزميات وبنية البيانات',
      'قواعد البيانات',
      'الذكاء الاصطناعي',
      'الشبكات الحاسوبية',
      'هندسة البرمجيات'
    ],
    universities: [
      'جامعة دمشق',
      'جامعة حلب'
    ],
    careers: [
      'شركات التقنية',
      'تطوير التطبيقات',
      'الأمن السيبراني',
      'الذكاء الاصطناعي',
      'إدارة الأنظمة'
    ],
    advice: 'إذا أحببت التحليل والتقنية معاً، فأنت مرشح قوي. هذا التخصص من أكثر التخصصات طلباً في سوق العمل الحديث.'
  },
  {
    id: 'software_engineering',
    name: 'هندسة البرمجيات ونظم المعلومات',
    icon: 'codeXml',
    type: 'كلية',
    duration: '5 سنوات',
    direction: 'engineering',
    branch: 'sci',
    fingerprint: { anal: 9, creative: 7, comm: 5, tech: 9, organize: 9, lead: 8, care: 3 },
    description: 'تركز على تطوير البرمجيات وتصميم نظم المعلومات وإدارة المشاريع التقنية بأسلوب منهجي.',
    whatYouStudy: [
      'البرمجة المتقدمة',
      'هندسة البرمجيات',
      'نظم المعلومات',
      'إدارة المشاريع التقنية',
      'قواعد البيانات المتقدمة'
    ],
    universities: [
      'جامعة دمشق',
      'جامعة حلب'
    ],
    careers: [
      'تطوير البرمجيات',
      'تحليل النظم',
      'إدارة تقنية المعلومات',
      'الاستشارات التقنية',
      'إدارة المشاريع'
    ],
    advice: 'يجمع بين التحليل والتنظيم والبرمجة، مثالي لمحبي التقنية المنظمة والراغبين بالعمل في بيئات إدارية-تقنية.'
  },
  {
    id: 'civil_engineering',
    name: 'الهندسة المدنية',
    icon: 'bridge',
    type: 'كلية',
    duration: '5 سنوات',
    direction: 'engineering',
    branch: 'sci',
    fingerprint: { anal: 9, creative: 5, comm: 5, tech: 10, organize: 9, lead: 9, care: 3 },
    description: 'تختص بتصميم وتنفيذ المشاريع الإنشائية والبنية التحتية كالطرق والجسور والمباني وشبكات المياه.',
    whatYouStudy: [
      'ميكانيك المواد',
      'تحليل الإنشاءات',
      'الخرسانة المسلحة',
      'إدارة المشاريع',
      'الهندسة الجيوتقنية'
    ],
    universities: [
      'جامعة دمشق',
      'جامعة حلب'
    ],
    careers: [
      'شركات الإنشاء',
      'المكاتب الهندسية',
      'وزارة الأشغال',
      'إدارة المشاريع',
      'الاستشارات الهندسية'
    ],
    advice: 'إذا أحببت البناء والتنظيم والقيادة الميدانية، فهذا تخصصك. المهندس المدني يرى نتيجة عمله واقعاً ملموساً.'
  },
  {
    id: 'architecture',
    name: 'الهندسة المعمارية',
    icon: 'draftingCompass',
    type: 'كلية',
    duration: '5 سنوات',
    direction: 'engineering',
    branch: 'sci',
    fingerprint: { anal: 7, creative: 10, comm: 5, tech: 6, organize: 7, lead: 6, care: 3 },
    description: 'تجمع بين الفن والهندسة لتصميم المباني والفراغات وتحويل المتطلبات الوظيفية إلى مخططات إبداعية.',
    whatYouStudy: [
      'التصميم المعماري',
      'تاريخ العمارة',
      'الرسم الهندسي',
      'التخطيط العمراني',
      'النمذجة ثلاثية الأبعاد'
    ],
    universities: [
      'جامعة دمشق',
      'جامعة حلب'
    ],
    careers: [
      'المكاتب المعمارية',
      'التصميم الداخلي',
      'التخطيط العمراني',
      'الإشراف على التنفيذ',
      'الاستشارات الهندسية'
    ],
    advice: 'إذا جمعت بين الإبداع والدقة الهندسية، فهذا تخصصك. المعمار يحوّل الأفكار إلى فضاءات يعيشها الناس.'
  },
  {
    id: 'mechatronics',
    name: 'الهندسة الميكانيكية والكهربائية',
    icon: 'cog',
    type: 'كلية',
    duration: '5 سنوات',
    direction: 'engineering',
    branch: 'sci',
    fingerprint: { anal: 9, creative: 6, comm: 4, tech: 10, organize: 7, lead: 7, care: 2 },
    description: 'تختص بتصميم وتشغيل الأنظمة الميكانيكية والكهربائية وأنظمة التحكم الصناعي والأتمتة.',
    whatYouStudy: [
      'الميكانيك التطبيقي',
      'الإلكترونيات',
      'الدارات الكهربائية',
      'التحكم الآلي',
      'عمليات التصنيع'
    ],
    universities: [
      'جامعة دمشق',
      'جامعة حلب'
    ],
    careers: [
      'المصانع',
      'شركات الطاقة',
      'الصيانة الصناعية',
      'الأتمتة والتحكم',
      'التصميم الميكانيكي'
    ],
    advice: 'للمهتمين بالعمل اليدوي التقني والأنظمة الصناعية. المهندس الميكانيكي-الكهربائي مطلوب في كل مصنع.'
  },
  {
    id: 'agriculture',
    name: 'الهندسة الزراعية',
    icon: 'sprout',
    type: 'كلية',
    duration: '5 سنوات',
    direction: 'engineering',
    branch: 'sci',
    fingerprint: { anal: 7, creative: 2, comm: 6, tech: 8, organize: 7, lead: 6, care: 7 },
    description: 'تجمع بين العلوم الزراعية والهندسة لتطوير الإنتاج الزراعي وحلول الري والآلات الزراعية.',
    whatYouStudy: [
      'المحاصيل والإنتاج النباتي',
      'التربة والمياه',
      'الآلات الزراعية',
      'الإنتاج الحيواني',
      'الاقتصاد الزراعي'
    ],
    universities: [
      'جامعة دمشق',
      'جامعة حلب'
    ],
    careers: [
      'المزارع',
      'وزارة الزراعة',
      'شركات الأغذية',
      'الإرشاد الزراعي',
      'البحث الزراعي'
    ],
    advice: 'إذا أحببت الطبيعة والتقنية معاً، فكر بهذا التخصص. الأمن الغذائي يمثل فرصة كبيرة لمستقبل مهني مستقر.'
  },
  {
    id: 'science',
    name: 'العلوم (رياضيات / فيزياء / كيمياء)',
    icon: 'atom',
    type: 'كلية',
    duration: '4 سنوات',
    direction: 'engineering',
    branch: 'sci',
    fingerprint: { anal: 10, creative: 5, comm: 4, tech: 6, organize: 8, lead: 4, care: 2 },
    description: 'تخصصات أساسية في العلوم النظرية والتطبيقية، تؤهل للبحث والتدريس والتحليل العلمي المتقدم.',
    whatYouStudy: [
      'التحليل الرياضي والجبر',
      'الميكانيك',
      'الكهرباء والمغناطيسية',
      'الكيمياء العضوية وغير العضوية',
      'الفيزياء الحديثة'
    ],
    universities: [
      'جامعة دمشق',
      'جامعة حلب'
    ],
    careers: [
      'التعليم',
      'البحث العلمي',
      'المختبرات',
      'تحليل البيانات',
      'القطاع الصناعي'
    ],
    advice: 'إذا أحببت الفهم العميق والتفكير النظري والبحث عن أسباب الظواهر، فهذا مجالك الحقيقي.'
  },
  {
    id: 'computer_tech',
    name: 'تقنيات الحاسوب',
    icon: 'monitor',
    type: 'معهد',
    duration: 'سنتان',
    direction: 'engineering',
    branch: 'sci',
    fingerprint: { anal: 8, creative: 4, comm: 5, tech: 10, organize: 8, lead: 5, care: 2 },
    description: 'برنامج تطبيقي قصير يركز على المهارات التقنية العملية في الحاسوب والشبكات والبرمجة وصيانة الأنظمة.',
    whatYouStudy: [
      'البرمجة التطبيقية',
      'الشبكات',
      'صيانة الحاسوب',
      'قواعد البيانات',
      'تطوير الويب'
    ],
    universities: [
      'المعاهد التقانية'
    ],
    careers: [
      'الدعم التقني',
      'صيانة الشبكات',
      'تطوير المواقع',
      'إدارة الأنظمة',
      'الشركات التقنية'
    ],
    advice: 'إذا أردت دخول سوق العمل التقني بسرعة وبأقل تكلفة زمنية، فهذا خيار عملي ممتاز.'
  },

  // Economics and management (6)
  {
    id: 'economics',
    name: 'الاقتصاد',
    icon: 'trendingUp',
    type: 'كلية',
    duration: '4 سنوات',
    direction: 'business',
    branch: 'both',
    fingerprint: { anal: 9, creative: 5, comm: 6, tech: 5, organize: 8, lead: 8, care: 3 },
    description: 'يدرس الأسواق والموارد والقرارات الاقتصادية بأدوات تحليلية ورياضية، ويؤهل لفهم الاقتصاد المحلي والعالمي.',
    whatYouStudy: [
      'الاقتصاد الكلي والجزئي',
      'الإحصاء والاقتصاد القياسي',
      'السياسات الاقتصادية',
      'الاقتصاد الدولي',
      'التحليل المالي'
    ],
    universities: [
      'جامعة دمشق',
      'جامعة حلب'
    ],
    careers: [
      'المصارف',
      'المؤسسات المالية',
      'وزارة الاقتصاد',
      'البحث الاقتصادي',
      'الاستشارات المالية'
    ],
    advice: 'إذا أحببت التحليل والتفكير في الأنظمة الكبيرة، فهذا تخصصك. الاقتصاد يجمع بين الرياضيات والفكر الاجتماعي.'
  },
  {
    id: 'business_admin',
    name: 'إدارة الأعمال',
    icon: 'briefcase',
    type: 'كلية',
    duration: '4 سنوات',
    direction: 'business',
    branch: 'both',
    fingerprint: { anal: 7, creative: 6, comm: 9, tech: 4, organize: 9, lead: 10, care: 5 },
    description: 'يركز على الإدارة والتسويق والموارد البشرية والعمليات واتخاذ القرار داخل المؤسسات والمشاريع.',
    whatYouStudy: [
      'مبادئ الإدارة',
      'التسويق',
      'إدارة الموارد البشرية',
      'إدارة العمليات',
      'ريادة الأعمال'
    ],
    universities: [
      'جامعة دمشق',
      'جامعة حلب'
    ],
    careers: [
      'الإدارة',
      'التسويق',
      'الموارد البشرية',
      'ريادة الأعمال',
      'الاستشارات الإدارية'
    ],
    advice: 'إذا أحببت القيادة والعمل مع الفرق والمشاريع، فهذا تخصصك. الإدارة تُدرس في كل مؤسسة تقريباً.'
  },
  {
    id: 'accounting',
    name: 'المحاسبة',
    icon: 'calculator',
    type: 'كلية',
    duration: '4 سنوات',
    direction: 'business',
    branch: 'both',
    fingerprint: { anal: 8, creative: 4, comm: 5, tech: 4, organize: 10, lead: 5, care: 2 },
    description: 'تختص بتسجيل وتحليل العمليات المالية وإعداد التقارير والرقابة المالية والتدقيق.',
    whatYouStudy: [
      'المحاسبة المالية',
      'محاسبة التكاليف',
      'التدقيق',
      'المحاسبة الإدارية',
      'الضرائب'
    ],
    universities: [
      'جامعة دمشق',
      'جامعة حلب'
    ],
    careers: [
      'المحاسبة',
      'التدقيق',
      'الشؤون المالية',
      'المصارف',
      'شركات الاستثمار'
    ],
    advice: 'إذا أحببت الدقة والأرقام والتنظيم، فهذا تخصصك. المحاسب هو الشخص الذي تثق به كل المؤسسات.'
  },
  {
    id: 'banking_insurance',
    name: 'المصارف والتأمين',
    icon: 'landmark',
    type: 'كلية',
    duration: '4 سنوات',
    direction: 'business',
    branch: 'both',
    fingerprint: { anal: 8, creative: 5, comm: 8, tech: 5, organize: 7, lead: 8, care: 2 },
    description: 'يركز على العمليات المصرفية والتأمينية وإدارة المخاطر المالية والتحليل المالي.',
    whatYouStudy: [
      'العمليات المصرفية',
      'التأمين وإدارة المخاطر',
      'الأسواق المالية',
      'التحليل المالي',
      'المصارف الإسلامية'
    ],
    universities: [
      'جامعة دمشق',
      'جامعة حلب'
    ],
    careers: [
      'المصارف',
      'شركات التأمين',
      'البورصة',
      'الإدارة المالية',
      'الاستشارات المالية'
    ],
    advice: 'مناسب لمحبي الأرقام والتحليل المالي والتواصل مع العملاء. القطاع المصرفي من أكثر القطاعات تنظيماً.'
  },
  {
    id: 'finance_institute',
    name: 'العلوم المالية والمصرفية',
    icon: 'banknote',
    type: 'معهد',
    duration: 'سنتان',
    direction: 'business',
    branch: 'both',
    fingerprint: { anal: 7, creative: 3, comm: 7, tech: 5, organize: 10, lead: 5, care: 2 },
    description: 'برنامج تطبيقي قصير في المحاسبة والمصارف والتأمين، يؤهل للعمل المباشر في القطاع المالي.',
    whatYouStudy: [
      'المحاسبة التطبيقية',
      'العمليات المصرفية',
      'التأمين',
      'الإدارة المالية',
      'الأنظمة المحاسبية'
    ],
    universities: [
      'المعاهد التقانية'
    ],
    careers: [
      'المصارف',
      'شركات التأمين',
      'المحاسبة',
      'الحسابات المالية',
      'المؤسسات التجارية'
    ],
    advice: 'طريق سريع نحو سوق العمل المالي. مناسب لمن يريد التخصص دون قضاء سنوات طويلة في الدراسة.'
  },
  {
    id: 'business_marketing_institute',
    name: 'إدارة الأعمال والتسويق',
    icon: 'megaphone',
    type: 'معهد',
    duration: 'سنتان',
    direction: 'business',
    branch: 'both',
    fingerprint: { anal: 6, creative: 7, comm: 9, tech: 4, organize: 8, lead: 8, care: 3 },
    description: 'تدريب تطبيقي في التسويق وإدارة الأعمال وخدمة العملاء والتسويق الرقمي.',
    whatYouStudy: [
      'مبادئ التسويق',
      'إدارة الأعمال',
      'خدمة العملاء',
      'التسويق الرقمي',
      'إدارة المبيعات'
    ],
    universities: [
      'المعاهد التقانية'
    ],
    careers: [
      'المبيعات',
      'التسويق',
      'خدمة العملاء',
      'إدارة المتاجر',
      'التسويق الرقمي'
    ],
    advice: 'إذا أحببت التواصل مع الناس والتسويق والإبداع التجاري، فهذا مناسب. يجمع بين الإدارة والإبداع.'
  },

  // People and society (7)
  {
    id: 'media',
    name: 'الإعلام',
    icon: 'newspaper',
    type: 'كلية',
    duration: '4 سنوات',
    direction: 'humanities',
    branch: 'lit',
    fingerprint: { anal: 6, creative: 9, comm: 10, tech: 4, organize: 6, lead: 6, care: 4 },
    description: 'يشمل الصحافة والإذاعة والتلفزيون والإعلام الإلكتروني والعلاقات العامة، ويؤهل لصناعة المحتوى الإعلامي.',
    whatYouStudy: [
      'الكتابة الصحفية',
      'الإنتاج الإعلامي',
      'الإعلام الرقمي',
      'العلاقات العامة',
      'التصوير والمونتاج'
    ],
    universities: [
      'جامعة دمشق'
    ],
    careers: [
      'الصحافة',
      'الإذاعة والتلفزيون',
      'الإعلام الرقمي',
      'العلاقات العامة',
      'صناعة المحتوى'
    ],
    advice: 'إذا أحببت التعبير والتواصل مع الناس وصناعة المحتوى، فهذا مجالك. الإعلام اليوم يمتد من التلفزيون إلى المنصات الرقمية.'
  },
  {
    id: 'education',
    name: 'التربية (معلم صف / مناهج)',
    icon: 'graduationCap',
    type: 'كلية',
    duration: '4 سنوات',
    direction: 'humanities',
    branch: 'lit',
    fingerprint: { anal: 6, creative: 9, comm: 10, tech: 3, organize: 7, lead: 7, care: 10 },
    description: 'يؤهل لتدريس المرحلة الابتدائية وتصميم المناهج وطرائق التدريس وتقنيات التعليم.',
    whatYouStudy: [
      'علم النفس التربوي',
      'المناهج وطرائق التدريس',
      'تقنيات التعليم',
      'القياس والتقويم',
      'الإرشاد التربوي'
    ],
    universities: [
      'جامعة دمشق',
      'جامعة حلب'
    ],
    careers: [
      'التعليم',
      'تطوير المناهج',
      'الإرشاد التربوي',
      'التدريب',
      'إدارة المؤسسات التعليمية'
    ],
    advice: 'إذا أحببت التعليم ورعاية الأطفال والمساهمة في بناء الأجيال، فهذا تخصصك. التعليم رسالة قبل أن يكون مهنة.'
  },
  {
    id: 'psychology_counseling',
    name: 'الإرشاد النفسي',
    icon: 'messageHeart',
    type: 'كلية',
    duration: '4 سنوات',
    direction: 'humanities',
    branch: 'lit',
    fingerprint: { anal: 8, creative: 5, comm: 10, tech: 2, organize: 6, lead: 4, care: 10 },
    description: 'يركز على مساعدة الأفراد في التعامل مع التحديات النفسية والاجتماعية، وتقديم الدعم النفسي والتربوي.',
    whatYouStudy: [
      'علم النفس العام',
      'الإرشاد الفردي والجماعي',
      'الصحة النفسية',
      'تقنيات التدخل',
      'علم النفس التربوي'
    ],
    universities: [
      'جامعة دمشق'
    ],
    careers: [
      'المدارس',
      'المراكز الاجتماعية',
      'المستشفيات',
      'العيادات النفسية',
      'برامج الدعم الأسري'
    ],
    advice: 'إذا أحببت الاستماع ومساعدة الناس وتفهم مشاعرهم، فهذا تخصصك. الإرشاد النفسي يجمع بين العلم والإنسانية.'
  },
  {
    id: 'law',
    name: 'الحقوق',
    icon: 'scale',
    type: 'كلية',
    duration: '4 سنوات',
    direction: 'humanities',
    branch: 'lit',
    fingerprint: { anal: 10, creative: 5, comm: 8, tech: 3, organize: 6, lead: 8, care: 5 },
    description: 'يدرس القواعد القانونية وفروعها والعلاقات والحقوق والواجبات، ويؤهل للعمل في المجال القانوني والقضائي.',
    whatYouStudy: [
      'القانون المدني',
      'القانون الجزائي',
      'القانون الدولي',
      'القانون الدستوري',
      'القانون التجاري'
    ],
    universities: [
      'جامعة دمشق',
      'جامعة حلب'
    ],
    careers: [
      'المحاماة',
      'القضاء',
      'الشؤون القانونية',
      'الإدارات العامة',
      'الاستشارات القانونية'
    ],
    advice: 'إذا أحببت المنطق والعدالة والدفاع عن الحقوق، فهذا تخصصك. الحقوق تفتح أبواباً مهنية متنوعة.'
  },
  {
    id: 'political_science',
    name: 'العلوم السياسية',
    icon: 'globe',
    type: 'كلية',
    duration: '4 سنوات',
    direction: 'humanities',
    branch: 'lit',
    fingerprint: { anal: 10, creative: 6, comm: 10, tech: 5, organize: 6, lead: 10, care: 4 },
    description: 'يدرس الأنظمة السياسية والعلاقات الدولية والسياسات العامة، ويؤهل للعمل في المجال الدبلوماسي والتحليلي.',
    whatYouStudy: [
      'النظريات السياسية',
      'العلاقات الدولية',
      'السياسات العامة',
      'الإدارة العامة',
      'تاريخ السياسة'
    ],
    universities: [
      'جامعة دمشق'
    ],
    careers: [
      'السلك الدبلوماسي',
      'الإعلام السياسي',
      'المنظمات الدولية',
      'البحث السياسي',
      'الإدارة العامة'
    ],
    advice: 'إذا أحببت التحليل السياسي والقضايا الدولية والقيادة، فهذا مجالك. مناسب لمحبي فهم العالم وإدارة الأمور العامة.'
  },
  {
    id: 'sharia',
    name: 'الشريعة',
    icon: 'bookOpen',
    type: 'كلية',
    duration: '4 سنوات',
    direction: 'humanities',
    branch: 'lit',
    fingerprint: { anal: 9, creative: 3, comm: 8, tech: 2, organize: 8, lead: 7, care: 8 },
    description: 'يدرس الفقه الإسلامي وأصوله والعلوم الشرعية، ويؤهل للعمل في المجالات الدينية والتعليمية والقضائية الشرعية.',
    whatYouStudy: [
      'الفقه وأصوله',
      'التفسير',
      'الحديث',
      'العقيدة',
      'المقارنة بين المذاهب'
    ],
    universities: [
      'جامعة دمشق',
      'جامعة حلب'
    ],
    careers: [
      'التعليم',
      'الدعوة',
      'القضاء الشرعي',
      'المؤسسات الدينية',
      'الإرشاد الأسري'
    ],
    advice: 'إذا كان اهتمامك بالعلوم الشرعية والفكر الإسلامي، فهذا تخصصك. يجمع بين العلم الديني والقيم الإنسانية.'
  },
  {
    id: 'tourism_hospitality',
    name: 'السياحة والفندقة',
    icon: 'plane',
    type: 'كلية',
    duration: '4 سنوات',
    direction: 'humanities',
    branch: 'lit',
    fingerprint: { anal: 5, creative: 9, comm: 10, tech: 3, organize: 9, lead: 6, care: 7 },
    description: 'يؤهل للعمل في القطاع السياحي والفندقي وإدارة الخدمات والضيافة والإرشاد السياحي.',
    whatYouStudy: [
      'إدارة الفنادق',
      'السياحة والضيافة',
      'خدمة العملاء',
      'الإرشاد السياحي',
      'تنظيم الفعاليات'
    ],
    universities: [
      'جامعة دمشق',
      'المعاهد التقانية'
    ],
    careers: [
      'الفنادق',
      'شركات السياحة',
      'المطاعم',
      'الإرشاد السياحي',
      'تنظيم الفعاليات'
    ],
    advice: 'إذا أحببت السفر والتواصل مع الناس وإدارة التجارب، فهذا تخصصك. السياحة قطاع ينمو باستمرار.'
  },

  // Culture and arts (5)
  {
    id: 'literature',
    name: 'الآداب (لغات / تاريخ / جغرافيا / فلسفة / اجتماع)',
    icon: 'feather',
    type: 'كلية',
    duration: '4 سنوات',
    direction: 'culture',
    branch: 'lit',
    fingerprint: { anal: 8, creative: 10, comm: 6, tech: 3, organize: 6, lead: 4, care: 4 },
    description: 'يضم تخصصات إنسانية متنوعة تشمل اللغات والتاريخ والجغرافيا والفلسفة وعلم الاجتماع، ويؤهل للعمل الثقافي والأكاديمي.',
    whatYouStudy: [
      'الأدب واللغة',
      'التاريخ والحضارات',
      'الفلسفة والمنطق',
      'علم الاجتماع',
      'الجغرافيا البشرية'
    ],
    universities: [
      'جامعة دمشق',
      'جامعة حلب'
    ],
    careers: [
      'التعليم',
      'الترجمة',
      'الإعلام والثقافة',
      'البحث الأكاديمي',
      'العمل الثقافي'
    ],
    advice: 'للذين يحبون الفكر والتعبير والثقافة. الآداب تفتح أبواباً في التعليم والإعلام والترجمة والبحث.'
  },
  {
    id: 'fine_arts',
    name: 'الفنون الجميلة',
    icon: 'palette',
    type: 'كلية',
    duration: '4-5 سنوات',
    direction: 'culture',
    branch: 'lit',
    fingerprint: { anal: 5, creative: 10, comm: 5, tech: 3, organize: 5, lead: 4, care: 5 },
    description: 'يطور المهارات الفنية في الرسم والتصوير والنحت والتصميم والفنون البصرية، ويؤهل للعمل الفني والإبداعي.',
    whatYouStudy: [
      'الرسم والتصوير',
      'النحت',
      'التصميم الجرافيكي',
      'تاريخ الفن',
      'الفنون الرقمية'
    ],
    universities: [
      'جامعة دمشق',
      'جامعة حلب'
    ],
    careers: [
      'التصميم الجرافيكي',
      'الفن الحر',
      'التعليم الفني',
      'الاستوديوهات الفنية',
      'الإخراج الفني'
    ],
    advice: 'إذا كنت فناناً بالفطرة وتحب التعبير البصري، فهذا تخصصك. الفن يجمع بين الموهبة والتدريب المستمر.'
  },
  {
    id: 'applied_arts',
    name: 'الفنون التطبيقية',
    icon: 'shapes',
    type: 'معهد',
    duration: 'سنتان',
    direction: 'culture',
    branch: 'lit',
    fingerprint: { anal: 5, creative: 10, comm: 4, tech: 7, organize: 7, lead: 2, care: 2 },
    description: 'تطبيق الفن في المنتجات والتصميم العملي كالتصميم الجرافيكي والداخلي والخزف والنسيج.',
    whatYouStudy: [
      'التصميم الجرافيكي',
      'التصميم الداخلي',
      'الخزف والنحت',
      'النسيج والأزياء',
      'التصوير الفوتوغرافي'
    ],
    universities: [
      'المعاهد التقانية'
    ],
    careers: [
      'التصميم الجرافيكي',
      'الديكور',
      'صناعة المنتجات الفنية',
      'تصميم الأزياء',
      'التصوير'
    ],
    advice: 'إذا أحببت الفن بجانبه العملي والتطبيقي، فهذا خيارك. يجمع بين الإبداع والمهارات التقنية.'
  },
  {
    id: 'archaeology',
    name: 'الآثار',
    icon: 'vase',
    type: 'كلية',
    duration: '4 سنوات',
    direction: 'culture',
    branch: 'lit',
    fingerprint: { anal: 9, creative: 8, comm: 4, tech: 7, organize: 8, lead: 5, care: 3 },
    description: 'يدرس الحضارات القديمة والمواقع الأثرية والتراث الثقافي وطرق التنقيب والترميم.',
    whatYouStudy: [
      'الآثار الشرقية',
      'الآثار الكلاسيكية',
      'الآثار الإسلامية',
      'التنقيب الأثري',
      'الترميم والصيانة'
    ],
    universities: [
      'جامعة دمشق',
      'جامعة حلب'
    ],
    careers: [
      'المتاحف',
      'المواقع الأثرية',
      'وزارة الثقافة',
      'البحث الأثري',
      'الترميم والصيانة'
    ],
    advice: 'للذين يعشقون التاريخ والحضارات ويريدون المساهمة في الحفاظ على التراث الإنساني.'
  },
  {
    id: 'library_science',
    name: 'المكتبات والمعلومات',
    icon: 'library',
    type: 'كلية',
    duration: '4 سنوات',
    direction: 'culture',
    branch: 'lit',
    fingerprint: { anal: 8, creative: 5, comm: 5, tech: 8, organize: 10, lead: 4, care: 2 },
    description: 'يختص بتنظيم المعلومات والأرشفة وإدارة المكتبات ومراكز المعلومات والتحول الرقمي.',
    whatYouStudy: [
      'علم المعلومات',
      'الفهرسة والتصنيف',
      'الأرشفة الرقمية',
      'إدارة المكتبات',
      'البحث والتوثيق'
    ],
    universities: [
      'جامعة دمشق'
    ],
    careers: [
      'المكتبات',
      'مراكز المعلومات',
      'الأرشيف',
      'التوثيق',
      'إدارة البيانات'
    ],
    advice: 'إذا أحببت التنظيم والمعرفة والتعامل مع المعلومات، فهذا تخصصك. تخصص مطلوب في عصر المعلومات.'
  }
];

function findProblem(spec, seenIds) {
  if (!spec.id || seenIds.has(spec.id)) return 'missing or duplicate id';
  if (!DIRECTIONS[spec.direction]) return `unknown direction "${spec.direction}"`;
  if (!BRANCHES.includes(spec.branch)) return `unknown branch "${spec.branch}"`;
  if (!TYPES.includes(spec.type)) return `unknown type "${spec.type}"`;

  const badDimensions = DIMENSION_KEYS.filter(key => !(spec.fingerprint?.[key] >= 0 && spec.fingerprint[key] <= 10));
  if (badDimensions.length) return `fingerprint missing or out of range for: ${badDimensions.join(', ')}`;

  const emptyLists = ['whatYouStudy', 'universities', 'careers'].filter(key => !spec[key]?.length);
  if (emptyLists.length) return `empty list: ${emptyLists.join(', ')}`;
  return '';
}

// A bad entry is skipped (and logged) instead of breaking the whole site.
// scoring.js expects the fingerprint as an array in DIMENSION_KEYS order, so it is built here from the named values.
const seenIds = new Set();
export const SPECIALIZATIONS = SPECS
  .filter(spec => {
    const problem = findProblem(spec, seenIds);
    if (problem) console.error(`specializations.js: "${spec.id}" skipped: ${problem}`);
    else seenIds.add(spec.id);
    return !problem;
  })
  .map(spec => ({ ...spec, fingerprint: DIMENSION_KEYS.map(key => spec.fingerprint[key]) }));
