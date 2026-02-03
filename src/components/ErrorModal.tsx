import { useState } from "react";
import { Button } from "./Button";

interface ErrorModalProps {
  open: boolean;
  errorMessage: string | null;
  onClose: () => void;
}

export const ErrorModal = ({
  errorMessage,
  open,
  onClose
}: ErrorModalProps) => {
  if (!open) return null;

  return (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-[#0277a0] rounded-lg p-8 w-100 shadow-lg text-center">
      <h2 className="text-lg text-white font-bold mb-2">
      Erro inesperado: 
      </h2>

      <p className="mb-6 text-white">
      {errorMessage}
      </p>

      <div className="flex justify-center gap-4 w-full">
        <Button 
          onClick={onClose}
          className="w-32"
        >
          OK
        </Button>     
      </div>
    </div>
  </div>
  );
};
