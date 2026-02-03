import { useEffect, useState } from "react";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import {
  FaArrowLeft,
  FaUserCheck,
  FaUserEdit,
  FaUserPlus,
} from "react-icons/fa";
import { TaxRegime, PaymentMethod } from "../../../types/supplier";
import {brazilStates} from "../../../constans/states";
import { Select } from "../../../components/Select";
import { ErrorModal } from "../../../components/ErrorModal";

const TAX_REGIMES: TaxRegime[] = [
  "Simples Nacional",
  "Lucro Presumido",
  "Lucro Real",
];

const PAYMENT_METHODS: PaymentMethod[] = [
  "Dinheiro",
  "Cheque",
  "Cartao_credito",
  "Cartao_debito",
  "Pix",
];

interface SupplierFormPageProps {
  mode: "create" | "view" | "edit";
  supplierId: number | null;
  onBack: () => void;
}

export const SupplierFormPage = ({
  mode,
  supplierId,
  onBack,
}: SupplierFormPageProps) => {
    const [legalName, setLegalName] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [email, setEmail] = useState("");
    const [invoiceEmail, setInvoiceEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [fax, setFax] = useState("");
    const [active, setActive] = useState<boolean>(false);

    const [cep, setCep] = useState("");
    const [street, setStreet] = useState("");
    const [streetNumber, setStreetNumber] = useState<number | "">("");
    const [neighborhood, setNeighborhood] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("ES");

    const [producerTaxId, setProducerTaxId] = useState("");
    const [municipalTaxId, setMunicipalTaxId] = useState("");
    const [stateTaxId, setStateTaxId] = useState("");
    const [taxRegime, setTaxRegime] = useState<TaxRegime>("Simples Nacional");

    const [cashAccount, setCashAccount] = useState("");
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    "Dinheiro",
    ]);

    const [website, setWebsite] = useState("");
    const [notes, setNotes] = useState("");

    const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && supplierId) {
      (async () => {
        const res = await window.api.getSuppliers();
        const supplier = res.rows.find((s) => s.id === supplierId);
        if (!supplier) return;
        console.log(supplier)
        setLegalName(supplier.legalName);
        setActive(supplier.active);
        setCnpj(supplier.cnpj);
        setEmail(supplier.email);
        setInvoiceEmail(supplier.invoceEmail ?? "");
        setPhone(supplier.phoneNumber);
        setFax(supplier.fax ?? "");

        setCep(supplier.cep);
        setStreet(supplier.street);
        setStreetNumber(supplier.streetNumber);
        setNeighborhood(supplier.neighborhood);
        setCity(supplier.city);
        setState(supplier.state);

        setProducerTaxId(supplier.producerTaxId ?? "");
        setMunicipalTaxId(supplier.municipalTaxId ?? "");
        setStateTaxId(supplier.stateTaxId ?? "");
        setTaxRegime(supplier.taxRegime);

        setCashAccount(supplier.cashAccount);
        setPaymentMethods(supplier.paymentMethods);

        setWebsite(supplier.website ?? "");
        setNotes(supplier.notes ?? "");
      })();
    }
  }, [mode, supplierId]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Trim e valores padrão
    const safeCnpj = cnpj.trim();
    const safeEmail = email.trim();
    const safeInvoiceEmail = invoiceEmail.trim() || null;
    const safePhone = phone.trim();
    const safeFax = fax.trim() || null;
    const safeCashAccount = cashAccount.trim();
    const safeWebsite = website.trim() || null;
    const safeNotes = notes.trim() || null;
    const safeStreetNumber = Number(streetNumber) || 0;

    // Garante que pelo menos um método de pagamento esteja selecionado
    const safePaymentMethods = paymentMethods.length > 0 ? paymentMethods : ["Dinheiro"];

    // Payload completo
    const payload = {
      legalName: legalName.trim(),
      active,
      cnpj: safeCnpj,
      email: safeEmail,
      invoceEmail: safeInvoiceEmail,
      phoneNumber: safePhone,
      fax: safeFax,
      cep: cep.trim(),
      street: street.trim(),
      streetNumber: safeStreetNumber,
      neighborhood: neighborhood.trim(),
      city: city.trim(),
      state: state.trim(),
      producerTaxId: producerTaxId.trim() || null,
      municipalTaxId: municipalTaxId.trim() || null,
      stateTaxId: stateTaxId.trim() || null,
      taxRegime: taxRegime,
      cashAccount: safeCashAccount,
      paymentMethods: safePaymentMethods,
      website: safeWebsite,
      notes: safeNotes,
    };

    if (mode === "create") {
      await window.api.createSuppliers(payload);
    } else if (mode === "edit" && supplierId) {
      await window.api.updateSuppliers(supplierId, payload);
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

  const togglePaymentMethod = (method: PaymentMethod) => {
    setPaymentMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };
  

  return (
    <div className="p-10 w-full overflow-y-auto max-h-screen">
      <div className="flex mb-8 items-center gap-4">
        <Button type="button" onClick={onBack}>
          <FaArrowLeft />
        </Button>

        <h1 className="text-xl font-bold flex gap-2 items-center">
          {mode === "create" && <><FaUserPlus /> Criar Fornecedor</>}
          {mode === "view" && <><FaUserCheck /> Visualizar Fornecedor</>}
          {mode === "edit" && <><FaUserEdit /> Editar Fornecedor</>}
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
          <h2 className="font-semibold mb-2">Dados Gerais</h2>
          <div className="grid grid-cols-3 gap-4">
            <div><label htmlFor="cnpj"><p className="text-sm pb-2">CNPJ</p></label><Input placeholder="CNPJ" value={cnpj} disabled={mode === "view"} onChange={(e) => setCnpj(e.target.value)} /></div>
            <div><label htmlFor="legal_name"><p className="text-sm pb-2">Razão Social</p></label><Input placeholder="Razão Social" value={legalName} disabled={mode === "view"} onChange={(e) => setLegalName(e.target.value)} /></div>
            <div><label htmlFor="email"><p className="text-sm pb-2">Email</p></label><Input placeholder="Email" value={email} disabled={mode === "view"} onChange={(e) => setEmail(e.target.value)} /></div>
            <div><label htmlFor="phone_number"><p className="text-sm pb-2">Número de Celular</p></label><Input placeholder="Número de Celular" value={phone} disabled={mode === "view"} onChange={(e) => setPhone(e.target.value)} /></div>
            <div><label htmlFor="fax"><p className="text-sm pb-2">Fax</p></label><Input placeholder="Fax" value={fax} disabled={mode === "view"} onChange={(e) => setFax(e.target.value)} /></div>
            <div><label htmlFor="website"><p className="text-sm pb-2">Website</p></label><Input placeholder="Website" value={website} disabled={mode === "view"} onChange={(e) => setWebsite(e.target.value)} /></div>
            <div><label htmlFor="invoce_email"><p className="text-sm pb-2">Email de fatura</p></label><Input placeholder="Email de fatura" value={invoiceEmail} disabled={mode === "view"} onChange={(e) => setInvoiceEmail(e.target.value)} /></div>
            <div><label htmlFor="cash_account"><p className="text-sm pb-2">Conta Caixa</p></label><Input placeholder="Conta Caixa" value={cashAccount} disabled={mode === "view"} onChange={(e) => setCashAccount(e.target.value)} /></div>
            <div><label htmlFor="notes"><p className="text-sm pb-2">Notas</p></label><Input placeholder="Notas" value={notes} disabled={mode === "view"} onChange={(e) => setNotes(e.target.value)} /></div>
          </div>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Endereço</h2>
          <div className="grid grid-cols-4 gap-4">
            <div><label htmlFor="cep"><p className="text-sm pb-2">CEP</p></label><Input placeholder="CEP" value={cep} disabled={mode === "view"} onChange={(e) => setCep(e.target.value)} /></div>
            <div><label htmlFor="street"><p className="text-sm pb-2">Rua</p><Input placeholder="Rua" value={street} disabled={mode === "view"} onChange={(e) => setStreet(e.target.value)} /></label></div>
            <div><label htmlFor="neighborhood"><p className="text-sm pb-2">Bairro</p></label><Input placeholder="Bairro" value={neighborhood} disabled={mode === "view"} onChange={(e) => setNeighborhood(e.target.value)} /></div>
            <div className="w-24"><label htmlFor="street_number"><p className="text-sm pb-2">Número</p></label><Input placeholder="Número" value={streetNumber} disabled={mode === "view"} onChange={(e) => setStreetNumber(Number(e.target.value))} type="number" min={0}/></div> 
            <div><label htmlFor="city"><p className="text-sm pb-2">Cidade</p></label><Input placeholder="Cidade" value={city} disabled={mode === "view"} onChange={(e) => setCity(e.target.value)} /></div>
            <div><label htmlFor="state"><p className="text-sm pb-2">Estado</p></label><Select value={state} onChange={(e) => setState(e.target.value)} options={brazilStates} className="w-fit h-11"/></div>
            
          </div>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Fiscal</h2>
          <div className="grid grid-cols-4 gap-4">
            <div><label htmlFor="producer_tax_id"><p className="text-sm pb-2">Inscrição Produtor</p></label><Input placeholder="Inscrição Produtor" value={producerTaxId} disabled={mode === "view"} onChange={(e) => setProducerTaxId(e.target.value)} /></div>
            <div><label htmlFor="municipal_tax_id"><p className="text-sm pb-2">Inscrição Municipal</p></label><Input placeholder="Inscrição Municipal" value={municipalTaxId} disabled={mode === "view"} onChange={(e) => setMunicipalTaxId(e.target.value)} /></div>
            <div><label htmlFor="state_tax_id"><p className="text-sm pb-2">Inscrição Estadual</p></label><Input placeholder="Inscrição Estadual" value={stateTaxId} disabled={mode === "view"} onChange={(e) => setStateTaxId(e.target.value)} /></div>
            <div><label htmlFor="tax_regime"><p className="text-sm pb-2">Regime de Imposto</p></label>
              <select
                disabled={mode === "view"}
                value={taxRegime}
                onChange={(e) => setTaxRegime(e.target.value as TaxRegime)}
                className="h-11 w-fit border-2 border-secondary shadow-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-secondary"
              >
                {TAX_REGIMES.map((regime) => (
                  <option key={regime} value={regime}>{regime}</option>
                ))}
              </select>
              </div>
          </div>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Formas de Pagamento</h2>
          <div className="flex gap-4">
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method}
                className="flex items-center gap-3 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  className="peer hidden"
                  disabled={mode === "view"}
                  checked={paymentMethods.includes(method)}
                  onChange={() => togglePaymentMethod(method)}
                />
                <div className="h-5 w-5 rounded border-2 border-secondary flex items-center justify-center peer-checked:bg-secondary peer-checked:border-secondary peer-disabled:opacity-50">
                  <svg
                    className="hidden peer-checked:block text-white"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <span className="text-sm">{method}</span>
              </label>
            ))}
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
