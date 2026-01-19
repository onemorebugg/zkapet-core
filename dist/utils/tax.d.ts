export interface TaxItem {
    taxRate: number;
    amount: number;
}
export interface TaxBreakdownResult {
    goodsTax: number;
    shippingTax: number;
    otherTax: number;
    totalTax: number;
    breakdown: {
        rate: number;
        amount: number;
    }[];
}
export declare const calculateTaxBreakdown: (items: TaxItem[], shippingFee: number, shippingTaxRate: number, otherFee: number, otherFeeTaxRate: number) => TaxBreakdownResult;
