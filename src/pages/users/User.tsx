import { useEffect, useState } from "react";
import { userService } from "../../services/user-service";
import SearchBar from "../../components/SearchBar";
import GenericTable from "../../components/GenericTable";
import FilterButtons from "../../components/FilterButtons";
import { title } from "process";
import { ActionButtons } from "../../components/ActionButtons";
import { CreateUserModal } from "./components/CreateUserModal";
import { ButtonAdd } from "../../components/ButtonAdd";
import { DeleteUserModal } from "./components/DeleteUserModal";

interface UserPageProps {
  onCreate: () => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
}

export const Userpage = ({ onCreate, onView, onEdit }: UserPageProps) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [search, setSearch] = useState("");
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number>(null);
  
  async function loadUsers() {
    const data = await window.api.getUsers();
    setUsers(data);
    setFilteredUsers(data);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  function openDeleteModal(userId: number) {
    setUserToDelete(userId);
    setDeleteModalOpen(true);
  }

  async function confirmDelete() {
    if (!userToDelete) return;

    await window.api.deleteUsers(userToDelete);

    setDeleteModalOpen(false);
    setUserToDelete(null);

    loadUsers();
  }

  const columns = [
    {
      key: "name",
      title: "Nome",
      render: (r: UserType) => (
        <p className="font-bold p-2 min-w-30">{r.name}</p>
      ),
    },
    {
      key: "email",
      title: "E-mail",
      render: (r: UserType) => r.email || "-",
    },
    {
      key: "created_at",
      title: "Criado em",
      render: (r: UserType) =>
        r.created_at
          ? new Date(r.created_at).toLocaleString()
          : "-",
    },
    {
      key: "update",
      title: "Ação",
      render: (r: UserType) => (
        <ActionButtons
          onInfo={() => onView(Number(r.id))}
          onEdit={() => onEdit(Number(r.id))}
          onRemove={() => openDeleteModal(Number(r.id))}
        />
      ),
    }
  ];

  return (
    <div className="pt-10 w-full">
      <DeleteUserModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDelete}
      />
      <div className="flex flex-col items-center px-8">
        <div className="flex gap-10 w-full mb-4">
          <SearchBar
          className="w-full"
            placeholder="Buscar usuários..."
            value={search}
            onChange={(value) => setSearch(value)}
          />
          <ButtonAdd
            onClick={onCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Adicionar Usuário
          </ButtonAdd>
        </div>

        <GenericTable columns={columns} data={filteredUsers} />
      </div>
    </div>
  );
};
