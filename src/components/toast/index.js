import React, { useState, useEffect } from 'react';
import './toast.css';

const Toast = ({ message, type, onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 10);
    }, 1900);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className={`toast ${show ? 'show' : 'hide'} ${type}`}>
      <div className="toast-header">
        <span>Toast</span>
        <span className="toast-close" onClick={() => setShow(false)}>×</span>
      </div>
      <div className="toast-body">
        {message}
      </div>
    </div>
  );
};

export default Toast;
