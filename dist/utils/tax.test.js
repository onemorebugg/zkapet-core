"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const tax_1 = require("./tax");
(0, vitest_1.describe)('Tax Calculation Logic', () => {
    (0, vitest_1.it)('should calculate breakdown correctly for multiple tax rates', () => {
        const items = [
            { amount: 100000, taxRate: 10 }, // 10k tax
            { amount: 200000, taxRate: 5 }, // 10k tax
            { amount: 100000, taxRate: 10 }, // 10k tax
        ];
        const result = (0, tax_1.calculateTaxBreakdown)(items, 0, 0, 0, 0);
        (0, vitest_1.expect)(result.totalTax).toBe(30000);
        (0, vitest_1.expect)(result.goodsTax).toBe(30000);
        (0, vitest_1.expect)(result.breakdown).toHaveLength(2);
        const tax10 = result.breakdown.find(b => b.rate === 10);
        const tax5 = result.breakdown.find(b => b.rate === 5);
        (0, vitest_1.expect)(tax10?.amount).toBe(20000);
        (0, vitest_1.expect)(tax5?.amount).toBe(10000);
    });
    (0, vitest_1.it)('should include shipping and other fees in tax calculation', () => {
        const items = [{ amount: 100000, taxRate: 10 }]; // 10k
        const shippingFee = 50000;
        const shippingTaxRate = 8; // 4k
        const otherFee = 20000;
        const otherFeeTaxRate = 10; // 2k
        const result = (0, tax_1.calculateTaxBreakdown)(items, shippingFee, shippingTaxRate, otherFee, otherFeeTaxRate);
        (0, vitest_1.expect)(result.totalTax).toBe(16000); // 10 + 4 + 2
        (0, vitest_1.expect)(result.shippingTax).toBe(4000);
        (0, vitest_1.expect)(result.otherTax).toBe(2000);
        // Breakdown for 10% should be 10k + 2k = 12k
        const tax10 = result.breakdown.find(b => b.rate === 10);
        (0, vitest_1.expect)(tax10?.amount).toBe(12000);
    });
});
