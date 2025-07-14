import React, { createContext, useContext, useState } from "react";

const AccordionStateContext = createContext<{
  state: Record<string, boolean>;
  register: (path: string, isOpen: boolean) => void;
} | null>(null);

export const AccordionStateProvider = ({ children } : any) => {
  const [state, setState] = useState<Record<string, boolean>>({});

  const register = (path: string, isOpen: boolean) => {
    setState(prev => ({ ...prev, [path]: isOpen }));
  };

  return (
    <AccordionStateContext.Provider value={{ state, register }}>
      {children}
    </AccordionStateContext.Provider>
  );
};

export const useAccordionState = () => useContext(AccordionStateContext);
