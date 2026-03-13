import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    visible: false,
    type: 'success',
    title: '',
    message: '',
    duration: 3000,
  });

  const showToast = useCallback(({ type = 'success', title, message, duration = 3000 }) => {
    setToast({
      visible: true,
      type,
      title,
      message,
      duration,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  // Helper functions for common toast types
  const showSuccess = useCallback((title, message) => {
    showToast({ type: 'success', title, message });
  }, [showToast]);

  const showError = useCallback((title, message) => {
    showToast({ type: 'error', title, message });
  }, [showToast]);

  const showWarning = useCallback((title, message) => {
    showToast({ type: 'warning', title, message });
  }, [showToast]);

  const showInfo = useCallback((title, message) => {
    showToast({ type: 'info', title, message });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning, showInfo, hideToast }}>
      {children}
      <Toast
        visible={toast.visible}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        duration={toast.duration}
        onHide={hideToast}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
