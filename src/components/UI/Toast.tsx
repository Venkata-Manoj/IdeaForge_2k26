import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const icons: Record<ToastType, string> = {
  success: '✅',
  error: '❌',
  warning: '⚡',
  info: 'ℹ️',
};

const colors: Record<ToastType, string> = {
  success: '#00C853',
  error: '#FF1744',
  warning: '#FF9100',
  info: '#2196F3',
};

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  onClose, 
  duration = 5000 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className="fixed top-6 right-6 bg-white/5 backdrop-blur-xl border border-white/8 rounded-xl py-4 px-6 flex items-center gap-3 transition-all duration-300 z-[9999] max-w-[400px]"
      style={{
        transform: isVisible ? 'translateX(0)' : 'translateX(120%)',
        opacity: isVisible ? 1 : 0,
      }}
    >
      <span className="text-xl">{icons[type]}</span>
      <span className="text-sm" style={{ 
        fontFamily: "'Space Grotesk', sans-serif",
        color: colors[type],
      }}>
        {message}
      </span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="bg-transparent border-0 text-gray-500 cursor-pointer text-lg p-1 ml-2 hover:text-gray-400 transition-colors"
      >
        ×
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    type: ToastType;
  }>;
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-6 right-6 z-[9999]">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};