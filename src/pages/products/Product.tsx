import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import GenericTable from "../../components/GenericTable";
import { ActionButtons } from "../../components/ActionButtons";
import { ButtonAdd } from "../../components/ButtonAdd";
import { DeleteModal } from "../../components/DeleteModal";
import { SupplierType } from "../../types/supplier";
import { ErrorModal } from "../../components/ErrorModal";
import { ProductType } from "../../types/product";

interface ProductPageProps {
  onCreate: () => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
}

export const ProductPage = ({ onCreate, onView, onEdit }: ProductPageProps) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [search, setSearch] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  async function loadProducts() {
    try{
      const { rows, total, page: currentPage, limit, totalPages } =
      await window.api.getProducts({
        search,
        page,
        limit: rowsPerPage,
      });

      setProducts(rows);
      setTotalProducts(total);
      setPage(currentPage);
      setRowsPerPage(limit);
      setTotalPages(totalPages);
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

  useEffect(() => {
    loadProducts();
  }, [search, page, rowsPerPage]);

  function openDeleteModal(productId: number) {
    setProductToDelete(productId);
    setDeleteModalOpen(true);
  }

  async function confirmDelete() {
    try{
      if (!productToDelete) return;

      await window.api.deleteProducts(productToDelete);

      setDeleteModalOpen(false);
      setProductToDelete(null);

      loadProducts();
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

  const columns = [
    {
      key: "registrationId",
      title: "Matrícula",
      render: (r: ProductType) => (
        <p className="font-bold p-2 min-w-30">{r.registrationId}</p>
      ),
    },
    {
      key: "name",
      title: "Nome Comercial",
      render: (r: ProductType) => r.tradeName || "-",
    },
    {
      key: "brand",
      title: "Marca",
      render: (r: ProductType) => r.brand || "-",
    },
    {
      key: "stock",
      title: "Quantidade em estoque",
      render: (r: ProductType) => r.stock || "-",
    },
    {
      key: "price",
      title: "Preço",
      render: (r: ProductType) => r.stock || "-",
    },
    {
      key: "createdAt",
      title: "Criado em",
      render: (r: ProductType) =>
        r.created_at
          ? new Date(r.created_at).toLocaleString()
          : "-",
    },
    {
      key: "actions",
      title: "Ação",
      render: (r: ProductType) => (
        <ActionButtons
          onInfo={() => onView(Number(r.id))}
          onEdit={() => onEdit(Number(r.id))}
          onRemove={() => openDeleteModal(Number(r.id))}
        />
      ),
    },
  ];

  return (
    <div className="pt-10 w-full">
      <DeleteModal
        text="Tem certeza que deseja excluir o produto?"
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={confirmDelete}
      />
      <ErrorModal
        open={!!error}
        errorMessage={error}
        onClose={() => setError(null)}
      />

      <div className="flex flex-col items-center px-8">
        <div className="flex gap-10 w-full mb-4">
          <SearchBar
            className="w-full"
            placeholder="Buscar produtos..."
            value={search}
            onChange={(value) => setSearch(value)}
          />

          <ButtonAdd
            onClick={onCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Adicionar Produto
          </ButtonAdd>
        </div>

        <GenericTable
          columns={columns}
          data={products}
          page={page}
          totalPages={totalPages}
          totalElements={totalProducts}
          rowsPerPage={rowsPerPage}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newLimit) => {
            setRowsPerPage(newLimit);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
};
