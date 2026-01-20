"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const shipping_1 = require("./shipping");
(0, vitest_1.describe)('Shipping Calculation Logic', () => {
    const defaultConfig = {
        method: 'region_parcel',
        parcelLimit: 30,
        flatRateAmount: 30000
    };
    const priceConfigs = [
        { regionId: 'R1', shippingGroupId: null, price: 50000, surcharge: 10000 },
        { regionId: 'R1', shippingGroupId: 'G1', price: 80000, surcharge: 15000 }
    ];
    (0, vitest_1.it)('should calculate flat rate correctly', () => {
        const config = { ...defaultConfig, method: 'flat_rate' };
        const items = [{ massKg: 10, quantity: 1 }];
        const result = (0, shipping_1.calculateShippingFeeCore)(config, [], items, 'R1');
        (0, vitest_1.expect)(result.shippingFee).toBe(30000);
        (0, vitest_1.expect)(result.packageCount).toBe(1);
    });
    (0, vitest_1.it)('should calculate region_parcel correctly (Under limit)', () => {
        const items = [{ massKg: 10, quantity: 1 }]; // 10kg < 30kg
        const result = (0, shipping_1.calculateShippingFeeCore)(defaultConfig, priceConfigs, items, 'R1');
        // Fee = Price + Surcharge = 50k + 10k = 60k
        (0, vitest_1.expect)(result.shippingFee).toBe(60000);
        (0, vitest_1.expect)(result.packageCount).toBe(1);
    });
    (0, vitest_1.it)('should calculate region_parcel correctly (Over limit - Multiple parcels)', () => {
        const items = [{ massKg: 40, quantity: 1 }]; // 40kg = 1 full (30kg) + 1 partial (10kg)
        const result = (0, shipping_1.calculateShippingFeeCore)(defaultConfig, priceConfigs, items, 'R1');
        // Full parcel: 50k
        // Partial parcel: 50k + 10k = 60k
        // Total: 110k
        (0, vitest_1.expect)(result.shippingFee).toBe(110000);
        (0, vitest_1.expect)(result.packageCount).toBe(2);
    });
    (0, vitest_1.it)('should calculate custom kg rate correctly', () => {
        const config = { ...defaultConfig, method: 'zkapet_custom' };
        const items = [{ massKg: 2, quantity: 10 }]; // 20kg
        const result = (0, shipping_1.calculateShippingFeeCore)(config, priceConfigs, items, 'R1');
        // 20kg * 50k = 1tr. (Min fee is 10k, so 1tr is used)
        (0, vitest_1.expect)(result.shippingFee).toBe(1000000);
    });
    (0, vitest_1.it)('should use min fee if calculated fee is too low in custom mode', () => {
        const config = { ...defaultConfig, method: 'zkapet_custom' };
        const items = [{ massKg: 0.1, quantity: 1 }]; // 0.1kg * 50k = 5k < 10k surcharge
        const result = (0, shipping_1.calculateShippingFeeCore)(config, priceConfigs, items, 'R1');
        (0, vitest_1.expect)(result.shippingFee).toBe(10000); // Should be 10k surcharge
    });
});
