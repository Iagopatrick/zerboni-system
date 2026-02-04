import { SupplierRepository, PaymentMethod } from "./supplier.repository";

export interface ListSuppliersParams {
    search?: string;
    page?: number;
    limit?: number;
}
export class SupplierService {
    private repository = new SupplierRepository();

    private optionalFieldsValidator(
        cleanCnpj?: string,
        cleanCep?: string,
        cleanPhone?: string,
        cleanFax?: string | null
    ) {
        // Validação de tamanho de campos (cnpj, cep, telefone e fax)
        if (cleanCnpj?.length !== 14) {
            throw new Error("CNPJ inválido: deve conter 14 dígitos numéricos.");
        }

        if (cleanCep?.length !== 8) {
            throw new Error("CEP inválido: deve conter 8 dígitos numéricos.")
        }

        if (cleanPhone?.length !== 11) {
            throw new Error("Telefone inválido: deve conter 11 dígitos numéricos.")
        }

        if (cleanFax && cleanFax?.length !== 11) {
            throw new Error("Fax inválido: deve conter 11 dígitos numéricos ou estar como um campo vazio.")
        }
    }

    async listSuppliers({
        search = "",
        page = 1,
        limit = 10,
    }: ListSuppliersParams) {
        return this.repository.findAll({ search, page, limit });
    }

    async createSupplier(data: {
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
    }
    ) {
        const cleanCnpj = data.cnpj.replace(/\D/g, "");
        const cleanCep = data.cep.replace(/\D/g, "");
        const cleanPhone = data.phoneNumber.replace(/\D/g, "");
        const cleanFax = data.fax ? data.fax.replace(/\D/g, "") : null;

        // Validação da Regra de Negócio (Mínimo uma inscrição, verificação três campos vazio)
        if (!data.producerTaxId && !data.municipalTaxId && !data.stateTaxId) {
            throw new Error("Pelo menos uma inscrição (Produtor, Municipal ou Estadual) deve ser informada.");
        }

        this.optionalFieldsValidator(cleanCnpj, cleanCep, cleanPhone, cleanFax);

        const cnpjExists = await this.repository.findWithFilters({ cnpj: cleanCnpj });
        if (cnpjExists.length > 0) {
            throw new Error("Já existe um fornecedor cadastrado com este CNPJ.");
        }

        const emailExists = await this.repository.findWithFilters({ email: data.email });
        if (emailExists.length > 0) {
            throw new Error("Este e-mail já está sendo utilizado por outro fornecedor.");
        }

        return this.repository.create({
            ...data,
            cnpj: cleanCnpj,
            cep: cleanCep,
            phoneNumber: cleanPhone,
            fax: cleanFax || undefined,
            producerTaxId: data.producerTaxId || undefined,
            municipalTaxId: data.municipalTaxId || undefined,
            stateTaxId: data.stateTaxId || undefined
        });
    }

    async updateSupplier(id: number, data: any) {

        const cleanCnpj = data.cnpj.replace(/\D/g, "");
        const cleanCep = data.cep.replace(/\D/g, "");
        const cleanPhone = data.phoneNumber.replace(/\D/g, "");
        const cleanFax = data.fax ? data.fax.replace(/\D/g, "") : null;

        if (!data.producerTaxId && !data.municipalTaxId && !data.stateTaxId) {
            throw new Error("Pelo menos uma inscrição (Produtor, Municipal ou Estadual) deve ser informada.");
        }

        this.optionalFieldsValidator(cleanCnpj, cleanCep, cleanPhone, cleanFax);

        const suppliers = await this.repository.findWithFilters({ id: String(id) });
        if (suppliers.length === 0) {
            throw new Error("Fornecedor não encontrado");
        }

        const emailExists = await this.repository.findWithFilters({ email: data.email });

        if (emailExists.length > 0 && Number(emailExists[0].id) !== id) {
            throw new Error("Este e-mail já está sendo usado por outro fornecedor");
        }

        const cnpjExists = await this.repository.findWithFilters({ cnpj: cleanCnpj });
        if (cnpjExists.length > 0 && Number(cnpjExists[0].id) !== id) {
            throw new Error("Este CNPJ já está sendo usado por outro fornecedor");
        }

        return this.repository.update(id, {
            ...data,
            cnpj: cleanCnpj,
            cep: cleanCep,
            phoneNumber: cleanPhone,
            fax: cleanFax
        });
    }

    async deleteSupplier(id: string) {
        const supplier = await this.repository.findWithFilters({ id: String(id) });

        if (supplier.length === 0) {
            throw new Error("Fornecedor não encontrado para exclusão");
        }
        await this.repository.delete(id);
    }
}