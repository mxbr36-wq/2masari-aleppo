/**
 * Career directions: the five groups the specializations roll up into.
 *
 * Each key must match the `direction` field in specializations.js and the keys
 * of DIRECTION_CALIBRATION in scoring.js.
 *
 * `description` is documentation for now; the UI only shows `name` and `icon`.
 */

export const DIRECTIONS = {
  health: {
    name: 'الصحة والعلوم الطبية',
    icon: 'stethoscope',
    description: 'التخصصات التي تهتم بصحة الإنسان والحيوان والعلوم الطبية'
  },
  engineering: {
    name: 'الهندسة والتقنية',
    icon: 'hardHat',
    description: 'التخصصات الهندسية والتقنية والعلوم التطبيقية'
  },
  business: {
    name: 'الاقتصاد والإدارة',
    icon: 'briefcase',
    description: 'التخصصات المالية والإدارية والاقتصادية'
  },
  humanities: {
    name: 'الإنسان والمجتمع',
    icon: 'usersRound',
    description: 'التخصصات التي تهتم بالإنسان والمجتمع والقانون'
  },
  culture: {
    name: 'الثقافة والفنون',
    icon: 'palette',
    description: 'التخصصات الأدبية والفنية والثقافية'
  }
};
