/**
 * Result scoring.
 *
 * answers -> per-dimension scores -> vector (DIMENSION_KEYS order) -> Pearson
 * correlation with every specialization fingerprint -> ranking -> grouped by
 * direction -> top two directions (two specializations each) -> confidence.
 *
 * Deterministic for a given set of answers. The constants marked "calibrated"
 * were tuned by simulating thousands of random and profiled answer sets against
 * the current question bank; run that simulation again whenever the questions,
 * the specializations or their fingerprints change.
 */

import { DIMENSION_KEYS } from './dimensions.js?v=2.1';
import { SPECIALIZATIONS } from './specializations.js?v=2.1';
import { DIRECTIONS } from './directions.js?v=2.1';

const NEUTRAL_SCORE = 5;

/**
 * @param {Object<string, number[]>} answersByDimension  e.g. { anal: [10, 0, 10], ... }
 * @returns {Object<string, number>} mean score per dimension (neutral when nothing was answered)
 */
export function calculateDimensionScores(answersByDimension) {
  const scores = {};
  for (const key of DIMENSION_KEYS) {
    const values = answersByDimension[key] || [];
    scores[key] = values.length
      ? values.reduce((sum, value) => sum + value, 0) / values.length
      : NEUTRAL_SCORE;
  }
  return scores;
}

/** Orders dimension scores by DIMENSION_KEYS so they line up with the fingerprints. */
export function toVector(scores) {
  return DIMENSION_KEYS.map(key => scores[key] || 0);
}

/**
 * Pearson correlation (-1..+1), i.e. cosine similarity after centering both
 * vectors. Plain cosine makes every specialization look alike because all the
 * values are positive; centering spreads them out.
 */
