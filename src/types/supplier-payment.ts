export type PaymentType =
  | "Dinheiro"
  | "Cheque"
  | "Cartao_credito"
  | "Cartao_debito"
  | "Pix";

export type MovementType =
  "Entrada" |
  "Saida"
  ;

export interface SupplierPaymentType {
  id: number;
  supplierId: string;
  paymentDate: string;
  amount: string;
  paymentType: PaymentType;
  movementType: MovementType;
  description: string;
  createdAt: string;
}