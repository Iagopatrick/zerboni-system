import { ProductRepository } from './product.repository';
import { SupplierRepository } from '../supplier/supplier.repository';

export class ProductService {
    private repository = new ProductRepository();
    private supplierRepository = new SupplierRepository();

    async listProducts(filters?: {
        id?: string,
        registrationId?: string,
        productGroup?: string,
        reference?: string,
        brand?: string,
        supplierCnpj?: string
    }) {
        return this.repository.findWithFilters(filters);
    }

    async createProduct(data: {
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
    }
    ) {
        const cleanCnpj = data.supplierCnpj.replace(/\D/g, "");
        const supplier = await this.supplierRepository.findWithFilters({ cnpj: cleanCnpj });

        if (supplier.length === 0) {
            throw new Error("O fornecedor informado não existe. Cadastre o fornecedor primeiro.");
        }

        const productExists = await this.repository.findWithFilters({ registrationId: data.registrationId });
        if (productExists.length > 0) throw new Error("Este produto já está registrado.");

        return this.repository.create({
            ...data,
            supplierCnpj: cleanCnpj,
        });
    }

    async updateProduct(id: number, data: any) {

        const cleanCnpj = data.supplierCnpj.replace(/\D/g, "");

        const supplier = await this.supplierRepository.findWithFilters({ cnpj: cleanCnpj });
        if (supplier.length === 0) {
            throw new Error("Fornecedor informado não existe.");
        }

        const products = await this.repository.findWithFilters({ id: String(id) });
        if (products.length === 0) {
            throw new Error("Produto não encontrado");
        }

        // 3. Validação de conflito (Opcional, mas seguro): 

        const productExists = await this.repository.findWithFilters({ registrationId: data.registrationId });

        if (productExists.length > 0 && Number(productExists[0].id) !== id) {
            throw new Error("Este registro já está sendo usado por outro produto");
        }

        return this.repository.update(String(id), {
            ...data,
            supplierCnpj: cleanCnpj,
        });
    }

    async deleteProduct(id: string) {
        const products = await this.repository.findWithFilters({ id });

        if (products.length === 0) {
            throw new Error("Produto não encontrado para exclusão.");
        }

        await this.repository.delete(id);
    }
}
