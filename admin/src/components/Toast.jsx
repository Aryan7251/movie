import React from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import './Toast.css';

const Toast = ({ type, message, onClose }) => {
  const icons = {
    success: <CheckCircle className="toast-icon success" size={20} />,
    error: <XCircle className="toast-icon error" size={20} />,
    warning: <AlertTriangle className="toast-icon warning" size={20} />,
    info: <Info className="toast-icon info" size={20} />
  };

  return (
    <div className={`toast toast-${type}`}>
      {icons[type]}
      <p className="toast-message">{message}</p>
      <button onClick={onClose} className="toast-close">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
