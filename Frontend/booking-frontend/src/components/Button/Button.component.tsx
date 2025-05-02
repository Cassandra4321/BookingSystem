import './button.component.css';

interface AppButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled: boolean;
}

export function AppButton({ onClick, children, type = "button", disabled = false }: AppButtonProps) {
  return (
    <button className="btn-enhanced" onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
}