"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTaxBreakdown = void 0;
const calculateTaxBreakdown = (items, shippingFee, shippingTaxRate, otherFee, otherFeeTaxRate) => {
    const breakdown = new Map();
    // 1. Goods Tax
    let goodsTax = 0;
    items.forEach(item => {
        const tax = item.amount * (item.taxRate / 100);
        goodsTax += tax;
        const current = breakdown.get(item.taxRate) || 0;
        breakdown.set(item.taxRate, current + tax);
    });
    // 2. Shipping Tax
    const shippingTax = shippingFee * (shippingTaxRate / 100);
    if (shippingFee > 0) {
        const current = breakdown.get(shippingTaxRate) || 0;
        breakdown.set(shippingTaxRate, current + shippingTax);
    }
    // 3. Other Tax
    const otherTax = otherFee * (otherFeeTaxRate / 100);
    if (otherFee > 0) {
        const current = breakdown.get(otherFeeTaxRate) || 0;
        breakdown.set(otherFeeTaxRate, current + otherTax);
    }
    const totalTax = goodsTax + shippingTax + otherTax;
    // Convert map to array for storage
    const breakdownArray = Array.from(breakdown.entries()).map(([rate, amount]) => ({
        rate,
        amount
    })).sort((a, b) => b.rate - a.rate);
    return {
        goodsTax,
        shippingTax,
        otherTax,
        totalTax,
        breakdown: breakdownArray
    };
};
exports.calculateTaxBreakdown = calculateTaxBreakdown;
