import React, { createContext, useContext, useState, useEffect } from "react";

interface DateContextProps {
  dates: [Date | undefined, Date | undefined];
  setDates: React.Dispatch<React.SetStateAction<[Date | undefined, Date | undefined]>>;
  clearDates: () => void; // Add the clear function here
}

const DateContext = createContext<DateContextProps | undefined>(undefined);

export const DateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dates, setDates] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);

  // Function to adjust date to local timezone
  const adjustToLocalTimezone = (date: Date): Date => {
    const localDate = new Date(date);
    const offset = localDate.getTimezoneOffset(); // Get the timezone offset in minutes
    localDate.setMinutes(localDate.getMinutes() - offset); // Adjust the date by the offset
    return localDate;
  };

  // Load dates from localStorage if available
  useEffect(() => {
    const storedDates = localStorage.getItem("dates");
    if (storedDates) {
      const parsedDates: [string, string] = JSON.parse(storedDates);
      setDates([new Date(parsedDates[0]), new Date(parsedDates[1])]);
    }
  }, []);

  // Save dates to localStorage whenever they change
  useEffect(() => {
    if (dates[0] && dates[1]) {
      localStorage.setItem("dates", JSON.stringify([dates[0].toISOString(), dates[1].toISOString()]));
    }
  }, [dates]);

  // Ensure that the array has exactly two elements
  const adjustedDates: [Date | undefined, Date | undefined] = [
    dates[0] ? adjustToLocalTimezone(dates[0]) : undefined,
    dates[1] ? adjustToLocalTimezone(dates[1]) : undefined,
  ];

  // Clear the dates and remove from localStorage
  const clearDates = () => {
    setDates([undefined, undefined]);
    localStorage.removeItem("dates"); // Clear the dates from localStorage
  };

  return (
    <DateContext.Provider value={{ dates: adjustedDates, setDates, clearDates }}>
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
