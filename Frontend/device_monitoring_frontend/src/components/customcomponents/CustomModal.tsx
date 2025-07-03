import { useEffect, useRef } from "react";

const CustomModal = ({
  isOpen,
  setIsOpen,
  triggerButton,
  content,
  title,
  footer = true,
}: any) => {
  const handleClose = () => setIsOpen(false);
  
  return (
    <>
      {triggerButton ?? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: "6px 12px",
            border: "1px solid #ccc",
            background: "#f4f4f4",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Open Modal
        </button>
      )}

      {isOpen  && (
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            backgroundColor: "#262626",
            color: "#fff",
            padding: "0.3rem 0.5rem",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            width: "250px",
          }}
        >
            
          <button
            onClick={handleClose}
            style={{
              position: "absolute",
              top: "4px",
              right: "8px",
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            ×
          </button>

          {/* Modal Title */}
          <h3 style={{ fontSize: "0.9rem", marginBottom: "0.2rem", textAlign: "start" }}>{title}</h3>

          {/* Modal Content */}
          <div style={{ marginBottom: "0.2rem" }}>{content}</div>

          {/* Footer with buttons */}
          {footer && (
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button
                onClick={handleClose}
                style={{
                  padding: "0.2rem 0.5rem",
                  background: "#444",
                  border: "none",
                  color: "#fff",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.8rem"
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: "0.2rem 0.5rem",
                  background: "#3182ce",
                  border: "none",
                  color: "#fff",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.8rem"
                }}
              >
                Save
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CustomModal;
