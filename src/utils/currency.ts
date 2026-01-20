export interface CurrencyConfig {
    locale: string;
    currency: string;
    decimals: number;
}

export const DEFAULT_CURRENCY_CONFIG: CurrencyConfig = { locale: 'vi-VN', currency: 'VND', decimals: 0 };

export const CURRENCY_MAP: Record<string, CurrencyConfig> = {
    'VND': { locale: 'vi-VN', currency: 'VND', decimals: 0 },
    'JPY': { locale: 'ja-JP', currency: 'JPY', decimals: 0 },
    'USD': { locale: 'en-US', currency: 'USD', decimals: 2 }
};

export const getCurrencyConfig = (currencyCode: string): CurrencyConfig => {
    return CURRENCY_MAP[currencyCode] || DEFAULT_CURRENCY_CONFIG;
};

export const formatMoneyCore = (amount: number, config: CurrencyConfig) => {
    return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.currency,
        minimumFractionDigits: config.decimals
    }).format(amount);
};
