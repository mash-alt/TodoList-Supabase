import React, { useState, createContext, useContext, useRef, forwardRef, useImperativeHandle } from 'react';
import Toast from './Toast';

const ToastContainer = forwardRef((props, ref) => {
  const [toasts, setToasts] = useState([]);

  // Expose methods to parent components
  useImperativeHandle(ref, () => ({
    addToast: (message, type = 'info', duration = 3000) => {
      const id = Date.now();
      const newToast = { id, message, type, duration };
      setToasts(prevToasts => [...prevToasts, newToast]);
      return id;
    },
    removeToast: (id) => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }
  }));

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToasts(prevToasts => prevToasts.filter(t => t.id !== toast.id))}
        />
      ))}
    </div>
  );
});

// Create a context to use toast globally
const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const toastRef = useRef(null);

  const toast = {
    success: (message, duration) => {
      toastRef.current?.addToast(message, 'success', duration);
    },
    error: (message, duration) => {
      toastRef.current?.addToast(message, 'error', duration);
    },
    info: (message, duration) => {
      toastRef.current?.addToast(message, 'info', duration);
    },
    warning: (message, duration) => {
      toastRef.current?.addToast(message, 'warning', duration);
    }
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer ref={toastRef} />
    </ToastContext.Provider>
  );
};

export default ToastContainer;
