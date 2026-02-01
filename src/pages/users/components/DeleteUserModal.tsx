import { Button } from "../../../components/Button";

interface DeleteUserModalProps {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteUserModal = ({
  open,
  onConfirm,
  onClose,
}: DeleteUserModalProps) => {
  if (!open) return null;

  return (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-[#0277a0] rounded-lg p-8 w-100 shadow-lg text-center">
      <h2 className="text-lg text-white font-bold mb-2">
      Confirmar exclusão
      </h2>

      <p className="mb-6 text-white">
      Tem certeza que deseja excluir o usuário?
      <br />
      Essa ação não poderá ser desfeita.
      </p>

      <div className="flex justify-center gap-4 w-full">
        <Button 
          onClick={onConfirm}
          className="w-32"
        >
          Sim
        </Button>

        <Button 
          onClick={onClose}
          className="w-32"
        >
          Não
        </Button>
      
      </div>
    </div>
  </div>
  );
};
