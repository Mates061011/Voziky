import React, { createContext, useContext, useState } from "react";

interface DateContextProps {
  dates: [Date | undefined, Date | undefined];
  setDates: React.Dispatch<React.SetStateAction<[Date | undefined, Date | undefined]>>;
}

const DateContext = createContext<DateContextProps | undefined>(undefined);

export const DateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dates, setDates] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);

  const adjustToLocalTimezone = (date: Date): Date => {
    const localDate = new Date(date);
    const offset = localDate.getTimezoneOffset(); // Get the timezone offset in minutes
    localDate.setMinutes(localDate.getMinutes() - offset); // Adjust the date by the offset
    return localDate;
  };

  // Ensure that the array has exactly two elements
  const adjustedDates: [Date | undefined, Date | undefined] = [
    dates[0] ? adjustToLocalTimezone(dates[0]) : undefined,
    dates[1] ? adjustToLocalTimezone(dates[1]) : undefined,
  ];

  return (
    <DateContext.Provider value={{ dates: adjustedDates, setDates }}>
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
