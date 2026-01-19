export enum OrderStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Processing = 'processing',
  Shipped = 'shipped',
  Completed = 'completed',
  Cancelled = 'cancelled'
}

export enum PaymentMethod {
  COD = 'cod',
  AccountDeduction = 'account_deduction',
  BankTransfer = 'bank_transfer'
}
