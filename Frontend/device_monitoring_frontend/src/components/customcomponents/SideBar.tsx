import React, { ReactNode, useState } from "react";
import styles from "@/styles/scss/Sidebar.module.scss";
import { X } from "lucide-react";

type SidebarProps = {
  position?: "left" | "right";
  children?: ReactNode;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
};

const Sidebar = ({position = "left", children, isOpen = false, setIsOpen = (isOpen: boolean) => { }}: SidebarProps) => {
  return (
    <div className={`${styles.sidebar} ${styles[position]} ${isOpen ? styles.open : ""}`}>
      <button className={styles.closeButton} onClick={() => setIsOpen(!isOpen)}><X size={28} /></button>
      {children}
    </div>
  );
};

export default Sidebar;

