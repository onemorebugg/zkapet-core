export * from './tax';
export * from './shipping';

export const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' đ';
};
