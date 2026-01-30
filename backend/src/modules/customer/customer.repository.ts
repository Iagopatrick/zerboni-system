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

export class CustomerRepository {
    // async findWithFilters(options?: { cpf?: string, name?: string }) {
    //     let query = `SELECT * FROM customers c WHERE deleted_at IS NULL`
    //     if (!!options) {

    //         if (options?.cpf) {
    //             query += `and c.cpf = ${options.cpf}`
    //         }
    //         if (options?.name) {
    //             query += `and c.name = ${options.name}`
    //         }
    //     }

    // }

    async findWithFilters(options?: {
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
            query += ` AND email ILIKE $${counter}`; // ILIKE aqui evita problemas com Maiúsculas/Minúsculas
            values.push(options.email);
            counter++;
        }



        // 3. Executa a query
        const { rows } = await pool.query(query, values);
        return rows;
    }

    async findAll(): Promise<Customer[]> {
        const { rows } = await pool.query(
            `SELECT id, name, cpf, cep, street, neighborhood, state, street_number AS "streetNumber", phone_number AS "phoneNumber", email, created_at FROM customers`
        );
        return rows;
    }

    async findById(id: string): Promise<Customer | null> {
        const { rows } = await pool.query(
            `SELECT id, name, cpf, cep, street, neighborhood, state, street_number AS "streetNumber", phone_number AS "phoneNumber", email, created_at FROM customers WHERE id = $1`,
            [id]
        );
        return rows[0] ?? null;
    }

    async findByEmail(email: string): Promise<Customer | null> {
        const { rows } = await pool.query(
            "SELECT id FROM customers WHERE email = $1",
            [email]
        );
        return rows[0] ?? null;
    }

    async findByCPF(cpf: string): Promise<Customer | null> {
        const { rows } = await pool.query(
            "SELECT id FROM customers WHERE cpf = $1",
            [cpf]
        );
        return rows[0] ?? null;
    }

    async findByPhoneNumber(phoneNumber: string): Promise<Customer | null> {
        const { rows } = await pool.query(
            "SELECT id FROM customers WHERE phone_number = $1",
            [phoneNumber]
        );
        return rows[0] ?? null;
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

    async delete(id: string): Promise<void> {
        await pool.query("DELETE FROM customers WHERE id = $1", [id]);
    }
}