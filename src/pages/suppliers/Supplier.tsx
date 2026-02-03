import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import GenericTable from "../../components/GenericTable";
import { ActionButtons } from "../../components/ActionButtons";
import { ButtonAdd } from "../../components/ButtonAdd";
import { DeleteModal } from "../../components/DeleteModal";
import { SupplierType } from "../../types/supplier";
import { ErrorModal } from "../../components/ErrorModal";

interface SupplierPageProps {
  onCreate: () => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
}

export const SupplierPage = ({ onCreate, onView, onEdit }: SupplierPageProps) => {
  const [suppliers, setSuppliers] = useState<SupplierType[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [search, setSearch] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  async function loadSuppliers() {
    try{
      const { rows, total, page: currentPage, limit, totalPages } =
      await window.api.getSuppliers({
        search,
        page,
        limit: rowsPerPage,
      });

      setSuppliers(rows);
      setTotalSuppliers(total);
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
    loadSuppliers();
  }, [search, page, rowsPerPage]);

  function openDeleteModal(supplierId: number) {
    setSupplierToDelete(supplierId);
    setDeleteModalOpen(true);
  }

  async function confirmDelete() {
    try{
      if (!supplierToDelete) return;

      await window.api.deleteSuppliers(supplierToDelete);

      setDeleteModalOpen(false);
      setSupplierToDelete(null);

      loadSuppliers();
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
      key: "legal_name",
      title: "Nome Legal",
      render: (r: SupplierType) => (
        <p className="font-bold p-2 min-w-30">{r.legalName}</p>
      ),
    },
    {
      key: "email",
      title: "E-mail",
      render: (r: SupplierType) => r.email || "-",
    },
    {
      key: "cnpj",
      title: "E-CNPJ",
      render: (r: SupplierType) => r.cnpj || "-",
    },
    {
      key: "created_at",
      title: "Criado em",
      render: (r: SupplierType) =>
        r.created_at
          ? new Date(r.created_at).toLocaleString()
          : "-",
    },
    {
      key: "actions",
      title: "Ação",
      render: (r: SupplierType) => (
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
        text="Tem certeza que deseja excluir o fornecedor?"
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSupplierToDelete(null);
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
            placeholder="Buscar fornecedores..."
            value={search}
            onChange={(value) => setSearch(value)}
          />

          <ButtonAdd
            onClick={onCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Adicionar Fornecedor
          </ButtonAdd>
        </div>

        <GenericTable
          columns={columns}
          data={suppliers}
          page={page}
          totalPages={totalPages}
          totalElements={totalSuppliers}
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
