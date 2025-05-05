import './button.component.css';

interface AppButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "default" | "cancel";
  className?: string;
}

export function AppButton({ onClick, children, type = "button", disabled = false, variant = "default", className = "" }: AppButtonProps) {
  const buttonClass = variant === "cancel" ? "btn-cancel" : "btn-enhanced";
  return (
    <button className={`${buttonClass} ${className}`} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
}