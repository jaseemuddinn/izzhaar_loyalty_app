// src/lib/loyaltyLogic.js

// Example tier config (can be loaded from DB or admin settings)
const tiers = [
    { min: 0, max: 10000, percent: 10 },      // Under ₹10,000 → 10% points
    { min: 10000, max: 1000000, percent: 10 }, // Under ₹1,00,000 → 10% points
    { min: 1000000, max: Infinity, percent: 5 }, // ₹10,00,000+ → 5% points
];

export function calculateLoyaltyPoints(amount) {
    for (const tier of tiers) {
        if (amount >= tier.min && amount < tier.max) {
            return Math.floor((amount * tier.percent) / 100);
        }
    }
    return 0;
}

export function getTier(amount) {
    for (const tier of tiers) {
        if (amount >= tier.min && amount < tier.max) {
            return tier;
        }
    }
    return null;
}
