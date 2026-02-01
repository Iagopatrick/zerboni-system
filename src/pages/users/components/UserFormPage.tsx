import { useEffect, useState } from "react";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { FaArrowLeft, FaUserCheck, FaUserEdit, FaUserPlus } from "react-icons/fa";

interface UserFormPageProps {
  mode: "create" | "view" | "edit";
  userId: number | null;
  onBack: () => void;
}

export const UserFormPage = ({ mode, userId, onBack }: UserFormPageProps) => {
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && userId !== null) {
      async function loadUser() {
        try {
          const users = await window.api.getUsers();
          const user = users.rows.find((u: { id: number; }) => u.id === userId);
          if (user) {
            setName(user.name);
            setEmail(user.email);
          }
        } catch (err) {
          console.error("Erro ao carregar usuário:", err);
        }
      }
      loadUser();
    }
  }, [mode, userId]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "create") {
        await window.api.createUsers({ name, email });
      } else if (mode === "edit" && userId !== null) {
        await window.api.updateUsers(userId, { name, email });
      }

      onBack(); 
    } catch (err) {
      console.error("Erro ao salvar usuário:", err);
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
          {mode === "create" && <><FaUserPlus />Criar Usuário</>}
          {mode === "view" && <><FaUserCheck />Visualizar Usuário</>}
          {mode === "edit" && <><FaUserEdit />Editar Usuário</>}
        </h1>
      </div>

      <form className="flex flex-col gap-4 max-w-md" onSubmit={handleSubmit}>
        <div className="">
          <label htmlFor="name">
            <p className="text-sm pb-2">Nome do Usuário</p>
          </label>
          <Input
            name="name"
            placeholder="Nome"
            disabled={mode === "view"}
            value={name}
            onChange={(e) => setName(e.target.value)}
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
