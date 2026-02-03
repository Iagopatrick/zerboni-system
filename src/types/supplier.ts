export type TaxRegime =
    | "Simples Nacional"
    | "Lucro Presumido"
    | "Lucro Real";

export type PaymentMethod =
    | "Dinheiro"
    | "Cheque"
    | "Cartao_credito"
    | "Cartao_debito"
    | "Pix";

export interface SupplierType {
    id: number;
    legalName: string;
    active: boolean;
    cep: string;
    street: string;
    streetNumber: number;
    neighborhood: string;
    city: string;
    state: string;
    phoneNumber: string;
    fax?: string | null;
    cnpj: string;
    producerTaxId?: string | null;
    municipalTaxId?: string | null;
    stateTaxId?: string | null;
    website?: string | null;
    email: string;
    invoceEmail?: string | null;
    cashAccount: string;
    taxRegime: TaxRegime;
    paymentMethods: PaymentMethod[];
    notes?: string | null;
    created_at: string;
}
