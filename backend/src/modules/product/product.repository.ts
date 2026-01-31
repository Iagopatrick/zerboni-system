import { pool } from "../../../database";

export interface Product {
    id: string;
    registrationId: string;
    branch: string;
    productGroup: string;
    brand: string;
    description: string;
    reference: string;
    price: string;
    stock: number;
    productType: string;
    unitOfMeasure: number;
    images: string[];
    tradeName: string;
    active: boolean;
    size: string;
    supplierCnpj: string;
    created_at: Date;
}

export interface ProductWithSupplier extends Product {
    supplierName?: string;
}

export class ProductRepository {
    async findWithFilters(options?: {
        id?: string,
        registrationId?: string,
        productGroup?: string,
        reference?: string,
        brand?: string,
        supplierCnpj?: string
    }): Promise<ProductWithSupplier[]> {
        let query = `
            SELECT 
                p.id, p.registration_id AS "registrationId", p.branch, p.product_group AS "productGroup", 
                p.brand, p.description, p.reference, p.price, p.stock, p.product_type AS "productType", 
                p.unit_of_measure AS "unitOfMeasure", p.images, p.trade_name AS "tradeName", p.active, 
                p.size, p.supplier_cnpj AS "supplierCnpj", p.created_at, s.legal_name AS "supplierName" 
            FROM products p
            LEFT JOIN suppliers s ON p.supplier_cnpj = s.cnpj
            WHERE 1=1
        `

        const values: any[] = [];
        let counter = 1;

        if (options?.supplierCnpj) {
            query += ` AND p.supplier_cnpj = $${counter}`;
            values.push(options.supplierCnpj.replace(/\D/g, ""));
            counter++;
        }

        if (options?.id) {
            query += ` AND p.id = $${counter}`;
            values.push(options.id);
            counter++;
        }

        if (options?.registrationId) {
            query += ` AND p.registration_id = $${counter}`;
            values.push(options.registrationId);
            counter++;
        }

        if (options?.productGroup) {
            query += ` AND p.product_group ILIKE $${counter}`;
            values.push(`%${options.productGroup}%`);
            counter++;
        }

        if (options?.reference) {
            query += ` AND p.reference = $${counter}`;
            values.push(options.reference);
            counter++;
        }

        if (options?.brand) {
            query += ` AND p.brand ILIKE $${counter}`;
            values.push(`%${options.brand}%`);
            counter++;
        }

        const { rows } = await pool.query(query, values);
        return rows as ProductWithSupplier[];
    }

    async create(data: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
        const { rows } = await pool.query(
            `
            INSERT INTO products (
                registration_id, branch, product_group, brand, description, 
                reference, price, stock, product_type, unit_of_measure, 
                images, trade_name, active, size, supplier_cnpj
            ) 
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
            )
            RETURNING 
                id, registration_id AS "registrationId", branch, product_group AS "productGroup", 
                brand, description, reference, price, stock, product_type AS "productType", 
                unit_of_measure AS "unitOfMeasure", images, trade_name AS "tradeName", 
                active, size, supplier_cnpj AS "supplierCnpj", created_at
            `,
            [
                data.registrationId,
                data.branch,
                data.productGroup,
                data.brand,
                data.description,
                data.reference,
                data.price,
                data.stock,
                data.productType,
                data.unitOfMeasure,
                data.images,
                data.tradeName,
                data.active,
                data.size,
                data.supplierCnpj
            ]
        );
        return rows[0];
    }

    async update(id: string, data: Partial<Omit<Product, 'id' | 'created_at'>>): Promise<Product> {
        const { rows } = await pool.query(
            `
            UPDATE products SET
                registration_id = $1,branch = $2,product_group = $3,brand = $4,description = $5,
                reference = $6, price = $7,stock = $8,product_type = $9,unit_of_measure = $10,
                images = $11,trade_name = $12,active = $13,size = $14,supplier_cnpj = $15
            WHERE id = $16
            RETURNING 
                id, registration_id AS "registrationId", branch, product_group AS "productGroup", 
                brand, description, reference, price, stock, product_type AS "productType", 
                unit_of_measure AS "unitOfMeasure", images, trade_name AS "tradeName", 
                active, size, supplier_cnpj AS "supplierCnpj", created_at`,
            [
                data.registrationId,
                data.branch,
                data.productGroup,
                data.brand,
                data.description,
                data.reference,
                data.price,
                data.stock,
                data.productType,
                data.unitOfMeasure,
                data.images,
                data.tradeName,
                data.active,
                data.size,
                data.supplierCnpj,
                id
            ]
        );

        return rows[0];
    }

    async delete(id: string): Promise<void> {
        await pool.query('DELETE FROM products WHERE id = $1', [id]);
    }
}
