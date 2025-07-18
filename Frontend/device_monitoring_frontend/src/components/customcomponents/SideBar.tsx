import React, { ReactNode, useState } from "react";
import styles from "@/styles/scss/Sidebar.module.scss";
import { ChevronLeft, ChevronRight, RectangleVertical, X } from "lucide-react";
import { Tooltip } from "../ui/tooltip";

type SidebarProps = {
  position?: "left" | "right";
  children?: ReactNode;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  closeSidebar? : () => void;
  closeIconMsg : any;
  openIconMsg : any;
};

const Sidebar = ({closeIconMsg, openIconMsg, position = "left", children, isOpen = false, setIsOpen = (isOpen: boolean) => { }, closeSidebar = () => {}}: SidebarProps) => {
  return (
    <div className={`${styles.sidebar} ${styles[position]} ${isOpen ? styles.open : ""}`}>
      {position=="left" ? 
      isOpen ? <button className={styles.closeButton} onClick={() => setIsOpen(false)}> 
                <Tooltip openDelay={100} closeDelay={150} content={<span className="p-2">{closeIconMsg}</span>}>
                  <X className={styles.sidebarCloseIcon} size={28} />
                </Tooltip></button> 
                : 
                <Tooltip openDelay={100} closeDelay={150} content={<span className="p-2">{openIconMsg}</span>}>
                  <div onClick={() => setIsOpen(true)} className={`${styles.closeIcon} ${styles.rightCloseIcon}`} > <ChevronRight/> </div>
                </Tooltip>
                 :
      isOpen ? <button className={styles.closeButton} onClick={() => closeSidebar()}>
                <Tooltip openDelay={100} closeDelay={150} content={<span className="p-2">{closeIconMsg}</span>}>
                  <X className={styles.sidebarCloseIcon} size={28} />
                </Tooltip></button> 
                 : 
                 <Tooltip openDelay={100} closeDelay={150} content={<span className="p-2">{openIconMsg}</span>}>
                  <div onClick={() => setIsOpen(true)} className={`${styles.closeIcon} ${styles.leftCloseIcon}`} > <ChevronLeft/> </div> 
                </Tooltip>
                 
      }
      {children}
    </div>
  );
};

export default Sidebar;

