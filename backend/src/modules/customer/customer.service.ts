import { CustomerRepository } from "./customer.repository";

export class CustomerService {
    private repository = new CustomerRepository();

    async listCustomers(filters?: {
        name?: string,
        cpf?: string,
        cep?: string,
        street?: string,
        neighborhood?: string,
        state?: string,
        streetNumber?: number,
        phoneNumber?: string,
        email?: string
    }) {
        return this.repository.findWithFilters(filters);
    }

    async createCustomer(data: {
        name: string;
        cpf: string;
        cep: string;
        street: string;
        neighborhood: string;
        state: string;
        streetNumber: number;
        phoneNumber: string;
        email: string
    }
    ) {
        // limpeza dos campos
        const cleanCpf = data.cpf.replace(/\D/g, "");
        const cleanCep = data.cep.replace(/\D/g, "");
        const cleanPhone = data.phoneNumber.replace(/\D/g, "");

        // 1. Verifica o Email individualmente
        const emailExists = await this.repository.findWithFilters({ email: data.email });
        if (emailExists.length > 0) throw new Error("Este e-mail já está em uso.");

        // 2. Verifica o CPF individualmente
        const cpfExists = await this.repository.findWithFilters({ cpf: data.cpf });
        if (cpfExists.length > 0) throw new Error("Este CPF já está cadastrado.");

        // 3. Verifica o Telefone individualmente
        const phoneExists = await this.repository.findWithFilters({ phoneNumber: data.phoneNumber });
        if (phoneExists.length > 0) throw new Error("Este telefone já está cadastrado.");

        // Se nenhum 'throw' foi disparado, pode salvar
        return this.repository.create({
            ...data,
            cpf: cleanCpf,
            cep: cleanCep,
            phoneNumber: cleanPhone
        });
    }

    async updateCustomer(id: number, data: any) {

        const cleanCpf = data.cpf.replace(/\D/g, "");
        const cleanCep = data.cep.replace(/\D/g, "");
        const cleanPhone = data.phoneNumber.replace(/\D/g, "");

        // 2. Verifica se o cliente existe
        const customer = await this.repository.findById(id);
        if (!customer) throw new Error("Cliente não encontrado");

        // 3. Validação de conflito (Opcional, mas seguro): 
        // Verificar se o novo e-mail já existe em OUTRO ID
        const emailExists = await this.repository.findByEmail(data.email);
        if (emailExists && emailExists.id !== id) {
            throw new Error("Este e-mail já está sendo usado por outro cliente");
        }

        return this.repository.update(id, {
            ...data,
            cpf: cleanCpf,
            cep: cleanCep,
            phoneNumber: cleanPhone
        });
    }

    async deleteCustomer(id: string) {
        await this.repository.delete(id);
    }
}
