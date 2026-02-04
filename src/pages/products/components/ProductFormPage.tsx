import { useEffect, useState } from "react";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import {
  FaArrowLeft,
  FaUserCheck,
  FaUserEdit,
  FaUserPlus,
} from "react-icons/fa";
import { Select } from "../../../components/Select";
import { ErrorModal } from "../../../components/ErrorModal";


interface ProductFormPageProps {
  mode: "create" | "view" | "edit";
  productId: number | null;
  onBack: () => void;
}

export const ProductFormPage = ({
  mode,
  productId,
  onBack,
}: ProductFormPageProps) => {
    const [registrationId, setRegistrationId] = useState("");
    const [branch, setBranch] = useState("");
    const [productGroup, setProductGroup] = useState("");
    const [brand, setBrand] = useState("");
    const [description, setDescription] = useState<string | null>(null);
    const [reference, setReference] = useState("");
    const [price, setPrice] = useState("");

    const [stock, setStock] = useState<number>(0);
    const [productType, setProductType] = useState<string | null>(null);
    const [unitOfMeasure, setUnitOfMeasure] = useState<number | "">("");
    const [images, setImages] = useState<string[]>([]);
    const [tradeName, setTradeName] = useState<string | null>(null);
    const [active, setActive] = useState<boolean>(false);

    const [size, setSize] = useState<string | null>(null);
    const [supplierCnpj, setSupplierCnpj] = useState("");

    const [suppliers, setSuppliers] = useState<
      { cnpj: string; legalName: string }[]
    >([]);

    const [newImage, setNewImage] = useState("");

    const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && productId) {
      try{
        async function loadProduct() {
          const res = await window.api.getProducts();
          const product = res.rows.find((s) => s.id === productId);
          if (!product) return;
          
          setRegistrationId(product.registrationId);
          setBranch(product.branch);
          setProductGroup(product.productGroup);
          setBrand(product.brand);
          setDescription(product.description);
          setReference(product.reference);
          setPrice(product.price);
          setStock(product.stock);
          setProductType(product.productType);
          setUnitOfMeasure(product.unitOfMeasure);
          setImages(product.images);
          setTradeName(product.tradeName);
          setActive(product.active);
          setSize(product.size);
          setSupplierCnpj(product.supplierCnpj);
        };
        loadProduct();
      }catch(err){
        let message = "Erro inesperado";

        if (err?.response?.data?.message) {
          message = err.response.data.message;
        } else if (err?.message) {
          message = err.message;
        }

        setError(message);
      }
    }
  }, [mode, productId]);

  useEffect(() => {
    async function loadSuppliers() {
      const res = await window.api.getSuppliers();
      setSuppliers(
        res.rows.map((s: any) => ({
          cnpj: s.cnpj,
          legalName: s.legalName,
        }))
      );
    }

    loadSuppliers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        registrationId,
        branch,
        productGroup,
        brand,
        description,
        reference,
        price,
        stock,
        productType,
        unitOfMeasure,
        images,
        tradeName,
        active,
        size,
        supplierCnpj
      };

      if (mode === "create") {
        await window.api.createProducts(payload);
      } else if (mode === "edit" && productId) {
        await window.api.updateProducts(productId, payload);
      }
      
      onBack();
    } catch (err) {
      let message = "Erro inesperado";

      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        message = err.message;
      }

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 w-full overflow-y-auto max-h-screen">
      <div className="flex mb-8 items-center gap-4">
        <Button type="button" onClick={onBack}>
          <FaArrowLeft />
        </Button>

        <h1 className="text-xl font-bold flex gap-2 items-center">
          {mode === "create" && <><FaUserPlus /> Criar Produto</>}
          {mode === "view" && <><FaUserCheck /> Visualizar Produto</>}
          {mode === "edit" && <><FaUserEdit /> Editar Produto</>}
        </h1>
      </div>

      <ErrorModal
        open={!!error}
        errorMessage={error}
        onClose={() => setError(null)}
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <section>
          <label className="flex items-center gap-3 cursor-pointer w-fit">
            <span className="text-sm text-gray-700">Ativo</span>

            <div className="relative">
              <input
                type="checkbox"
                checked={active}
                disabled={mode === "view"}
                onChange={(e) => setActive(e.target.checked)}
                className="sr-only"
              />

              <div
                className={`
                  w-11 h-6 rounded-full transition
                  ${active ? "bg-secondary" : "bg-gray-300"}
                  ${mode === "view" ? "opacity-60 cursor-not-allowed" : ""}
                `}
              />

              <div
                className={`
                  absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition
                  ${active ? "translate-x-5" : ""}
                `}
              />
            </div>
          </label>
        </section>
        
        <section>
          <h2 className="font-semibold mb-2">Identificação do Produto</h2>
          <div className="grid grid-cols-3 gap-4">
            <div><label htmlFor="registrationId"><p className="text-sm pb-2">Matrícula</p></label><Input placeholder="Nome" value={registrationId} disabled={mode === "view"} onChange={(e) => setRegistrationId(e.target.value)} /></div>
            <div><label htmlFor="reference"><p className="text-sm pb-2">Referência</p></label><Input placeholder="Referência" value={reference} disabled={mode === "view"} onChange={(e) => setReference(e.target.value)} /></div>
            <div><label htmlFor="tradeName"><p className="text-sm pb-2">Nome Comercial</p></label><Input placeholder="Nome comercial" value={tradeName} disabled={mode === "view"} onChange={(e) => setTradeName(e.target.value)} /></div>            
            <div><label htmlFor="description"><p className="text-sm pb-2">Descrição</p></label><Input placeholder="Descrição" value={description} disabled={mode === "view"} onChange={(e) => setDescription(e.target.value)} /></div>
          </div>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Classificação</h2>
          <div className="grid grid-cols-4 gap-4">
            <div><label htmlFor="productGroup"><p className="text-sm pb-2">Grupo</p></label><Input placeholder="Grupo" value={productGroup} disabled={mode === "view"} onChange={(e) => setProductGroup(e.target.value)} /></div>
            <div><label htmlFor="productType"><p className="text-sm pb-2">Tipo</p><Input placeholder="Tipo" value={productType} disabled={mode === "view"} onChange={(e) => setProductType(e.target.value)} /></label></div>
            <div><label htmlFor="brand"><p className="text-sm pb-2">Marca</p></label><Input placeholder="Marca" value={brand} disabled={mode === "view"} onChange={(e) => setBrand(e.target.value)} /></div>
            
          </div>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Preço e Estoque</h2>
          <div className="grid grid-cols-4 gap-4">
            <div><label htmlFor="price"><p className="text-sm pb-2">Preço</p></label><Input placeholder="Preço" value={price} disabled={mode === "view"} onChange={(e) => setPrice(e.target.value)} /></div>
            <div><label htmlFor="stock"><p className="text-sm pb-2">Estoque</p></label><Input placeholder="Estoque" value={stock} disabled={mode === "view"} onChange={(e) => setStock(Number(e.target.value))} type="number" min={0} max={2000000000} /></div>
            <div><label htmlFor="unitOfMeasure"><p className="text-sm pb-2">Unidade de Medida</p></label><Input placeholder="Unidade de Medida" value={unitOfMeasure} disabled={mode === "view"} onChange={(e) => setUnitOfMeasure(Number(e.target.value))} type="number" min={0} max={2000000000}  /></div>
          </div>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Características e Origem</h2>
          <div className="grid grid-cols-4 gap-4">
            <div><label htmlFor="size"><p className="text-sm pb-2">Tamanho</p></label><Input placeholder="Tamanho" value={size} disabled={mode === "view"} onChange={(e) => setSize(e.target.value)} /></div>
            <div><label htmlFor="branch"><p className="text-sm pb-2">Filial</p></label><Input placeholder="Filial" value={branch} disabled={mode === "view"} onChange={(e) => setBranch(e.target.value)} /></div>
            <div>
              <label htmlFor="supplierCnpj">
                <p className="text-sm pb-2">Fornecedor</p>
              </label>
              <Select
                value={supplierCnpj}
                disabled={mode === "view"}
                onChange={(e) => setSupplierCnpj(e.target.value)}
                options={suppliers.map((s) => ({
                  label: s.legalName,
                  value: s.cnpj,
                }))}
                className="h-11 w-fit"
              />
            </div>
            {/* falta a imagem */}
          </div>
        </section>

        {mode !== "view" && (
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
