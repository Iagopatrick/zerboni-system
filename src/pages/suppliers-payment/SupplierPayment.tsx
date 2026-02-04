import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import GenericTable from "../../components/GenericTable";
import { ActionButtons } from "../../components/ActionButtons";
import { ButtonAdd } from "../../components/ButtonAdd";
import { DeleteModal } from "../../components/DeleteModal";
import { SupplierType } from "../../types/supplier";
import { ErrorModal } from "../../components/ErrorModal";
import { SupplierPaymentType } from "../../types/supplier-payment";

interface SupplierPaymentPageProps {
  onCreate: () => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
}

export const SupplierPaymentPage = ({ onCreate, onView, onEdit }: SupplierPaymentPageProps) => {
  const [supplierPayment, setSupplierPayment] = useState<SupplierPaymentType[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSupplierPayment, setTotalSupplierPayment] = useState(0);
  const [search, setSearch] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  async function loadSupplierPayment() {
    try{
      const { rows, total, page: currentPage, limit, totalPages } =
      await window.api.getSuppliersPayments({
        search,
        page,
        limit: rowsPerPage,
      });

      setSupplierPayment(rows);
      setTotalSupplierPayment(total);
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
    loadSupplierPayment();
  }, [search, page, rowsPerPage]);

  function openDeleteModal(supplierId: number) {
    setSupplierToDelete(supplierId);
    setDeleteModalOpen(true);
  }

  async function confirmDelete() {
    try{
      if (!supplierToDelete) return;

      await window.api.deleteSuppliersPayments(supplierToDelete);

      setDeleteModalOpen(false);
      setSupplierToDelete(null);

      loadSupplierPayment();
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
      key: "id",
      title: "Identificador",
      render: (r: SupplierPaymentType) => (
        <p className="font-bold p-2 min-w-30">{r.id}</p>
      ),
    },
    {
      key: "paymentDate",
      title: "Data do pagamento",
      render: (r: SupplierPaymentType) => new Date(r.paymentDate).toLocaleString() || "-",
    },
    {
      key: "movementType",
      title: "Tipo de Movimentação",
      render: (r: SupplierPaymentType) => r.movementType || "-",
    },
    {
      key: "createdAt",
      title: "Criado em",
      render: (r: SupplierPaymentType) =>
        r.createdAt
          ? new Date(r.createdAt).toLocaleString()
          : "-",
    },
    {
      key: "actions",
      title: "Ação",
      render: (r: SupplierPaymentType) => (
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
        text="Tem certeza que deseja excluir o pagamento de fornecedor?"
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
            placeholder="Buscar pagamento de fornecedores..."
            value={search}
            onChange={(value) => setSearch(value)}
          />

          <ButtonAdd
            onClick={onCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Adicionar Pagamento de Fornecedor
          </ButtonAdd>
        </div>

        <GenericTable
          columns={columns}
          data={supplierPayment}
          page={page}
          totalPages={totalPages}
          totalElements={totalSupplierPayment}
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
