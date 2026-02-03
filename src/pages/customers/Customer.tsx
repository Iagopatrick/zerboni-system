import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import GenericTable from "../../components/GenericTable";
import { ActionButtons } from "../../components/ActionButtons";
import { ButtonAdd } from "../../components/ButtonAdd";
import { DeleteModal } from "../../components/DeleteModal";
import { ErrorModal } from "../../components/ErrorModal";

interface CustomerPageProps {
  onCreate: () => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
}

export const CustomerPage = ({ onCreate, onView, onEdit }: CustomerPageProps) => {
  const [customer, setCustomer] = useState<CustomerType[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [search, setSearch] = useState("");
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<number>(null);

  const [error, setError] = useState<string | null>(null);
  
  async function loadCustomers() {
    try{
      const { rows, total, page: currentPage, limit, totalPages } = await window.api.getCustomers({
        search,
        page,
        limit: rowsPerPage,
      });

      setCustomer(rows);
      setTotalCustomer(total);
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
    loadCustomers();
  }, [search, page, rowsPerPage]);

  function openDeleteModal(customerId: number) {
    setCustomerToDelete(customerId);
    setDeleteModalOpen(true);
  }

  async function confirmDelete() {
    try{
      if (!customerToDelete) return;

      await window.api.deleteCustomers(customerToDelete);

      setDeleteModalOpen(false);
      setCustomerToDelete(null);

      loadCustomers();
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
      key: "name",
      title: "Nome",
      render: (r: CustomerType) => (
        <p className="font-bold p-2 min-w-30">{r.name}</p>
      ),
    },
    {
      key: "phone",
      title: "Telefone",
      render: (r: CustomerType) => (
        <p className="font-bold p-2 min-w-30">{r.phoneNumber}</p>
      ),
    },
    {
      key: "cpf",
      title: "CPF",
      render: (r: CustomerType) => r.cpf || "-",
    },
    {
      key: "created_at",
      title: "Criado em",
      render: (r: CustomerType) =>
        r.created_at
          ? new Date(r.created_at).toLocaleString()
          : "-",
    },
    {
      key: "update",
      title: "Ação",
      render: (r: CustomerType) => (
        <ActionButtons
          onInfo={() => onView(Number(r.id))}
          onEdit={() => onEdit(Number(r.id))}
          onRemove={() => openDeleteModal(Number(r.id))}
        />
      ),
    }
  ];

  return (
    <div className="pt-10 w-full overflow-y-auto max-h-screen pb-2">
      <DeleteModal
        text="Tem certeza que deseja excluir o cliente?"
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCustomerToDelete(null);
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
            placeholder="Buscar cliente..."
            value={search}
            onChange={(value) => setSearch(value)}
          />
          <ButtonAdd
            onClick={onCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Adicionar Cliente
          </ButtonAdd>
        </div>

        <GenericTable 
          columns={columns}
          data={customer}
          page={page}
          totalPages={totalPages}
          totalElements={totalCustomer}
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
