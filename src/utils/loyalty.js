// Aturan loyalty CRM — dipakai bersama oleh POS (ERP), CRM, dan struk.
// 1 poin didapat untuk setiap Rp 10.000 belanja.
export const POINT_EARN_RATE = 10000;

export const TIER_ORDER = ['Standard', 'Silver', 'Gold'];

export const TIER_RULES = {
  Standard: { minSpent: 0, discount: 0, label: 'Standard' },
  Silver: { minSpent: 500000, discount: 5, label: 'Silver' },
  Gold: { minSpent: 1000000, discount: 10, label: 'Gold' }
};

export const pointsForAmount = (amount) => {
  const value = Number(amount) || 0;
  return Math.max(0, Math.floor(value / POINT_EARN_RATE));
};

// Poin tersimpan; pelanggan lama tanpa field loyaltyPoints dihitung dari total belanja.
export const getCustomerPoints = (customer) => {
  if (!customer) return 0;
  if (typeof customer.loyaltyPoints === 'number') return customer.loyaltyPoints;
  return pointsForAmount(customer.totalSpent);
};

// Tier otomatis naik berdasarkan total belanja, tetapi tidak pernah menurunkan
// tier yang sudah diberikan manual oleh admin.
export const resolveTier = (totalSpent, currentTier = 'Standard') => {
  const spent = Number(totalSpent) || 0;
  const earnedTier =
    spent >= TIER_RULES.Gold.minSpent ? 'Gold' :
    spent >= TIER_RULES.Silver.minSpent ? 'Silver' : 'Standard';

  const earnedIndex = TIER_ORDER.indexOf(earnedTier);
  const currentIndex = TIER_ORDER.indexOf(currentTier);

  return currentIndex > earnedIndex ? currentTier : earnedTier;
};

// Progres menuju tier berikutnya untuk ditampilkan di CRM.
export const getTierProgress = (totalSpent, currentTier = 'Standard') => {
  const spent = Number(totalSpent) || 0;
  const normalizedTier = TIER_ORDER.includes(currentTier) ? currentTier : 'Standard';
  const currentIndex = TIER_ORDER.indexOf(normalizedTier);
  const nextTier = TIER_ORDER[currentIndex + 1] || null;

  if (!nextTier) {
    return {
      currentTier: normalizedTier,
      nextTier: null,
      percent: 100,
      remaining: 0,
      targetSpent: TIER_RULES[normalizedTier].minSpent
    };
  }

  const floor = TIER_RULES[normalizedTier].minSpent;
  const target = TIER_RULES[nextTier].minSpent;
  const span = Math.max(1, target - floor);
  const percent = Math.min(100, Math.max(0, ((spent - floor) / span) * 100));

  return {
    currentTier: normalizedTier,
    nextTier,
    percent,
    remaining: Math.max(0, target - spent),
    targetSpent: target
  };
};
