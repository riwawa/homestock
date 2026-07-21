// modules/house/context/CurrentHouseContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

const STORAGE_KEY = "homestock:currentHouseId";

type CurrentHouseContextValue = {
  currentHouseId: string | null;
  setCurrentHouseId: (id: string) => void;
  clearCurrentHouse: () => void;
};

const CurrentHouseContext = createContext<CurrentHouseContextValue | undefined>(
  undefined
);

export function CurrentHouseProvider({ children }: { children: ReactNode }) {
  const [currentHouseId, setCurrentHouseIdState] = useState<string | null>(
    () => localStorage.getItem(STORAGE_KEY)
  );

  useEffect(() => {
    if (currentHouseId) {
      localStorage.setItem(STORAGE_KEY, currentHouseId);
    }
  }, [currentHouseId]);

  const setCurrentHouseId = (id: string) => setCurrentHouseIdState(id);

  const clearCurrentHouse = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentHouseIdState(null);
  };

  return (
    <CurrentHouseContext.Provider
      value={{ currentHouseId, setCurrentHouseId, clearCurrentHouse }}
    >
      {children}
    </CurrentHouseContext.Provider>
  );
}

export function useCurrentHouse() {
  const context = useContext(CurrentHouseContext);
  if (!context) {
    throw new Error("useCurrentHouse precisa estar dentro de CurrentHouseProvider");
  }
  return context;
}