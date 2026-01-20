"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMoneyCore = exports.getCurrencyConfig = exports.CURRENCY_MAP = exports.DEFAULT_CURRENCY_CONFIG = void 0;
exports.DEFAULT_CURRENCY_CONFIG = { locale: 'vi-VN', currency: 'VND', decimals: 0 };
exports.CURRENCY_MAP = {
    'VND': { locale: 'vi-VN', currency: 'VND', decimals: 0 },
    'JPY': { locale: 'ja-JP', currency: 'JPY', decimals: 0 },
    'USD': { locale: 'en-US', currency: 'USD', decimals: 2 }
};
const getCurrencyConfig = (currencyCode) => {
    return exports.CURRENCY_MAP[currencyCode] || exports.DEFAULT_CURRENCY_CONFIG;
};
exports.getCurrencyConfig = getCurrencyConfig;
const formatMoneyCore = (amount, config) => {
    return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.currency,
        minimumFractionDigits: config.decimals
    }).format(amount);
};
exports.formatMoneyCore = formatMoneyCore;
