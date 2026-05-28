import { useEffect, useState } from 'react';
import '../styles/ErrorToast.css';
interface ErrorToastProps {
  message: string;
  duration: number;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({ message, duration = 3000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [message, duration]);

  if (!visible) return null;
  return (
    <div className="error-toast">
      {message}
    </div>
  );
};