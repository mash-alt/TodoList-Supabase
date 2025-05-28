import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose(), 300); // Wait for fade-out animation before removing
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const toastClass = `toast toast-${type} ${visible ? 'visible' : 'hidden'}`;

  return (
    <div className={toastClass}>
      <div className="toast-content">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Toast;
