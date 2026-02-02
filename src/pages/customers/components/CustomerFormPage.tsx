import { useEffect, useState } from "react";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { FaArrowLeft, FaUserCheck, FaUserEdit, FaUserPlus } from "react-icons/fa";
import { Select } from "../../../components/Select";

export const brazilStates = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

interface CustomerFormPageProps {
  mode: "create" | "view" | "edit";
  customerId: number | null;
  onBack: () => void;
}

export const CustomerFormPage = ({ mode, customerId, onBack }: CustomerFormPageProps) => {
  
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [state, setState] = useState("ES");
  const [streetNumber, setStreetNumber] = useState<number>(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && customerId !== null) {
      async function loadUser() {
        try {
          const customers = await window.api.getCustomers();
          const customer = customers.rows.find((u: { id: number; }) => u.id === customerId);
          if (customer) {
            setName(customer.name);
            setCpf(customer.cpf);
            setCep(customer.cep);
            setStreet(customer.street);
            setNeighborhood(customer.neighborhood);
            setState(customer.state);
            setStreetNumber(customer.streetNumber);
            setPhoneNumber(customer.phoneNumber);
            setEmail(customer.email);
          }
        } catch (err) {
          console.error("Erro ao carregar cliente:", err);
        }
      }
      loadUser();
    }
  }, [mode, customerId]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "create") {
        await window.api.createCustomers({ 
            name,
            cpf, 
            cep, 
            street, 
            neighborhood, 
            state, 
            streetNumber, 
            phoneNumber,
            email 
        });
      } else if (mode === "edit" && customerId !== null) {
        await window.api.updateCustomers(customerId, { 
            name,
            cpf, 
            cep, 
            street, 
            neighborhood, 
            state, 
            streetNumber, 
            phoneNumber,
            email 
        });
      }

      onBack(); 
    } catch (err) {
      console.error("Erro ao salvar cliente:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10  h-full w-full">
      
      <div className="flex text-secondary mb-8 ">
        <Button 
          type="button"
          onClick={onBack}
          className="p-2 rounded-sm cursor-pointer"
        >
          <FaArrowLeft/>
        </Button>
        <h1 className="flex items-center text-xl font-bold pl-6 gap-2">
          {mode === "create" && <><FaUserPlus />Criar Cliente</>}
          {mode === "view" && <><FaUserCheck />Visualizar Cliente</>}
          {mode === "edit" && <><FaUserEdit />Editar Cliente</>}
        </h1>
      </div>

      <form className="flex flex-col gap-4 max-w-md" onSubmit={handleSubmit}>
        <div className="">
          <label htmlFor="name">
            <p className="text-sm pb-2">Nome do Cliente</p>
          </label>
          <Input
            name="name"
            placeholder="Nome"
            disabled={mode === "view"}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="w-40">
            <label htmlFor="cpf">
              <p className="text-sm pb-2">CPF</p>
            </label>
            <Input
              name="cpf"
              placeholder="CPF"
              disabled={mode === "view"}
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
          </div>
          <div className="w-40">
            <label htmlFor="phone_number">
              <p className="text-sm pb-2">Telefone</p>
            </label>
            <Input
              name="phone_number"
              placeholder="Telefone"
              disabled={mode === "view"}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>
        
        <div className="">
          <label htmlFor="street">
            <p className="text-sm pb-2">Rua</p>
          </label>
          <Input
            name="street"
            placeholder="Rua"
            disabled={mode === "view"}
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <div className="w-40">
            <label htmlFor="neighborhood">
              <p className="text-sm pb-2">Bairro</p>
            </label>
            <Input
              name="neighborhood"
              placeholder="Bairro"
              disabled={mode === "view"}
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
            />
          </div>
          <div className="w-24">
            <label htmlFor="street_number">
              <p className="text-sm pb-2">Nº</p>
            </label>
            <Input
              name="street_number"
              type="number"
              min={0}
              placeholder="Nº"
              disabled={mode === "view"}
              value={streetNumber}
              onChange={(e) => setStreetNumber(Number(e.target.value))}
            />
          </div>
          <div className="w-40">
          <label htmlFor="cep">
            <p className="text-sm pb-2">CEP</p>
          </label>
          <Input
            name="cep"
            placeholder="CEP"
            disabled={mode === "view"}
            value={cep}
            onChange={(e) => setCep(e.target.value)}
          />
        </div>
        </div>
        <div className="w-50">
          <label htmlFor="state">
            <p className="text-sm pb-2">Estado</p>
          </label>
          <Select
            value={state}
            onChange={(e) => setState(e.target.value)}
            options={brazilStates}
          />
        </div>
        
        
        <div className="">
          <label htmlFor="email">
            <p className="text-sm pb-2">Email</p>
          </label>
          <Input
            name="email"
            placeholder="Email"
            disabled={mode === "view"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex justify-end w-full">
          {mode !== "view" && (
            <Button 
              type="submit"
              disabled={loading}
              className="px-6"
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          )}
        </div>
        
      </form>
    </div>
  );
};
