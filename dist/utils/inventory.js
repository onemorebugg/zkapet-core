"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateLandedCostAllocation = calculateLandedCostAllocation;
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
