import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <AlertTriangle size={24} className="modal-icon" />
          <h2 className="modal-title">{title}</h2>
        </div>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button onClick={onCancel} className="btn btn-secondary">
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel(); // Fecha o modal após confirmar
            }}
            className="btn btn-danger"
          >
            Confirmar Exclusão
          </button>
        </div>
      </div>
    </div>
  );
}