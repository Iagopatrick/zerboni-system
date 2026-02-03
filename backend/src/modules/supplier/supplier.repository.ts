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

interface FindAllParams {
    search?: string;
    page?: number;
    limit?: number;
}

export class SupplierRepository {

    async findAll({ search = "", page = 1, limit = 10 }: FindAllParams) {
        let offset: number;

        const countQuery = search
            ? `
            SELECT COUNT(*) AS total
            FROM suppliers
            WHERE legal_name ILIKE $1 OR email ILIKE $1
            `
            : `
            SELECT COUNT(*) AS total
            FROM suppliers
            `;

        const countValues = search ? [`%${search}%`] : [];
        const countResult = await pool.query(countQuery, countValues);
        const total = parseInt(countResult.rows[0].total, 10);

        const totalPages = Math.max(1, Math.ceil(total / limit));
        const safePage = Math.min(page, totalPages);

        offset = (safePage - 1) * limit;

        let dataQuery: string;
        let dataValues: any[];

        dataQuery = `
            SELECT
                id,
                legal_name        AS "legalName",
                active,
                cep,
                street,
                street_number     AS "streetNumber",
                neighborhood,
                city,
                state,
                phone_number      AS "phoneNumber",
                fax,
                cnpj,
                producer_tax_id   AS "producerTaxId",
                municipal_tax_id  AS "municipalTaxId",
                state_tax_id      AS "stateTaxId",
                website,
                email,
                invoce_email      AS "invoceEmail",
                cash_account      AS "cashAccount",
                tax_regime        AS "taxRegime",
                payment_methods   AS "paymentMethods",
                notes,
                created_at `;

        if (search) {
            dataQuery += `
            
            FROM suppliers
            WHERE CAST(id AS TEXT) ILIKE $1 OR legal_name ILIKE $1 OR city ILIKE $1 OR cnpj ILIKE $1 OR email ILIKE $1
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3
            `;
            dataValues = [`%${search}%`, limit, offset];
        } else {
            dataQuery += `
            
            FROM suppliers
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2
            `;
            dataValues = [limit, offset];
        }

        const dataResult = await pool.query(dataQuery, dataValues);

        return {
            rows: dataResult.rows,
            total,
            page: safePage,
            limit,
            totalPages,
        };
    }

    async findWithFilters(options?: {
        id?: string,
        legalName?: string,
        city?: string,
        cnpj?: string,
        email?: string
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
        if (options?.email) {
            query += ` AND email ILIKE $${counter}`;
            values.push(`%${options.email}%`);
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
        VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
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

    async update(
        id: number,
        data: Partial<Supplier>
    ): Promise<Supplier | null> {

        const fields: string[] = [];
        const values: any[] = [];
        let counter = 1;

        if (data.legalName !== undefined) {
            fields.push(`legal_name = $${counter++}`);
            values.push(data.legalName);
        }

        if (data.active !== undefined) {
            fields.push(`active = $${counter++}`);
            values.push(data.active);
        }

        if (data.cep !== undefined) {
            fields.push(`cep = $${counter++}`);
            values.push(data.cep);
        }

        if (data.street !== undefined) {
            fields.push(`street = $${counter++}`);
            values.push(data.street);
        }

        if (data.streetNumber !== undefined) {
            fields.push(`street_number = $${counter++}`);
            values.push(data.streetNumber);
        }

        if (data.neighborhood !== undefined) {
            fields.push(`neighborhood = $${counter++}`);
            values.push(data.neighborhood);
        }

        if (data.city !== undefined) {
            fields.push(`city = $${counter++}`);
            values.push(data.city);
        }

        if (data.state !== undefined) {
            fields.push(`state = $${counter++}`);
            values.push(data.state);
        }

        if (data.phoneNumber !== undefined) {
            fields.push(`phone_number = $${counter++}`);
            values.push(data.phoneNumber);
        }

        if (data.fax !== undefined) {
            fields.push(`fax = $${counter++}`);
            values.push(data.fax);
        }

        if (data.cnpj !== undefined) {
            fields.push(`cnpj = $${counter++}`);
            values.push(data.cnpj);
        }

        if (data.producerTaxId !== undefined) {
            fields.push(`producer_tax_id = $${counter++}`);
            values.push(data.producerTaxId);
        }

        if (data.municipalTaxId !== undefined) {
            fields.push(`municipal_tax_id = $${counter++}`);
            values.push(data.municipalTaxId);
        }

        if (data.stateTaxId !== undefined) {
            fields.push(`state_tax_id = $${counter++}`);
            values.push(data.stateTaxId);
        }

        if (data.website !== undefined) {
            fields.push(`website = $${counter++}`);
            values.push(data.website);
        }

        if (data.email !== undefined) {
            fields.push(`email = $${counter++}`);
            values.push(data.email);
        }

        if (data.invoceEmail !== undefined) {
            fields.push(`invoce_email = $${counter++}`);
            values.push(data.invoceEmail);
        }

        if (data.cashAccount !== undefined) {
            fields.push(`cash_account = $${counter++}`);
            values.push(data.cashAccount);
        }

        if (data.taxRegime !== undefined) {
            fields.push(`tax_regime = $${counter++}`);
            values.push(data.taxRegime);
        }

        if (data.paymentMethods !== undefined) {
            fields.push(`payment_methods = $${counter++}`);
            values.push(data.paymentMethods);
        }

        if (data.notes !== undefined) {
            fields.push(`notes = $${counter++}`);
            values.push(data.notes);
        }

        if (fields.length === 0) {
            return null;
        }

        const query = `
        UPDATE suppliers
        SET ${fields.join(', ')}
        WHERE id = $${counter}
        RETURNING
            id,
            legal_name AS "legalName",
            active,
            cep,
            street,
            street_number AS "streetNumber",
            neighborhood,
            city,
            state,
            phone_number AS "phoneNumber",
            fax,
            cnpj,
            producer_tax_id AS "producerTaxId",
            municipal_tax_id AS "municipalTaxId",
            state_tax_id AS "stateTaxId",
            website,
            email,
            invoce_email AS "invoceEmail",
            cash_account AS "cashAccount",
            tax_regime AS "taxRegime",
            payment_methods AS "paymentMethods",
            notes,
            created_at
        `;

        values.push(id);

        const { rows } = await pool.query(query, values);
        return rows[0] ?? null;
    }

    async delete(id: string): Promise<void> {
        await pool.query("DELETE FROM suppliers WHERE id = $1", [id]);
    }
}

