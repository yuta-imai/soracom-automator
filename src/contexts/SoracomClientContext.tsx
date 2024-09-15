// src/contexts/SoracomClientContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { SoracomClient } from '../services/SoracomClient';

interface SoracomClientContextType {
  client: SoracomClient | null;
  setClient: React.Dispatch<React.SetStateAction<SoracomClient | null>>;
}

const SoracomClientContext = createContext<SoracomClientContextType | undefined>(undefined);

export const SoracomClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<SoracomClient | null>(null);

  return (
    <SoracomClientContext.Provider value={{ client, setClient }}>
      {children}
    </SoracomClientContext.Provider>
  );
};

export const useSoracomClient = (): SoracomClientContextType => {
  const context = useContext(SoracomClientContext);
  if (!context) {
    throw new Error('useSoracomClient must be used within a SoracomClientProvider');
  }
  return context;
};
