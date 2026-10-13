import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = Info;
        if (toast.type === 'success') Icon = CheckCircle2;
        if (toast.type === 'warning') Icon = AlertTriangle;
        if (toast.type === 'error') Icon = AlertCircle;

        const iconColor = {
          info: 'var(--color-info)',
          success: 'var(--color-success)',
          warning: 'var(--color-warning)',
          error: 'var(--color-error)',
        }[toast.type];

        return (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span style={{ color: iconColor, marginTop: '2px', display: 'flex' }}>
              <Icon size={18} />
            </span>
            <div className="toast-content">
              <div className="toast-title">{toast.title}</div>
              {toast.message && <div className="toast-message">{toast.message}</div>}
            </div>
            <button
              className="toast-close"
              onClick={() => removeToast(toast.id)}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
