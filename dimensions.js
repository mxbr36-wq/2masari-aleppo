/**
 * Quiz dimensions: the seven traits the quiz measures.
 *
 * The `key` is the contract: questions.js (answer options), specializations.js
 * (fingerprints) and scoring.js all refer to dimensions by key, so renaming one
 * means updating those files too. Order does not affect the results, because
 * every vector is built from DIMENSION_KEYS.
 *
 * `description` is documentation for now; the UI only shows `name` and `icon`.
 */

export const DIMENSIONS = [
  {
    key: 'anal',
    name: 'التحليل المنطقي',
    icon: 'brain',
    description: 'تفكيك المشكلات، الاستنتاج، بناء الحجج، التفكير النظري'
  },
  {
    key: 'creative',
    name: 'الإبداع والتعبير',
    icon: 'sparkles',
    description: 'إنتاج الأفكار الجديدة، التعبير الفني، الرؤية البصرية، الخيال'
  },
  {
    key: 'comm',
    name: 'التواصل الاجتماعي',
    icon: 'messagesSquare',
    description: 'التفاعل مع الناس، الإصغاء، الإقناع، بناء العلاقات'
  },
  {
    key: 'tech',
    name: 'التقنية والبناء',
    icon: 'cpu',
    description: 'التعامل مع الأجهزة، الأنظمة، البناء اليدوي، الحلول العملية'
  },
  {
    key: 'organize',
    name: 'التنظيم والدقة',
    icon: 'clipboardList',
    description: 'الالتزام بالتفاصيل، النظام، الإجراءات، الإتقان'
  },
  {
    key: 'lead',
    name: 'القيادة والمبادرة',
    icon: 'rocket',
    description: 'اتخاذ القرار، تحمل المسؤولية، المبادرة، إدارة الفرق'
  },
  {
    key: 'care',
    name: 'الرعاية والصحة',
    icon: 'heartHandshake',
    description: 'العطاء، الاهتمام بالآخرين، الصحة، مساعدة المحتاجين'
  }
];

export const DIMENSION_KEYS = DIMENSIONS.map(dimension => dimension.key);