function pearsonCorrelation(vectorA, vectorB) {
  if (vectorA.length !== vectorB.length) {
    throw new Error('المتجهان يجب أن يكونا بنفس الطول');
  }

  const length = vectorA.length;
  const meanA = vectorA.reduce((sum, value) => sum + value, 0) / length;
  const meanB = vectorB.reduce((sum, value) => sum + value, 0) / length;

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  for (let i = 0; i < length; i++) {
    const a = vectorA[i] - meanA;
    const b = vectorB[i] - meanB;
    dotProduct += a * b;
    magnitudeA += a * a;
    magnitudeB += b * b;
  }

  // A constant vector has no variance, so the correlation is undefined: treat it as 0.
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

/** Maps -1..+1 onto 0..100. */
const toPercent = pearson => (pearson + 1) * 50;

/**
 * Per-direction offset in percentage points (calibrated).
 * Directions differ in size and in how alike their fingerprints are, which
 * caps the best score each one can reach. These small shifts even that out (a
 * random student lands in each direction about 20% of the time) without
 * reordering specializations inside a direction.
 * Check it with `node tools/simulate.mjs`.
 */
const DIRECTION_CALIBRATION = Object.freeze({
  health: -2.2,
  engineering: -0.6,
  business: 3.5,
  humanities: -1.6,
  culture: 0.1
});

/** @returns {Array} the specializations with a `score` (0..100), best first */
function rankSpecializations(studentVector, specializations) {
  return specializations
    .map(spec => {
      const raw = toPercent(pearsonCorrelation(studentVector, spec.fingerprint));
      const score = raw + (DIRECTION_CALIBRATION[spec.direction] || 0);
      return { ...spec, score: Math.min(100, Math.max(0, score)) };
    })
    .sort((a, b) => b.score - a.score);
}

/** @returns {Object<string, Array>} direction key -> its specializations, order kept */
function groupByDirection(ranked) {
  const groups = {};
  for (const spec of ranked) {
    if (!groups[spec.direction]) groups[spec.direction] = [];
    groups[spec.direction].push(spec);
  }
  return groups;
}

/** A direction is as strong as its best specialization; keeps the top two of each. */
function rankDirections(groups) {
  return Object.entries(groups)
    .map(([key, specs]) => ({
      direction: key,
      info: DIRECTIONS[key],
      topScore: specs[0].score,
      top2: specs.slice(0, 2)
    }))
    .sort((a, b) => b.topScore - a.topScore);
}

/* ---------- Confidence ---------- */

const note = (level, label, message) => Object.freeze({ level, label, message });

const CONFIDENCE = Object.freeze({
  high: note('high', 'عالية', 'نتيجتك واضحة — الاتجاه الأول يتفوق بوضوح على الاتجاه الثاني.'),
  good: note('good', 'جيدة', 'يتفوق اتجاه واحد مع تداخل بسيط مع اتجاه آخر، وكلاهما يستحق النظر.'),
  close: note('close', 'متقاربة', 'اتجاهان يتنافسان بقوة متقاربة، ويُفضّل أن تستكشف كليهما بعمق قبل الاختيار.'),
  weak: note('weak', 'منخفضة', 'اهتماماتك موزعة على أكثر من اتجاه بقوة متقاربة، وهذا طبيعي. استكشف الاتجاهين وتعرّف على تخصصات كل منهما قبل أن تقرر.')
});

// Replacements chosen by answer quality (see applyQuality)
const QUALITY_NOTES = Object.freeze({
  straight: note('weak', 'منخفضة', 'لاحظنا أنك اخترت الموضع نفسه في أغلب الأسئلة، فقد لا تعكس النتيجة تفضيلاتك. جرّب الاختبار مرة أخرى بهدوء وقراءة كل خيار.'),
  flat: note('weak', 'منخفضة', 'كانت اختياراتك متقاربة بين المجالات، فلم يظهر مجال متفوق بوضوح. هذا يحدث أحياناً، ويمكنك إعادة الاختبار لاحقاً أو استكشاف الاتجاهين معاً.'),
  mild: note('good', 'جيدة', 'النتيجة واضحة نسبيًا، لكن اختياراتك كانت متقاربة قليلًا بين المجالات، فاستكشف الاتجاهين قبل أن تقرر.'),
  few: note('medium', 'متوسطة', 'أجبت عن عدد قليل من الأسئلة، لذا النتيجة أقل دقة من المعتاد. أعد الاختبار كاملاً للحصول على نتيجة أوضح.')
});

// Gap (in points) between the first and second direction
const HIGH_GAP = 12;
const GOOD_GAP = 7;
const CLOSE_GAP = 3;

function confidenceForGap(gap) {
  if (gap >= HIGH_GAP) return CONFIDENCE.high;
  if (gap >= GOOD_GAP) return CONFIDENCE.good;
  if (gap >= CLOSE_GAP) return CONFIDENCE.close;
  return CONFIDENCE.weak;
}

/* ---------- Answer quality ---------- */

const STRAIGHT_MIN_ANSWERS = 10;   // fewer answers than this: not enough to call it a pattern
const STRAIGHT_RATIO = 0.8;        // same option position in this share of the answers
const MIN_SPREAD = 2;              // gap between the highest and lowest dimension score
const PATTERN_MIN_ANSWERS = 10;
const MIN_ANSWERED_RATIO = 0.7;

/**
 * "Pattern" is a chi-square-like distance between how often each dimension was
 * chosen and the 25% expected from picking at random among 4 options
 * (calibrated on the 18-question quiz):
 *   random answers: median ~4.8 (90% below 9); average student ~10; clear preferences ~16.
 * Under FLAT_PATTERN there is no reliable preference; under MILD_PATTERN it is
 * weak, so confidence is never "high" however large the gap.
 */
const FLAT_PATTERN = 5.5;
const MILD_PATTERN = 9;

/**
 * Flags answer sets that deserve less trust:
 *  - straight: the same option position in most answers (probably not reading)
 *  - flat / mild: choices spread evenly across dimensions, nothing stands out
 *  - few: fewer than 70% of the questions answered
 */
export function assessAnswerQuality({ answered = 0, total = 18, positions = [], vector = [], tallies = null } = {}) {
  const flags = [];
  const spread = vector.length ? Math.max(...vector) - Math.min(...vector) : 0;

  if (positions.length >= STRAIGHT_MIN_ANSWERS) {
    const counts = {};
    positions.forEach(position => { counts[position] = (counts[position] || 0) + 1; });
    if (Math.max(...Object.values(counts)) / positions.length >= STRAIGHT_RATIO) flags.push('straight');
  }

  let pattern = null;
  if (tallies) {
    pattern = Object.values(tallies).reduce((sum, { offered, chosen }) => {
      const expected = 0.25 * offered;
      return expected ? sum + ((chosen - expected) ** 2) / expected : sum;
    }, 0);
  }
  const enoughForPattern = pattern !== null && answered >= PATTERN_MIN_ANSWERS;
  if (spread < MIN_SPREAD || (enoughForPattern && pattern < FLAT_PATTERN)) flags.push('flat');
  else if (enoughForPattern && pattern < MILD_PATTERN) flags.push('mild');
  if (answered < Math.ceil(total * MIN_ANSWERED_RATIO)) flags.push('few');

  return { flags, spread, answered, pattern };
}

/** Lowers the confidence according to answer quality; never raises it. */
function applyQuality(confidence, quality) {
  const flags = quality?.flags || [];

  if (flags.includes('straight')) return QUALITY_NOTES.straight;
  if (flags.includes('flat')) return QUALITY_NOTES.flat;
  if (flags.includes('mild') && confidence.level === 'high') return QUALITY_NOTES.mild;
  if (flags.includes('few') && (confidence.level === 'high' || confidence.level === 'good')) return QUALITY_NOTES.few;
  return confidence;
}

/* ---------- Branch filter and final result ---------- */

/**
 * A literary-branch student only sees literary and shared (`both`)
 * specializations; a scientific-branch student sees everything. The filter runs
 * before ranking, so scientific specializations never take part in the scores,
 * the gap or the confidence a literary student gets.
 *
 * The app stores the Arabic label ('أدبي' / 'علمي'); the internal key 'lit'
 * works too.
 */
const LITERARY_BRANCH_VALUES = ['أدبي', 'lit'];

function filterByBranch(userBranch, specializations = SPECIALIZATIONS) {
  if (!LITERARY_BRANCH_VALUES.includes(userBranch)) return specializations;
  return specializations.filter(spec => spec.branch === 'lit' || spec.branch === 'both');
}

/**
 * @param {number[]} studentVector
 * @param {string} [userBranch='علمي']  'علمي' (all specializations) or 'أدبي' (literary + shared)
 * @param {Object|null} [quality]        output of assessAnswerQuality
 * @returns {{first, second, confidence, gap, quality}}
 */
export function computeResult(studentVector, userBranch = 'علمي', quality = null) {
  const ranked = rankSpecializations(studentVector, filterByBranch(userBranch));
  const directions = rankDirections(groupByDirection(ranked));

  const first = directions[0];
  // With a single direction there is no runner-up; reuse the first.
  const second = directions[1] || first;

  // Round first, then pick the level from the rounded gap, so the number
  // shown and the confidence label can never disagree.
  const gap = Math.round((first.topScore - second.topScore) * 10) / 10;
  const confidence = applyQuality(confidenceForGap(gap), quality);

  return { first, second, confidence, gap, quality };
}
