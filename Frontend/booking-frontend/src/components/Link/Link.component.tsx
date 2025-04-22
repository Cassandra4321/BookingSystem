import { Link } from 'react-router-dom';
import '../Button/button.component.css';

export function AppLinkButton({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="btn-enhanced">
      {children}
    </Link>
  );
}
