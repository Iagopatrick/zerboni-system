import { ProductRepository } from './product.repository';
import { SupplierRepository } from '../supplier/supplier.repository';

interface ListProductsParams {
    search?: string;
    page?: number;
    limit?: number;
}

export class ProductService {
    private repository = new ProductRepository();
    private supplierRepository = new SupplierRepository();

    async listProducts({
        search = "",
        page = 1,
        limit = 10,
    }: ListProductsParams) {
        return this.repository.findAllProducts({
            search,
            page,
            limit,
        });
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

        const products = await this.repository.findWithFilters({ id: String(id) });
        const currentProduct = products[0];

        if (!currentProduct) {
            throw new Error("Produto não encontrado");
        }

        const cleanCnpj = data.supplierCnpj
            ? data.supplierCnpj.replace(/\D/g, "")
            : currentProduct.supplierCnpj;

        if (data.supplierCnpj) {
            const supplier = await this.supplierRepository.findWithFilters({ cnpj: cleanCnpj });
            if (supplier.length === 0) {
                throw new Error("Fornecedor informado não existe.");
            }
        }

        if (data.registrationId && data.registrationId !== currentProduct.registrationId) {
            const productExists = await this.repository.findWithFilters({ registrationId: data.registrationId });
            if (productExists.length > 0 && Number(productExists[0].id) !== id) {
                throw new Error("Este registro já está sendo usado por outro produto");
            }
        }

        // mesclage do estado do produto anteriro com o novo (garante que não surja campos undefined caso não passado no novo request)
        const finalData = {
            registrationId: data.registrationId ?? currentProduct.registrationId,
            branch: data.branch ?? currentProduct.branch,
            productGroup: data.productGroup ?? currentProduct.productGroup,
            brand: data.brand ?? currentProduct.brand,
            description: data.description ?? currentProduct.description,
            reference: data.reference ?? currentProduct.reference,
            price: data.price ?? currentProduct.price,
            stock: data.stock !== undefined ? data.stock : currentProduct.stock,
            productType: data.productType ?? currentProduct.productType,
            unitOfMeasure: data.unitOfMeasure ?? currentProduct.unitOfMeasure,
            images: data.images ?? currentProduct.images,
            tradeName: data.tradeName ?? currentProduct.tradeName,
            active: data.active !== undefined ? data.active : currentProduct.active,
            size: data.size ?? currentProduct.size,
            supplierCnpj: cleanCnpj
        };

        // tirando o data antigo pelo final data corrigido
        return this.repository.update(String(id), finalData);
    }

    async deleteProduct(id: string) {
        const products = await this.repository.findWithFilters({ id });

        if (products.length === 0) {
            throw new Error("Produto não encontrado para exclusão.");
        }

        await this.repository.delete(id);
    }
}
