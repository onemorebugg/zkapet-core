import { describe, it, expect } from 'vitest';
import { calculateShippingFeeCore, ShippingConfig, ShippingPriceConfig, ShippingItem } from './shipping';

describe('Shipping Calculation Logic', () => {
    const defaultConfig: ShippingConfig = {
        method: 'region_parcel',
        parcelLimit: 30,
        flatRateAmount: 30000
    };

    const priceConfigs: ShippingPriceConfig[] = [
        { regionId: 'R1', shippingGroupId: null, price: 50000, surcharge: 10000 },
        { regionId: 'R1', shippingGroupId: 'G1', price: 80000, surcharge: 15000 }
    ];

    it('should calculate flat rate correctly', () => {
        const config = { ...defaultConfig, method: 'flat_rate' };
        const items: ShippingItem[] = [{ massKg: 10, quantity: 1 }];
        
        const result = calculateShippingFeeCore(config, [], items, 'R1');
        
        expect(result.shippingFee).toBe(30000);
        expect(result.packageCount).toBe(1);
    });

    it('should calculate region_parcel correctly (Under limit)', () => {
        const items: ShippingItem[] = [{ massKg: 10, quantity: 1 }]; // 10kg < 30kg
        const result = calculateShippingFeeCore(defaultConfig, priceConfigs, items, 'R1');
        
        // Fee = Price + Surcharge = 50k + 10k = 60k
        expect(result.shippingFee).toBe(60000);
        expect(result.packageCount).toBe(1);
    });

    it('should calculate region_parcel correctly (Over limit - Multiple parcels)', () => {
        const items: ShippingItem[] = [{ massKg: 40, quantity: 1 }]; // 40kg = 1 full (30kg) + 1 partial (10kg)
        const result = calculateShippingFeeCore(defaultConfig, priceConfigs, items, 'R1');
        
        // Full parcel: 50k
        // Partial parcel: 50k + 10k = 60k
        // Total: 110k
        expect(result.shippingFee).toBe(110000);
        expect(result.packageCount).toBe(2);
    });

    it('should calculate custom kg rate correctly', () => {
        const config = { ...defaultConfig, method: 'zkapet_custom' };
        const items: ShippingItem[] = [{ massKg: 2, quantity: 10 }]; // 20kg
        
        const result = calculateShippingFeeCore(config, priceConfigs, items, 'R1');
        
        // 20kg * 50k = 1tr. (Min fee is 10k, so 1tr is used)
        expect(result.shippingFee).toBe(1000000);
    });

    it('should use min fee if calculated fee is too low in custom mode', () => {
        const config = { ...defaultConfig, method: 'zkapet_custom' };
        const items: ShippingItem[] = [{ massKg: 0.1, quantity: 1 }]; // 0.1kg * 50k = 5k < 10k surcharge
        
        const result = calculateShippingFeeCore(config, priceConfigs, items, 'R1');
        
        expect(result.shippingFee).toBe(10000); // Should be 10k surcharge
    });
});
