import { useEffect, useState } from "react";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import {
  FaArrowLeft,
  FaUserCheck,
  FaUserEdit,
  FaUserPlus,
} from "react-icons/fa";
import { TaxRegime, PaymentMethod, SupplierType } from "../../../types/supplier";
import {brazilStates} from "../../../constans/states";
import { Select } from "../../../components/Select";
import { ErrorModal } from "../../../components/ErrorModal";

export type PaymentType =
  | "Dinheiro"
  | "Cheque"
  | "Cartao_credito"
  | "Cartao_debito"
  | "Pix";

export type MovementType =
  "Entrada" |
  "Saida"
  ;

const PAYMENT_METHODS: PaymentMethod[] = [
  "Dinheiro",
  "Cheque",
  "Cartao_credito",
  "Cartao_debito",
  "Pix",
];

const MOVEMENTS: MovementType[] = [
  "Entrada",
  "Saida"
];

interface SupplierPaymentFormPageProps {
  mode: "create" | "view" | "edit";
  supplierPaymentId: number | null;
  onBack: () => void;
}

export const SupplierPaymentFormPage = ({
  mode,
  supplierPaymentId,
  onBack,
}: SupplierPaymentFormPageProps) => {
    const [supplierId, setSupplierId] = useState("");
    const [paymentDate, setPaymentDate] = useState("");
    const [amount, setAmount] = useState("");
    const [paymentType, setPaymentType] = useState<PaymentType>("Pix");
    const [movementType, setMovementType] = useState("");
    const [description, setDescription] = useState(""); 

    const [suppliers, setSuppliers] = useState<SupplierType[]>([]);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && supplierPaymentId) {
      try{
        async function loadSupplierPayment() {
          const res = await window.api.getSuppliersPayments();
          const supplierPayment = res.rows.find((s) => s.id === supplierPaymentId);
          if (!supplierPayment) return;

          setSupplierId(supplierPayment.supplierId);
          setPaymentDate(handleDate(supplierPayment.paymentDate));
          setAmount(supplierPayment.amount);
          setPaymentType(supplierPayment.paymentType);
          setMovementType(supplierPayment.movementType);
          setDescription(supplierPayment.description);
        };
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
  }, [mode, supplierPaymentId]);

  useEffect(() => {
    async function loadSuppliers() {
      try {
        const res = await window.api.getSuppliers();
        setSuppliers(res.rows);
      } catch (err: any) {
        let message = "Erro ao carregar fornecedores";
        if (err?.response?.data?.message) {
          message = err.response.data.message;
        } else if (err?.message) {
          message = err.message;
        }
        setError(message);
      }
    }

    loadSuppliers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        supplierId,
        paymentDate,
        amount,
        paymentType,
        movementType,
        description,
      };

      if (mode === "create") {
        await window.api.createSuppliersPayments(payload);
      } else if (mode === "edit" && supplierPaymentId) {
        await window.api.updateSuppliersPayments(supplierPaymentId, payload);
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

  const handleDate = (data: string) => {
    return new Date(data).toISOString().slice(0,10)
  }

  return (
    <div className="p-10 w-full overflow-y-auto max-h-screen">
      <div className="flex mb-8 items-center gap-4">
        <Button type="button" onClick={onBack}>
          <FaArrowLeft />
        </Button>

        <h1 className="text-xl font-bold flex gap-2 items-center">
          {mode === "create" && <><FaUserPlus /> Criar Pagamento de Fornecedor</>}
          {mode === "view" && <><FaUserCheck /> Visualizar Pagamento de Fornecedor</>}
          {mode === "edit" && <><FaUserEdit /> Editar Pagamento de Fornecedor</>}
        </h1>
      </div>

      <ErrorModal
        open={!!error}
        errorMessage={error}
        onClose={() => setError(null)}
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-fit">
        
        <section>
          <h2 className="font-semibold mb-2">Dados Gerais</h2>
          <div className="flex gap-4 flex-col w-full">
            <div><label htmlFor="amount"><p className="text-sm pb-2">Valor</p></label><Input placeholder="Valor" value={amount} disabled={mode === "view"} onChange={(e) => setAmount(e.target.value)} /></div>
            <div><label htmlFor="description"><p className="text-sm pb-2">Descrição</p></label><Input placeholder="Descrição" value={description} disabled={mode === "view"} onChange={(e) => setDescription(e.target.value)} /></div>
          </div>  
        </section>
        <section>
          <div className="flex gap-4 w-fit">
            <div className="w-fit"><label htmlFor="paymentDate"><p className="text-sm pb-2">Data de Pagamento</p></label><Input type="date" placeholder="Data de Pagamento" value={paymentDate} disabled={mode === "view"} onChange={(e) => setPaymentDate(e.target.value)} /></div>
            <div><label htmlFor="paymentType"><p className="text-sm pb-2">Tipo de Pagamento</p></label>
              <select
                disabled={mode === "view"}
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value as PaymentType)}
                className="h-11 w-fit border-2 border-secondary shadow-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-secondary"
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
            <div><label htmlFor="movementType"><p className="text-sm pb-2">Tipo de Movimento</p></label>
              <select
                disabled={mode === "view"}
                value={movementType}
                onChange={(e) => setMovementType(e.target.value as MovementType)}
                className="h-11 w-fit border-2 border-secondary shadow-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-secondary"
              >
                {MOVEMENTS.map((movements) => (
                  <option key={movements} value={movements}>{movements}</option>
                ))}
              </select>
            </div>
            <div>
            <label htmlFor="supplierId"><p className="text-sm pb-2">Fornecedor</p></label>
            <select
              disabled={mode === "view"}
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="h-11 w-full border-2 border-secondary shadow-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-secondary"
            >
              <option value="">Selecione um fornecedor</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.legalName}
                </option>
              ))}
            </select>
          </div>
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
