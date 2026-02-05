export interface SaleType {
  id?: number;
  fiscal_record_id?: number;
  customer_id: number;
  user_id: number;
  payment_type: number; // 1: Dinheiro, 5: Pix, etc.
  sale_type: number;    // 1: Normal, 2: Interesse, 3: Condicional
  status_type: number;  // 0: Aberto, 1: Fechado
  total_value: number;
  created_at?: string;
  
  // Campos auxiliares para a listagem (JOIN com cliente)
  customerCpf?: string;
  customerName?: string;
}