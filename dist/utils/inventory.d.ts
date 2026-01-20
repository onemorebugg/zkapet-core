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
