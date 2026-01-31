import React, { useState } from "react";

type Props = {
  open?: boolean;
  onClose?: () => void;
  onCreate?: (data: { username: string; password: string }) => void;
};

export const CreateUserModal: React.FC<Props> = ({
  open = true,
  onClose,
  onCreate,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (!open) return null;

  const handleCreate = () => {
    onCreate?.({ username, password });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      <div className="relative bg-slate-400 w-full max-w-md mx-4 rounded-lg shadow-lg p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Criar Usuário</h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="text-gray-600 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-shadow-blue-600">Nome</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nome do usuário"
            className="bg-white w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          />

          <label className="block text-sm text-shadow-blue-600">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="bg-white w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Criar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
