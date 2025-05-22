import React, { useEffect, useState } from 'react';

interface SnackbarProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number; // Duration in milliseconds, default is 3000
  onClose: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, type, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) {
    return null;
  }

  return (
    <div className={`snackbar ${type}`}>
      {message}
    </div>
  );
};

export default Snackbar; 