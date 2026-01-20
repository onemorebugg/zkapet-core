export interface CurrencyConfig {
    locale: string;
    currency: string;
    decimals: number;
}
export declare const DEFAULT_CURRENCY_CONFIG: CurrencyConfig;
export declare const CURRENCY_MAP: Record<string, CurrencyConfig>;
export declare const getCurrencyConfig: (currencyCode: string) => CurrencyConfig;
export declare const formatMoneyCore: (amount: number, config: CurrencyConfig) => string;
