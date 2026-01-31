import { pool } from "../../../database";

export type PaymentMethod = 'Dinheiro' | 'Cheque' | 'Cartao_credito' | 'Cartao_debito' | 'Pix';

export interface Supplier {
    id: string;
    legalName: string;
    active: boolean;
    cep: string;
    street: string;
    streetNumber: number;
    neighborhood: string;
    city: string;
    state: string;
    phoneNumber: string;
    fax?: string;
    cnpj: string;
    producerTaxId?: string;
    municipalTaxId?: string;
    stateTaxId?: string;
    website?: string;
    email: string;
    invoceEmail?: string;
    cashAccount: string;
    taxRegime: 'Simples Nacional' | 'Lucro Presumido' | 'Lucro Real';
    paymentMethods: PaymentMethod[];
    notes?: string;
    created_at: Date;
}

export class SupplierRepository {

    async findWithFilters(options?: {
        id?: string,
        legalName?: string,
        city?: string,
        cnpj?: string
    }): Promise<Supplier[]> {

        let query = `
        SELECT id, legal_name AS "legalName", active, cep, street, street_number AS "streetNumber",
               neighborhood, city, state, phone_number AS "phoneNumber", fax, cnpj, producer_tax_id AS "producerTaxId", 
               municipal_tax_id AS "municipalTaxId", state_tax_id AS "stateTaxId", website, email, invoce_email AS "invoceEmail", 
               cash_account AS "cashAccount", tax_regime AS "taxRegime", payment_methods AS "paymentMethods",
               notes, created_at
        FROM suppliers
        WHERE 1=1 
        `;

        const values: any[] = [];
        let counter = 1;

        if (options?.id) {
            query += ` AND id = $${counter}`;
            values.push(options.id);
            counter++;
        }
        if (options?.legalName) {
            query += ` AND legal_name ILIKE $${counter}`;
            values.push(`%${options.legalName}%`);
            counter++;
        }
        if (options?.city) {
            query += ` AND city ILIKE $${counter}`;
            values.push(`%${options.city}%`);
            counter++;
        }
        if (options?.cnpj) {
            query += ` AND cnpj = $${counter}`;
            values.push(options.cnpj.replace(/\D/g, ""));
            counter++;
        }

        const { rows } = await pool.query(query, values);
        return rows;
    }

    async create(data: Omit<Supplier, 'id' | 'created_at'>): Promise<Supplier> {
        const { rows } = await pool.query(
            `
        INSERT INTO suppliers (
            legal_name, active, cep, street, street_number, neighborhood, city, 
            state, phone_number, fax, cnpj, producer_tax_id, municipal_tax_id, 
            state_tax_id, website, email, invoce_email, cash_account, tax_regime,
            payment_methods, notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10 $11, $12, $13, $14, $15, 
        $16, $17, $18, $19, $20, $21
        )
        RETURNING id, legal_name AS "legalName", active, cep, street, 
            street_number AS "streetNumber", neighborhood, city, state, 
            phone_number AS "phoneNumber", fax, cnpj, 
            producer_tax_id AS "producerTaxId", municipal_tax_id AS "municipalTaxId", 
            state_tax_id AS "stateTaxId", website, email, invoce_email AS "invoceEmail", 
            cash_account AS "cashAccount", tax_regime AS "taxRegime", 
            payment_methods AS "paymentMethods", notes, created_at
        `,
            [
                data.legalName,
                data.active,
                data.cep,
                data.street,
                data.streetNumber,
                data.neighborhood,
                data.city,
                data.state,
                data.phoneNumber,
                data.fax,
                data.cnpj,
                data.producerTaxId,
                data.municipalTaxId,
                data.stateTaxId,
                data.website,
                data.email,
                data.invoceEmail,
                data.cashAccount,
                data.taxRegime,
                data.paymentMethods,
                data.notes
            ]
        );
        return rows[0];
    }

    async update(id: number, data: Partial<Supplier>): Promise<Supplier | null> {
        const { rows } = await pool.query(
            `
            UPDATE suppliers 
            SET
                legal_name = $1, 
                active = $2, 
                cep = $3, 
                street = $4, 
                street_number = $5, 
                neighborhood = $6, 
                city = $7, 
                state = $8, 
                phone_number = $9, 
                fax = $10, 
                cnpj = $11, 
                producer_tax_id = $12, 
                municipal_tax_id = $13, 
                state_tax_id = $14, 
                website = $15, 
                email = $16, 
                invoce_email = $17, 
                cash_account = $18, 
                tax_regime = $19, 
                payment_methods = $20, 
                notes = $21 
            WHERE id = $22
            RETURNING 
                id, legal_name AS "legalName", active, cep, street, street_number AS "streetNumber", 
                neighborhood, city, state, phone_number AS "phoneNumber", fax, cnpj, 
                producer_tax_id AS "producerTaxId", municipal_tax_id AS "municipalTaxId", 
                state_tax_id AS "stateTaxId", website, email, invoce_email AS "invoceEmail", 
                cash_account AS "cashAccount", tax_regime AS "taxRegime", payment_methods AS "paymentMethods", 
                notes, created_at
            `,
            [
                data.legalName,
                data.active,
                data.cep,
                data.street,
                data.streetNumber,
                data.neighborhood,
                data.city,
                data.state,
                data.phoneNumber,
                data.fax,
                data.cnpj,
                data.producerTaxId,
                data.municipalTaxId,
                data.stateTaxId,
                data.website,
                data.email,
                data.invoceEmail,
                data.cashAccount,
                data.taxRegime,
                data.paymentMethods,
                data.notes,
                id
            ]
        );

        return rows[0] ?? null;
    }

    async delete(id: string): Promise<void> {
        await pool.query("DELETE FROM suppliers WHERE id = $1", [id]);
    }
}

