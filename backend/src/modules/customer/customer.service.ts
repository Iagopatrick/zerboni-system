import { CustomerRepository } from "./customer.repository";

export class CustomerService {
    private repository = new CustomerRepository();

    async listCustomers() {
        return this.repository.findAll();
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
        return this.repository.create(data);
    }

    async deleteCustomer(id: string) {
        await this.repository.delete(id);
    }
}