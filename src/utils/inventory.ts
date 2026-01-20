export interface StockLineInput {
  productId: string;
  qty: number;
  price?: number; // Đơn giá mua (Net Price)
  mass?: number;  // Khối lượng của sản phẩm (kg)
  lotNumber?: string | null;
  expiryDate?: string | null;
  additionalCost?: number; // Chi phí cộng thêm đã phân bổ cho mỗi đơn vị
  taxRate?: number; // Thuế suất (%)
  taxAmount?: number; // Tiền thuế của dòng
}

export interface LandedCostItem {
  name: string;
  amount: number;
  allocationMethod: 'weight' | 'value' | 'quantity' | 'equal';
}

/**
 * Hàm phân bổ chi phí thu mua chuyên nghiệp
 */
export function calculateLandedCostAllocation(lines: StockLineInput[], landedCosts: LandedCostItem[]): StockLineInput[] {
    if (!landedCosts || landedCosts.length === 0) return lines;

    const resultLines = lines.map(l => ({ ...l, additionalCost: 0 }));

    landedCosts.forEach(cost => {
        if (cost.amount <= 0) return;

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

export interface FairShareRule {
    allocationMethod: 'quantity' | 'value';
    allocationRate: number; // Unit Cost (quantity) OR Percentage (value)
    remainingAmount: number;
}

/**
 * Phân bổ chi phí theo nguyên tắc Fair Share (Chia đều ngân sách thiếu hụt)
 */
export function calculateFairShareAllocation(lines: StockLineInput[], rule: FairShareRule): { lines: StockLineInput[], totalAllocated: number } {
    const resultLines = lines.map(l => ({ ...l })); // Clone
    let totalAllocated = 0;

    if (rule.remainingAmount <= 0) return { lines: resultLines, totalAllocated: 0 };

    // Pass 1: Calculate total needed for this batch based on method
    let totalNeeded = 0;
    for (const line of resultLines) {
        if (rule.allocationMethod === 'value') {
            const lineValue = (line.price || 0) * line.qty;
            totalNeeded += (lineValue * rule.allocationRate);
        } else {
            // Default: Quantity
            totalNeeded += (line.qty * rule.allocationRate);
        }
    }

    if (totalNeeded === 0) return { lines: resultLines, totalAllocated: 0 };

    // Calculate Factor (Fair Share)
    const factor = Math.min(1, rule.remainingAmount / totalNeeded);

    // Pass 2: Apply
    for (const line of resultLines) {
        let needed = 0;
        if (rule.allocationMethod === 'value') {
            needed = ((line.price || 0) * line.qty) * rule.allocationRate;
        } else {
            needed = line.qty * rule.allocationRate;
        }

        const allocated = needed * factor;
        
        if (allocated > 0) {
            line.additionalCost = (line.additionalCost || 0) + (allocated / line.qty);
            totalAllocated += allocated;
        }
    }

    return { lines: resultLines, totalAllocated };
}
