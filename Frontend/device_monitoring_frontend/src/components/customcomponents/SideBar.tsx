import React, { ReactNode, useState } from "react";
import styles from "@/styles/scss/Sidebar.module.scss";
import { ChevronLeft, ChevronRight, RectangleVertical, X } from "lucide-react";

type SidebarProps = {
  position?: "left" | "right";
  children?: ReactNode;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  closeSidebar? : () => void;
};

const Sidebar = ({position = "left", children, isOpen = false, setIsOpen = (isOpen: boolean) => { }, closeSidebar = () => {}}: SidebarProps) => {
  return (
    <div className={`${styles.sidebar} ${styles[position]} ${isOpen ? styles.open : ""}`}>
      {position=="left" ? 
      isOpen ? <button className={styles.closeButton} onClick={() => setIsOpen(false)}><X size={28} /></button> : <div onClick={() => setIsOpen(true)} className={`${styles.closeIcon} ${styles.rightCloseIcon}`} > <ChevronRight/> </div> :
      isOpen ? <button className={styles.closeButton} onClick={() => closeSidebar()}><X size={28} /></button> : <div onClick={() => setIsOpen(true)} className={`${styles.closeIcon} ${styles.leftCloseIcon}`} > <ChevronLeft/> </div> 
      }
      {children}
    </div>
  );
};

export default Sidebar;

