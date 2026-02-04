import { Customer, CustomerRepository } from "./customer.repository";

interface ListCustomersParams {
    search?: string;
    page?: number;
    limit?: number;
}

export class CustomerService {
    private repository = new CustomerRepository();

    private optionalFieldsValidator(
        cleanCpf?: string,
        cleanCep?: string,
        cleanPhone?: string,
    ) {
        // Validação de tamanho de campos (cnpj, cep, telefone e fax)
        if (cleanCpf?.length !== 11) {
            throw new Error("CPF inválido: deve conter 11 dígitos numéricos.");
        }

        if (cleanCep?.length !== 8) {
            throw new Error("CEP inválido: deve conter 8 dígitos numéricos.")
        }

        if (cleanPhone?.length !== 11) {
            throw new Error("Telefone inválido: deve conter 11 dígitos numéricos.")
        }
    }

    async listCustomers({
        search = "",
        page = 1,
        limit = 10,
    }: ListCustomersParams) {
        return this.repository.findAll({
            search,
            page,
            limit,
        });
    }

    async listCustomersWithFilters(options?: {
        id?: string,
        name?: string,
        cpf?: string}): Promise<Customer[]> {
        return this.repository.findWithFilters(options);
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

        this.optionalFieldsValidator(cleanCpf, cleanCep, cleanPhone);

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
        const customers = await this.repository.findWithFilters({ id: String(id) });
        if (customers.length === 0) {
            throw new Error("Cliente não encontrado");
        }

        // 3. Validação de conflito (Opcional, mas seguro): 

        const emailExists = await this.repository.findWithFilters({ email: data.email });

        if (emailExists.length > 0 && Number(emailExists[0].id) !== id) {
            throw new Error("Este e-mail já está sendo usado por outro cliente");
        }

        const cpfExists = await this.repository.findWithFilters({ cpf: cleanCpf });
        if (cpfExists.length > 0 && Number(cpfExists[0].id) !== id) {
            throw new Error("Este CPF já está sendo usado por outro cliente");
        }

        const phoneExists = await this.repository.findWithFilters({ phoneNumber: cleanPhone });
        if (phoneExists.length > 0 && Number(phoneExists[0].id) !== id) {
            throw new Error("Este telefone já está sendo usado por outro cliente");
        }

        return this.repository.update(id, {
            ...data,
            cpf: cleanCpf,
            cep: cleanCep,
            phoneNumber: cleanPhone
        });
    }

    async deleteCustomer(id: string) {
        const customer = await this.repository.findWithFilters({ id: String(id) });

        if (customer.length === 0) {
            throw new Error("Cliente não encontrado para exclusão");
        }
        await this.repository.delete(id);
    }
}
