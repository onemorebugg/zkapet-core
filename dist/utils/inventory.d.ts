export interface StockLineInput {
    productId: string;
    qty: number;
    price?: number;
    mass?: number;
    lotNumber?: string | null;
    expiryDate?: string | null;
    additionalCost?: number;
    taxRate?: number;
    taxAmount?: number;
}
export interface LandedCostItem {
    name: string;
    amount: number;
    allocationMethod: 'weight' | 'value' | 'quantity' | 'equal';
}
/**
 * Hàm phân bổ chi phí thu mua chuyên nghiệp
 */
export declare function calculateLandedCostAllocation(lines: StockLineInput[], landedCosts: LandedCostItem[]): StockLineInput[];
export interface FairShareRule {
    unitCost: number;
    remainingAmount: number;
}
/**
 * Phân bổ chi phí theo nguyên tắc Fair Share (Chia đều ngân sách thiếu hụt)
 */
export declare function calculateFairShareAllocation(lines: StockLineInput[], rule: FairShareRule): {
    lines: StockLineInput[];
    totalAllocated: number;
};
