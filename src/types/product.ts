export type ProductType = {
    id: number;
    registrationId: string;
    branch: string;
    productGroup: string;
    brand: string;
    description?: string | null;
    reference: string;
    price: string;
    stock: number;
    productType?: string | null;
    unitOfMeasure?: number | null;
    images: string[];
    tradeName?: string | null;
    active: boolean;
    size?: string | null;
    supplierCnpj: string;
    created_at: string;
};