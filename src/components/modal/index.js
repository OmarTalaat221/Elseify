import React, { useEffect, useState } from "react";
import "./Modal.css";

const Modal = ({
  visible,
  title,
  children,
  onCancel,
  onOk,
  close,
  footer = true,
  okText = "OK",
  cancelText = "Cancel",
}) => {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [visible]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      if (close) close(false);
      if (onCancel) onCancel();
    }, 300);
  };
  
  
  
  
  
  if (!visible && !closing) return null;

  return (
    <div className="custom-modal-overlay">
      <div className={`custom-modal ${closing ? "custom-modal-exit" : ""}`}>
        <div className="custom-modal-header">
          <h2>{title}</h2>
          <span onClick={() => handleClose()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeDasharray={16}
                strokeDashoffset={16}
                strokeLinecap="round"
                strokeWidth={2}
              >
                <path d="M7 7L17 17">
                  <animate
                    fill="freeze"
                    attributeName="stroke-dashoffset"
                    dur="0.4s"
                    values="16;0"
                  ></animate>
                </path>
                <path d="M17 7L7 17">
                  <animate
                    fill="freeze"
                    attributeName="stroke-dashoffset"
                    begin="0.4s"
                    dur="0.4s"
                    values="16;0"
                  ></animate>
                </path>
              </g>
            </svg>
          </span>
        </div>
        <div className="custom-modal-body">{children}</div>
        {footer && (
          <div className="custom-modal-footer">
            {onCancel && (
              <button
                className="custom-modal-btn cancel-btn"
                onClick={handleClose}
              >
                {cancelText}
              </button>
            )}
            {onOk && (
              <button className="custom-modal-btn ok-btn" onClick={onOk}>
                {okText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
