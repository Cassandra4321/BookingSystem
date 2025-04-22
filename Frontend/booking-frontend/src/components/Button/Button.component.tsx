import './button.component.css';

interface AppButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
}

export function AppButton({ onClick, children, type = "button" }: AppButtonProps) {
  return (
    <button className="btn-enhanced" onClick={onClick} type={type}>
      {children}
    </button>
  );
}