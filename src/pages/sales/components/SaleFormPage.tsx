import { useEffect, useState } from "react";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Select } from "../../../components/Select";
import { FaArrowLeft, FaCartPlus, FaTrash } from "react-icons/fa";

// Adicionada a interface de Props para sincronizar com o Home.tsx
interface SaleFormPageProps {
  mode: "create" | "view" | "edit";
  saleId: number | null;
  onBack: () => void;
}

export const SaleFormPage = ({ mode, saleId, onBack }: SaleFormPageProps) => {
  const [customerId, setCustomerId] = useState("");
  const [cpf, setCpf] = useState("");
  const [paymentType, setPaymentType] = useState("1"); // 1: Dinheiro, 5: Pix
  const [items, setItems] = useState<
    {
      productId: number;
      name: string;
      quantity: number;
      unitPrice: number;
      description: string;
    }[]
  >([]);
  const [total, setTotal] = useState(0);

  // Estados para carregar dados do banco
  const [customers, setCustomers] = useState<any[]>([]);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Carregar Dados da Venda, Clientes e Produtos
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // CARREGAMENTO PARA NOVA VENDA (Modo Create)
        if (mode === "create") {
          const [custRes, prodRes] = await Promise.all([
            window.api.getCustomers(),
            window.api.getProducts({ limit: 100 }),
          ]);
          setCustomers(custRes.rows || []);
          setAvailableProducts(prodRes.rows || []);

          // Reseta estados para garantir formulário limpo
          setCustomerId("");
          setItems([]);
          setTotal(0);
        }

        // CARREGAMENTO PARA VISUALIZAÇÃO (Modo View)
        if (mode === "view" && saleId) {
          const sale = (await window.api.getSaleById(saleId)) as any;
          console.log("Dados da venda carregados:", sale);
          if (sale) {
            setCustomerId(String(sale.customer_id));
            setPaymentType(String(sale.payment_type));
            setTotal(Number(sale.total_value));

            // Injeta o cliente da venda na lista para o Select mostrar o nome
            setCustomers([{ id: sale.customer_id, name: sale.customer_name }]);

            if (sale.items && Array.isArray(sale.items)) {
              setItems(
                sale.items.map((i: any) => ({
                  productId: i.product_id,
                  name: i.product_name || `Produto #${i.product_id}`,
                  quantity: i.quantity,
                  unitPrice: Number(i.unit_price),
                  description: i.product_description || "",
                })),
              );
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [mode, saleId]);

  // 2. Lógica da RN04 e Cálculo do Total
  useEffect(() => {
    const rawTotal = items.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0,
    );

    // Desconto de 10% para Dinheiro (1) ou Pix (5)
    if (paymentType === "1" || paymentType === "5") {
      setTotal(rawTotal * 0.9);
    } else {
      setTotal(rawTotal);
    }
  }, [items, paymentType]);

  const handleCustomerChange = (id: string) => {
    setCustomerId(id);

    console.log("ID do cliente selecionado:", id);
    // Importante: verifique se c.id é número ou string no seu objeto customers
    const customer = customers.find((c) => String(c.id) === id);
    if (customer) {
      setCpf(customer.cpf);
      console.log("Cliente selecionado com sucesso:", customer.name);
    }
  };
  console.log(availableProducts);

  const addItem = (productId: string) => {
    const product = availableProducts.find((p) => p.id === Number(productId));
    if (!product) return;

    const existingItemIndex = items.findIndex(
      (item) => item.productId === product.id,
    );

    if (existingItemIndex !== -1) {
      // Se já existe, apenas aumenta a quantidade
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += 1;
      setItems(updatedItems);
    } else {
      // Se é novo, adiciona ao carrinho
      setItems([
        ...items,
        {
          productId: product.id,
          name: product.tradeName || product.name,
          quantity: 1,
          unitPrice: Number(product.price),
          description: product.description || "",
        },
      ]);
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Diagnóstico para você ver no console do navegador
    console.log("Dados antes do envio:", {
      customerId,
      itemsLength: items.length,
      totalVenda: total,
    });

    if (items.length === 0) {
      return alert("Erro: Adicione ao menos um item à venda.");
    }

    // Validação explícita
    if (!customerId || customerId === "" || items.length === 0) {
      return alert("Erro: Selecione um cliente.");
    }

    setLoading(true);
    try {
      const payload = {
        customerId: Number(customerId), // Convertendo para número para o DB
        cpf: cpf,
        sellerId: "1",
        paymentType: Number(paymentType),
        saleType: 1,
        totalValue: total, // R$ 161,82 conforme imagem
        items: items.map((i) => ({
          productId: String(i.productId),
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
      };

      await window.api.createSale(payload);
      onBack();
    } catch (error) {
      console.error("Erro na API:", error);
      alert("Erro ao finalizar venda. Verifique a conexão com o banco.");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (index: number, delta: number) => {
    const updatedItems = [...items];
    const newQuantity = updatedItems[index].quantity + delta;

    // Garante que a quantidade mínima seja 1
    if (newQuantity >= 1) {
      updatedItems[index].quantity = newQuantity;
      setItems(updatedItems);
    }
  };

  return (
    <div className="p-10 w-full overflow-y-auto max-h-screen">
      <div className="flex mb-8 items-center gap-4">
        <Button onClick={onBack}>
          <FaArrowLeft />
        </Button>
        <h1 className="text-xl font-bold">
          {mode === "create" ? "Registrar Nova Venda" : "Detalhes da Venda"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Seção Cliente e Pagamento */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium pb-2 text-gray-700">
                Selecione o Cliente
              </p>
              <Select
                // Garante que o Select reflita o estado atual
                value={customerId}
                disabled={mode === "view"}
                // Forçamos a captura do valor do evento explicitamente
                onChange={(e) => {
                  const selectedId = e.target.value;
                  console.log(
                    "Evento onChange disparado com valor:",
                    selectedId,
                  );
                  handleCustomerChange(selectedId);
                }}
                options={customers.map((c) => ({
                  label: `${c.name}`,
                  value: String(c.id),
                }))}
              />
            </div>
            <div>
              <p className="text-sm font-medium pb-2 text-gray-700">
                Forma de Pagamento
              </p>
              <Select
                value={paymentType}
                disabled={mode === "view"}
                onChange={(e) => setPaymentType(e.target.value)}
                options={[
                  { label: "Dinheiro (10% de Desconto)", value: "1" },
                  { label: "Pix (10% de Desconto)", value: "5" },
                  { label: "Cartão de Crédito", value: "2" },
                  { label: "Cartão de Débito", value: "3" },
                ]}
              />
            </div>
          </div>
        </section>

        {/* Seção de Adição e Listagem de Itens */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <FaCartPlus />{" "}
            {mode === "view" ? "Produtos Vendidos" : "Adicionar Produtos"}
          </h2>

          {mode !== "view" && (
            <div className="flex gap-4 mb-6">
              <Select
                value=""
                onChange={(e) => addItem(e.target.value)}
                options={[
                  ...availableProducts.map((p) => ({
                    label: `${p.tradeName || p.description} - R$ ${p.price}`,
                    value: String(p.id),
                  })),
                ]}
              />
            </div>
          )}

          <div className="border-t pt-4 space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-3 border-b last:border-0"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-gray-800 font-medium">
                    {item.productId} - {item.description}
                  </span>

                  {/* Botões de Quantidade */}
                  {mode !== "view" && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(index, -1)}
                        className="w-8 h-8 flex items-center justify-center border rounded bg-gray-50 hover:bg-gray-200 text-secondary font-bold"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(index, 1)}
                        className="w-8 h-8 flex items-center justify-center border rounded bg-gray-50 hover:bg-gray-200 text-secondary font-bold"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      R$ {(item.unitPrice * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase">
                      Preço Bruto
                    </p>
                  </div>
                  {mode !== "view" && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <p className="text-gray-400 text-center py-6">
                Nenhum item encontrado nesta venda.
              </p>
            )}
          </div>
        </section>

        {/* Resumo Financeiro e Finalização */}
        <div className="flex flex-col items-end gap-2 mt-4">
          <div className="text-right">
            <p className="text-gray-500 text-sm">Valor Final com Descontos:</p>
            <h2 className="text-4xl font-bold text-secondary">
              R$ {total.toFixed(2)}
            </h2>
          </div>

          {mode !== "view" && (
            <Button
              type="submit"
              disabled={loading}
              className="bg-secondary text-white px-16 py-4 text-xl font-bold mt-4 shadow-lg hover:bg-orange-600 transition-colors"
            >
              {loading ? "Processando..." : "Finalizar Venda"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
