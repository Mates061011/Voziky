import React, { createContext, useState, useEffect, useContext } from 'react';

type ItemData = {
  _id: string;
  name: string;
  desc: string;
  pricePerDay: number;
  pricePerDays: number;
  type: string;
  img: string;
  kauce: string;
  __v: number;
};

type ItemContextType = {
  items: ItemData[] | [];
  loading: boolean;
  error: string | null;
  fetchItems: () => void;
};

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export const ItemProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [items, setItems] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    fetch(`${apiUrl}/api/items`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Chyba v načítání položek.');
        }
        return response.json();
      })
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <ItemContext.Provider value={{ items, loading, error, fetchItems }}>
      {children}
    </ItemContext.Provider>
  );
};

// Custom hook to use the context
export const useItemContext = (): ItemContextType => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error('useItemContext must be used within an ItemProvider');
  }
  return context;
};
