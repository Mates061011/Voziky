import React, { createContext, useRef, useContext, ReactNode } from 'react';

const ScrollContext = createContext<React.RefObject<HTMLDivElement> | null>(null);

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  return <ScrollContext.Provider value={targetRef}>{children}</ScrollContext.Provider>;
};

export const useScrollContext = () => useContext(ScrollContext);
