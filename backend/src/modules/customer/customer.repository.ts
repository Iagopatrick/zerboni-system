import { pool } from "../../../database";

export interface Customer {
    id: string;
    name: string;
    cpf: string;
    cep: string;
    street: string;
    neighborhood: string;
    state: string;
    streetNumber: number;
    phoneNumber: string;
    email: string;
    created_at: Date;
}

interface FindAllCustomersParams {
    search?: string;
    page?: number;
    limit?: number;
}

export class CustomerRepository {

    async findAll({
        search = "",
        page = 1,
        limit = 10,
    }: FindAllCustomersParams) {
        const offset = (page - 1) * limit;

        // 1️⃣ Contagem total de registros
        const countQuery = search
            ? `
      SELECT COUNT(*) AS total
      FROM customers
      WHERE name ILIKE $1 OR email ILIKE $1 OR cpf ILIKE $1
    `
            : `
      SELECT COUNT(*) AS total
      FROM customers
    `;

        const countValues = search ? [`%${search}%`] : [];
        const countResult = await pool.query(countQuery, countValues);
        const total = parseInt(countResult.rows[0].total, 10);

        // 2️⃣ Calcula total de páginas
        const totalPages = Math.max(1, Math.ceil(total / limit));

        // 3️⃣ Garante página segura
        const safePage = Math.min(page, totalPages);
        const safeOffset = (safePage - 1) * limit;

        // 4️⃣ Query de dados
        let dataQuery: string;
        let dataValues: any[];

        if (search) {
            dataQuery = `
      SELECT id, name, cpf, cep, street, neighborhood, state,
             street_number AS "streetNumber",
             phone_number AS "phoneNumber",
             email, created_at
      FROM customers
      WHERE name ILIKE $1 OR email ILIKE $1 OR cpf ILIKE $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
            dataValues = [`%${search}%`, limit, safeOffset];
        } else {
            dataQuery = `
      SELECT id, name, cpf, cep, street, neighborhood, state,
             street_number AS "streetNumber",
             phone_number AS "phoneNumber",
             email, created_at
      FROM customers
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
            dataValues = [limit, safeOffset];
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
        name?: string,
        cpf?: string,
        cep?: string,
        street?: string,
        neighborhood?: string,
        state?: string,
        streetNumber?: number,
        phoneNumber?: string,
        email?: string
    }): Promise<Customer[]> {
        // 1. Base da query
        let query = `
        SELECT id, name, cpf, cep, street, neighborhood, state, 
               street_number AS "streetNumber", 
               phone_number AS "phoneNumber", 
               email, created_at 
        FROM customers 
        WHERE 1=1
    `;
        // Usamos "WHERE 1=1" para podermos apenas adicionar "AND ..." livremente

        const values: any[] = [];
        let counter = 1;

        // 2. Adiciona filtros dinamicamente
        // BUSCAS PARCIAIS (ILIKE) - Ideal para textos que o usuário pode não lembrar completo
        if (options?.name) {
            query += ` AND name ILIKE $${counter}`;
            values.push(`%${options.name}%`);
            counter++;
        }

        if (options?.street) {
            query += ` AND street ILIKE $${counter}`;
            values.push(`%${options.street}%`);
            counter++;
        }

        if (options?.neighborhood) {
            query += ` AND neighborhood ILIKE $${counter}`;
            values.push(`%${options.neighborhood}%`);
            counter++;
        }

        // BUSCAS EXATAS (=) - Ideal para identificadores e códigos fixos
        if (options?.cpf) {
            query += ` AND cpf = $${counter}`;
            values.push(options.cpf.replace(/\D/g, "")); // Limpa para garantir 11 dígitos
            counter++;
        }

        if (options?.cep) {
            query += ` AND cep = $${counter}`;
            values.push(options.cep.replace(/\D/g, "")); // Limpa para garantir 8 dígitos
            counter++;
        }

        if (options?.state) {
            query += ` AND state = $${counter}`;
            values.push(options.state.toUpperCase()); // Garante que busca "SP" mesmo se vier "sp"
            counter++;
        }

        if (options?.streetNumber) {
            query += ` AND street_number = $${counter}`;
            values.push(options.streetNumber);
            counter++;
        }

        if (options?.phoneNumber) {
            query += ` AND phone_number = $${counter}`;
            values.push(options.phoneNumber.replace(/\D/g, ""));
            counter++;
        }

        if (options?.email) {
            query += ` AND email = $${counter}`;
            values.push(options.email);
            counter++;
        }

        if (options?.id) {
            query += ` AND id = $${counter}`;
            values.push(options.id);
            counter++;
        }



        // 3. Executa a query
        const { rows } = await pool.query(query, values);
        return rows;
    }

    async create(data: Omit<Customer, 'id' | 'created_at'>): Promise<Customer> {
        const { rows } = await pool.query(
            `
        INSERT INTO customers (
            name, cpf, cep, street, neighborhood, state, street_number, phone_number, email
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, name, cpf, cep, street, neighborhood, state, 
                    street_number AS "streetNumber", 
                    phone_number AS "phoneNumber", 
                    email, created_at
        `,
            [data.name,
            data.cpf,
            data.cep,
            data.street,
            data.neighborhood,
            data.state,
            data.streetNumber,
            data.phoneNumber,
            data.email]
        );

        return rows[0];
    }

    async update(id: number, data: Partial<Customer>): Promise<Customer | null> {
        const { rows } = await pool.query(
            `
        UPDATE customers 
        SET name = $1, cpf = $2, cep = $3, street = $4, neighborhood = $5, 
            state = $6, street_number = $7, phone_number = $8, email = $9
        WHERE id = $10
        RETURNING id, name, cpf, cep, street, neighborhood, state, 
                  street_number AS "streetNumber", 
                  phone_number AS "phoneNumber", 
                  email, created_at
        `,
            [
                data.name,
                data.cpf,
                data.cep,
                data.street,
                data.neighborhood,
                data.state,
                data.streetNumber,
                data.phoneNumber,
                data.email,
                id
            ]
        );

        return rows[0] ?? null;
    }

    async delete(id: string): Promise<void> {
        await pool.query("DELETE FROM customers WHERE id = $1", [id]);
    }
}