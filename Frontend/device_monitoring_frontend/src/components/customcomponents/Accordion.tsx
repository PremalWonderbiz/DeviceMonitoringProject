import { ReactNode, useEffect, useState } from 'react';
import styles from "@/styles/scss/Accordion.module.scss";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAccordionState } from './Propertypanel/AccordionVisibilityContext';

type AccordionProps = {
  title: any;
  children: ReactNode;
  defaultOpen?: boolean;
  bgColor?: string;
  isTabList?:boolean;
  keyPath? : any;
};

export default function Accordion({title, children, defaultOpen = true, isTabList = false, bgColor = "#fff", keyPath }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const context = useAccordionState();
  
  useEffect(() => {
    if(keyPath)
      context?.register(keyPath, isOpen);
  }, [isOpen]);

  return (
    <div className={styles.accordion} style={{ backgroundColor: bgColor }} >
      <div className={`${styles.header} ${isTabList ? styles.tabListHeader : null}`} onClick={() => setIsOpen(!isOpen)}>
        <div>{title}</div>
        <span>{isOpen ? <ChevronUp /> : <ChevronDown />}</span>
      </div>
      <div
        className={`${styles.content} ${isOpen ? styles.open : ''}`}
      >
        {children}
      </div>
    </div>
  );
}
