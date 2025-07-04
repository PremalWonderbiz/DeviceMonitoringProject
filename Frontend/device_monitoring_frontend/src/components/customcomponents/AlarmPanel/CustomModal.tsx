import React, { useRef, useState } from "react";
import styles from "@/styles/scss/AlarmPanel.module.scss";

const CustomModal = ({
  setAlarmComment,
  isOpen,
  setIsOpen,
  title,
  footer = true,
  defaultComment
}: any) => {
  const [tempAlarmComment, setTempAlarmComment] = useState<string>("");
  const commentTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  const changeAlarmComment = async (value: string) => {
          if (commentTimeoutRef.current) {
              clearTimeout(commentTimeoutRef.current);
          }
  
          if (value === "") {
              setTempAlarmComment("");
              return;
          }
  
          commentTimeoutRef.current = setTimeout(async () => {
              setTempAlarmComment(value);
          }, 200);
  };
  const handleClose = () => setIsOpen(false);

  const handleSave = () => {
    setAlarmComment(tempAlarmComment)
    setIsOpen(false);
  }

  if (!isOpen) return null; // Don't render anything if closed

  return (
    <div
      style={{
        position: "absolute", // Use fixed for screen-wide modal
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
        backgroundColor: "#2e2c2b",
        color: "#fff",
        padding: "0.5rem 1rem",
        borderRadius: "8px",
        boxShadow: "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
        width: "300px",
      }}
      onClick={(e: any) => { e.stopPropagation() }}
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        style={{
          position: "absolute",
          top: "6px",
          right: "10px",
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        ×
      </button>

      {/* Title */}
      <h3 style={{ fontSize: "0.9rem", marginBottom: "0.5rem", textAlign: "left" }}>
        {title}
      </h3>

      {/* Body */}
      <div style={{ marginBottom: "0.5rem" }}>
        <div>
          <input defaultValue={defaultComment} onChange={(event: any) => { changeAlarmComment(event.target.value) }} className={styles.resolveCommentInput} type="text" placeholder="Optional comment" />
        </div>
      </div>

      {/* Footer */}
      {footer && (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
          <button
            onClick={handleClose}
            style={{
              padding: "0.2rem 0.6rem",
              background: "#444",
              border: "none",
              color: "#fff",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: "0.2rem 0.6rem",
              background: "#3182ce",
              border: "none",
              color: "#fff",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomModal;
