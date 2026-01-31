import { useEffect, useState } from "react";
import { userService } from "../../services/user-service";
import SearchBar from "../../components/SearchBar";
import GenericTable from "../../components/GenericTable";
import FilterButtons from "../../components/FilterButtons";
import { title } from "process";
import { ActionButtons } from "../../components/ActionButtons";
import { CreateUserModal } from "./components/CreateUserModal";
import { ButtonAdd } from "../../components/ButtonAdd";

export const Userpage = () => {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    async function loadUsers() {
      // const users = await window.api.getUsers();
      // setUsers(users);
    }

    loadUsers();
  }, []);
  // Example columns and data (replace with real data from API)
  const exampleColumns = [
    {
      key: "name",
      title: "Nome",
      render: (r: any) => <p className="font-bold p-2 min-w-30">{r.name}</p>,
    },
    { key: "email", title: "E-mail" },
    {
      key: "created_at",
      title: "Criado em",
      render: (r: any) =>
        r.created_at ? new Date(r.created_at).toLocaleString() : "-",
    },
    {
      key: "update",
      title: "Ação",
      render: (r: any) => <ActionButtons />,
    },
  ];

  const exampleData = [
    {
      id: "1",
      name: "Alice Silva",
      email: "alice@example.com",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Bruno Costa",
      email: "",
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Carla Souza",
      email: "carla@example.com",
      created_at: new Date().toISOString(),
    },
  ];

  const filterOptions = [
    { label: "Com e-mail", value: "has_email" },
    { label: "Sem e-mail", value: "no_email" },
  ];

  return (
    <div className="pt-10">
      <CreateUserModal open={openModal} onClose={() => setOpenModal(false)} />
      <div className="flex flex-col items-center px-8">
        <div className="flex gap-10 w-full mb-4">
          <SearchBar
            placeholder="Buscar usuários..."
            value={""}
            onChange={() => void 0}
          />
          <ButtonAdd
            onClick={() => setOpenModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Adicionar Usuário
          </ButtonAdd>
        </div>

        <GenericTable columns={exampleColumns} data={exampleData} />
      </div>
      <ul>
        {users?.map((user: any) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};
