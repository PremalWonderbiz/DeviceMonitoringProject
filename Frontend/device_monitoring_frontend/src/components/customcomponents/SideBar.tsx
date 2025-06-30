import React, { ReactNode, useState } from "react";
import styles from "@/styles/scss/Sidebar.module.scss";
import { ChevronLeft, ChevronRight, RectangleVertical, X } from "lucide-react";

type SidebarProps = {
  position?: "left" | "right";
  children?: ReactNode;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
};

const Sidebar = ({position = "left", children, isOpen = false, setIsOpen = (isOpen: boolean) => { }}: SidebarProps) => {
  return (
    <div className={`${styles.sidebar} ${styles[position]} ${isOpen ? styles.open : ""}`}>
      {position=="left" ? 
      isOpen ? <button className={styles.closeButton} onClick={() => setIsOpen(false)}><X size={28} /></button> : <div onClick={() => setIsOpen(true)} className={`${styles.closeIcon}`} > <ChevronRight/> </div> :
      <button className={styles.closeButton} onClick={() => setIsOpen(!isOpen)}><X size={28} /></button>}
      {children}
    </div>
  );
};

export default Sidebar;

