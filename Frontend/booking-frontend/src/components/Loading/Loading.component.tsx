import './Loading.component.css';
import { ClipLoader } from 'react-spinners';

interface LoadingProps {
  size?: number;
  color?: string;
}

export function AppLoading({ size = 50, color = '#3498db' }: LoadingProps) {
  return (
    <div className="loading-container">
      <ClipLoader color={color} size={size} />
    </div>
  );
}
