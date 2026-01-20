"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateLandedCostAllocation = calculateLandedCostAllocation;
exports.calculateFairShareAllocation = calculateFairShareAllocation;
/**
 * Hàm phân bổ chi phí thu mua chuyên nghiệp
 */
function calculateLandedCostAllocation(lines, landedCosts) {
    if (!landedCosts || landedCosts.length === 0)
        return lines;
    const resultLines = lines.map(l => ({ ...l, additionalCost: 0 }));
    landedCosts.forEach(cost => {
        if (cost.amount <= 0)
            return;
        let totalWeight = 0;
        let totalValue = 0;
        let totalQuantity = 0;
        const totalItems = lines.length;
        lines.forEach(l => {
            totalWeight += (l.mass || 0) * l.qty;
            totalValue += (l.price || 0) * l.qty;
            totalQuantity += l.qty;
        });
        resultLines.forEach(l => {
            let allocatedAmount = 0;
            switch (cost.allocationMethod) {
                case 'weight':
                    if (totalWeight > 0) {
                        allocatedAmount = ((l.mass || 0) * l.qty / totalWeight) * cost.amount;
                    }
                    break;
                case 'value':
                    if (totalValue > 0) {
                        allocatedAmount = ((l.price || 0) * l.qty / totalValue) * cost.amount;
                    }
                    break;
                case 'quantity':
                    if (totalQuantity > 0) {
                        allocatedAmount = (l.qty / totalQuantity) * cost.amount;
                    }
                    break;
                case 'equal':
                    allocatedAmount = cost.amount / totalItems;
                    break;
            }
            // Cộng dồn vào additionalCost (chia cho số lượng để ra đơn giá phí)
            if (l.qty > 0) {
                l.additionalCost = (l.additionalCost || 0) + (allocatedAmount / l.qty);
            }
        });
    });
    return resultLines;
}
/**
 * Phân bổ chi phí theo nguyên tắc Fair Share (Chia đều ngân sách thiếu hụt)
 */
function calculateFairShareAllocation(lines, rule) {
    const resultLines = lines.map(l => ({ ...l })); // Clone
    let totalAllocated = 0;
    if (rule.remainingAmount <= 0)
        return { lines: resultLines, totalAllocated: 0 };
    // Pass 1: Calculate total needed
    let totalNeeded = 0;
    for (const line of resultLines) {
        totalNeeded += (line.qty * rule.unitCost);
    }
    if (totalNeeded === 0)
        return { lines: resultLines, totalAllocated: 0 };
    // Calculate Factor
    const factor = Math.min(1, rule.remainingAmount / totalNeeded);
    // Pass 2: Apply
    for (const line of resultLines) {
        const needed = line.qty * rule.unitCost;
        const allocated = needed * factor;
        if (allocated > 0) {
            line.additionalCost = (line.additionalCost || 0) + (allocated / line.qty);
            totalAllocated += allocated;
        }
    }
    return { lines: resultLines, totalAllocated };
}
