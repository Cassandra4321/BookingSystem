import './button.component.css';

interface AppButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "default" | "cancel";
}

export function AppButton({ onClick, children, type = "button", disabled = false, variant = "default" }: AppButtonProps) {
  const className = variant === "cancel" ? "btn-cancel" : "btn-enhanced";
  return (
    <button className={className} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
}