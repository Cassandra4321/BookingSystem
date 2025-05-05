import "./Modal.css";
import { AppButton } from "../Button/Button.component";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBook: () => void;
  title: string;
  description: string;
  actionLabel: string;
  time: string;
}

export function Modal({ isOpen, onClose, onBook, title, description, actionLabel, time }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{description}</p>
        <p>{time}</p>
        <div className="modal-buttons">
        <AppButton onClick={onBook} variant={actionLabel === "Avboka" ? "cancel" : "default"}>{actionLabel}</AppButton>
        <AppButton onClick={onClose} variant="cancel" className="grå">Stäng</AppButton>
        </div>
      </div>
    </div>
  );
}
