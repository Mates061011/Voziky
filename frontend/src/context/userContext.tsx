// userContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the User type here
export interface User {
  email: string;
  name: string;
  address: string;
  phone: string;
  surname: string;
}

// Define the context type
interface UserContextType {
  userData: User;
  setUserData: React.Dispatch<React.SetStateAction<User>>;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Define the UserProvider props to accept children
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<User>({
    email: '',
    name: '',
    address: '',
    phone: '',
    surname: '',
  });

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use UserContext
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
