import { useEffect, useState } from "react";
import { CashFlowChart } from "./components/cashflowChart";
import { CardCashflow } from "./components/Card";
import { CardCashflowIn } from "./components/CardIn";
import { Box } from "@mui/material";
import { CardPayments } from "./components/CardPayments";
export type MovimentationPerMonth = {
  month: number;
  total: {
    in: number;
    out: number;
  };
};

export type PaymentType = "PIX" | "CREDITO" | "DEBITO" | "DINHEIRO" | "CHEQUE";

export type Payment = {
  type: PaymentType;
  amount: number;
  percentage: number;
};

export type DashboardData = {
  totalSales: number;
  totalExpenses: number;
  movimentationPerMonth: MovimentationPerMonth[];
  payment: Payment[];
};

export const formatToBRL = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const Dashboard = () => {
  const [movimentation, setMovimentation] = useState<any[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [sales, setSales] = useState(0);
  const [expenses, setExpenses] = useState(0);
  async function loadDashboardData() {
    try {
      const data = await window.api.getDashboardData();
      console.log(data as DashboardData);
      setMovimentation(data.movimentationPerMonth);
      setPayments(data.payment);
      setExpenses(data.totalExpenses);
      setSales(data.totalSales);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="p-4">
      <Box sx={{ width: "1000px", display: "flex", marginBottom: "32px", justifyContent: "space-between" }}>
        <CardCashflow title="Total de Vendas" value={formatToBRL(sales)} />
        <CardCashflowIn
          title="Total de Despesas"
          value={formatToBRL(expenses)}
        />
      </Box>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CashFlowChart movimentation={movimentation} />
      </div>
      <CardPayments payments={payments} />
    </div>
  );
};
