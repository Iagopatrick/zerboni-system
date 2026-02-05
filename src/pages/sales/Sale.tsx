import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import GenericTable from "../../components/GenericTable";
import { ActionButtons } from "../../components/ActionButtons";
import { ButtonAdd } from "../../components/ButtonAdd";
import { ErrorModal } from "../../components/ErrorModal";
import { formatToBRL } from "../dashboard/Dashboard";

interface SalePageProps {
  onCreate: () => void;
  onView: (id: number) => void;
}

export const SalePage = ({ onCreate, onView }: SalePageProps) => {
  const [sales, setSales] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSales, setTotalSales] = useState(0);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const getPaymentLabel = (type: number) => {
    const types: Record<number, string> = {
      1: "Dinheiro",
      2: "Cartão de Crédito",
      3: "Cartão de Débito",
      5: "Pix",
    };
    return types[type] || "Outro";
  };

  async function loadSales() {
    try {
      const response = await window.api.listSales({
        search,
        page,
        limit: rowsPerPage,
      });

      setSales(response.rows || []);
      setTotalSales(response.total || 0);
      setTotalPages(response.totalPages || 1);
      console.log("Vendas carregadas:", response);
      console.log("Parâmetros usados:", { search, page, limit: rowsPerPage });
      console.log("Vendas atuais no estado:", sales);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar a listagem de vendas.");
    }
  }

  useEffect(() => {
    loadSales();
  }, [search, page, rowsPerPage]);

  const columns = [
    {
      key: "id",
      title: "Cód. Venda",
      render: (s: any) => (
        <p className="font-bold p-2"># {String(s.id).padStart(4, "0")}</p>
      ),
    },
    {
      key: "customer",
      title: "Cliente",
      render: (s: any) => s.customer_name || "Não identificado",
    },
    {
      key: "payment_type",
      title: "Pagamento",
      render: (s: any) => getPaymentLabel(s.payment_type),
    },
    {
      key: "total_value",
      title: "Valor Total",
      render: (s: any) => (
        <span className="font-semibold text-secondary">
          {formatToBRL(Number(s.total_value))}
        </span>
      ),
    },
    {
      key: "created_at",
      title: "Data e Hora",
      render: (s: any) =>
        s.created_at ? new Date(s.created_at).toLocaleString("pt-BR") : "-",
    },
    {
      key: "actions",
      title: "Ação",
      render: (s: any) => (
        <ActionButtons
          onInfo={() => onView(Number(s.id))}
          hideEdit={true}
          hideRemove={true}
          onEdit={() => {}}
          onRemove={() => {}}
        />
      ),
    },
  ];

  return (
    <div className="pt-10 w-full px-8">
      <ErrorModal
        open={!!error}
        errorMessage={error}
        onClose={() => setError(null)}
      />

      <div className="flex flex-col items-center">
        <div className="flex gap-10 w-full mb-4">
          <SearchBar
            className="w-full"
            placeholder="Buscar vendas por ID ou nome do cliente..."
            value={search}
            onChange={(value) => setSearch(value)}
          />

          <ButtonAdd onClick={onCreate} className="min-w-[200px]">
            Nova Venda
          </ButtonAdd>
        </div>

        <GenericTable
          columns={columns}
          data={sales}
          page={page}
          totalPages={totalPages}
          totalElements={totalSales}
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
