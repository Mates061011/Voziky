import React, { createContext, useContext, useState, useEffect } from "react";

interface DateContextProps {
  dates: [Date | undefined, Date | undefined];
  setDates: React.Dispatch<React.SetStateAction<[Date | undefined, Date | undefined]>>;
}

const DateContext = createContext<DateContextProps | undefined>(undefined);

export const DateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dates, setDates] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);


  return (
    <DateContext.Provider value={{ dates, setDates }}>
      {children}
    </DateContext.Provider>
  );
};

export const useDateContext = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDateContext must be used within a DateProvider");
  }
  return context;
};
