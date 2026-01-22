export interface ShippingConfig {
    method: string;
    parcelLimit: number;
    roundThreshold?: number;
    flatRateAmount: number;
}
export interface ShippingPriceConfig {
    regionId: string;
    shippingGroupId: string | null;
    price: number;
    surcharge: number;
}
export interface ShippingItem {
    massKg: number;
    quantity: number;
    shippingGroupId?: string | null;
}
export interface ShippingDetail {
    groupId: string;
    groupName: string;
    mass: number;
    unitPrice: number;
    minFee: number;
    count: number;
    fee: number;
    fullParcels?: number;
    partialParcels?: number;
    remainder?: number;
    isMinFeeApplied?: boolean;
}
export interface ShippingResult {
    shippingFee: number;
    packageCount: number;
    method: string;
    detail: ShippingDetail[];
    error?: string;
}
export declare const calculateShippingFeeCore: (config: ShippingConfig, priceConfigs: ShippingPriceConfig[], items: ShippingItem[], regionId: string) => ShippingResult;
