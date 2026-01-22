"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateShippingFeeCore = void 0;
const calculateShippingFeeCore = (config, priceConfigs, items, regionId) => {
    if (!regionId || items.length === 0) {
        return { shippingFee: 0, packageCount: 0, method: 'none', detail: [] };
    }
    if (config.method === 'flat_rate') {
        const totalMass = items.reduce((sum, p) => sum + (p.massKg || 0) * (p.quantity || 0), 0);
        return {
            shippingFee: config.flatRateAmount,
            packageCount: 1,
            method: config.method,
            detail: [{
                    groupId: 'flat',
                    groupName: 'Đồng giá',
                    count: 1,
                    fee: config.flatRateAmount,
                    mass: totalMass,
                    unitPrice: 0,
                    minFee: config.flatRateAmount
                }]
        };
    }
    const groupMasses = {};
    items.forEach(p => {
        const qty = p.quantity || 0;
        const groupKey = p.shippingGroupId || 'default';
        groupMasses[groupKey] = (groupMasses[groupKey] || 0) + (p.massKg || 0) * qty;
    });
    let totalShippingFee = 0;
    let totalPackageCount = 0;
    const detail = [];
    let error = undefined;
    for (const [groupId, mass] of Object.entries(groupMasses)) {
        const priceConfig = priceConfigs.find(sp => String(sp.regionId) === String(regionId) &&
            (groupId === 'default' ? !sp.shippingGroupId : String(sp.shippingGroupId) === groupId));
        if (!priceConfig) {
            error = `Missing price config for region ${regionId} and group ${groupId}`;
            continue; // Or break?
        }
        const unitPrice = priceConfig.price || 0;
        const surcharge = priceConfig.surcharge || 0;
        let fee = 0;
        let count = 0;
        let fullParcels = 0;
        let partialParcels = 0;
        let remainder = 0;
        let isMinFeeApplied = false;
        if (config.method === 'region_parcel') {
            const standardMass = Number(config.parcelLimit || 30);
            const threshold = Number(config.roundThreshold || standardMass);
            fullParcels = Math.floor(mass / standardMass);
            remainder = mass % standardMass;
            let additionalFull = 0;
            if (remainder > 0) {
                if (remainder >= threshold) {
                    additionalFull = 1;
                    partialParcels = 0;
                }
                else {
                    additionalFull = 0;
                    partialParcels = 1;
                }
            }
            fee = (fullParcels + additionalFull) * unitPrice + (partialParcels * (unitPrice + surcharge));
            count = fullParcels + additionalFull + partialParcels;
            // For detail reporting
            fullParcels = fullParcels + additionalFull;
        }
        else if (config.method === 'zkapet_custom') {
            const calculatedFee = mass * unitPrice;
            if (calculatedFee < surcharge) {
                fee = surcharge;
                isMinFeeApplied = true;
            }
            else {
                fee = calculatedFee;
            }
            count = 1;
        }
        totalShippingFee += fee;
        totalPackageCount += count;
        detail.push({
            groupId,
            groupName: '', // Will be filled by wrapper
            mass,
            unitPrice,
            minFee: surcharge,
            count,
            fee,
            fullParcels,
            partialParcels,
            remainder,
            isMinFeeApplied
        });
    }
    return {
        shippingFee: totalShippingFee,
        packageCount: totalPackageCount,
        method: config.method,
        detail,
        error
    };
};
exports.calculateShippingFeeCore = calculateShippingFeeCore;
