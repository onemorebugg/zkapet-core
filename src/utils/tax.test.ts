import { describe, it, expect } from 'vitest';
import { calculateTaxBreakdown, TaxItem } from './tax';

describe('Tax Calculation Logic', () => {
    it('should calculate breakdown correctly for multiple tax rates', () => {
        const items: TaxItem[] = [
            { amount: 100000, taxRate: 10 }, // 10k tax
            { amount: 200000, taxRate: 5 },  // 10k tax
            { amount: 100000, taxRate: 10 }, // 10k tax
        ];
        
        const result = calculateTaxBreakdown(items, 0, 0, 0, 0);
        
        expect(result.totalTax).toBe(30000);
        expect(result.goodsTax).toBe(30000);
        expect(result.breakdown).toHaveLength(2);
        
        const tax10 = result.breakdown.find(b => b.rate === 10);
        const tax5 = result.breakdown.find(b => b.rate === 5);
        
        expect(tax10?.amount).toBe(20000);
        expect(tax5?.amount).toBe(10000);
    });

    it('should include shipping and other fees in tax calculation', () => {
        const items: TaxItem[] = [{ amount: 100000, taxRate: 10 }]; // 10k
        const shippingFee = 50000;
        const shippingTaxRate = 8; // 4k
        const otherFee = 20000;
        const otherFeeTaxRate = 10; // 2k
        
        const result = calculateTaxBreakdown(items, shippingFee, shippingTaxRate, otherFee, otherFeeTaxRate);
        
        expect(result.totalTax).toBe(16000); // 10 + 4 + 2
        expect(result.shippingTax).toBe(4000);
        expect(result.otherTax).toBe(2000);
        
        // Breakdown for 10% should be 10k + 2k = 12k
        const tax10 = result.breakdown.find(b => b.rate === 10);
        expect(tax10?.amount).toBe(12000);
    });
});
