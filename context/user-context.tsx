import React, { createContext, useContext, useState, ReactNode } from "react";

// Define all available assets
export const AVAILABLE_ASSETS = ["SPY", "TLT", "QQQ", "BND", "GLD"];

// Portfolio map: ticker → shares
type Portfolio = Record<string, number>;

// User context type
type PortfolioContextType = {
  tokens: number;
  setTokens: (tokens: number) => void;
  portfolio: Portfolio;
  addShares: (symbol: string, amount: number) => void;
  removeShares: (symbol: string, amount: number) => void;
  mix: string[]; // user-selected asset mix
  setMix: (mix: string[]) => void;
  divvyFunds: (dollars: number) => void; // split funds evenly across mix
};

type QuoteResponse = {
  price: number;
  previous_close?: number;
  symbol: string;
};

// Create context
const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined,
);

// Hook to access entire portfolio context
export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};

// Hook to access only the mix
export const useMix = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("useMix must be used within a PortfolioProvider");
  }
  return { mix: context.mix, setMix: context.setMix };
};

type PortfolioProviderProps = { children: ReactNode };

// Provider component
export const PortfolioProvider = ({ children }: PortfolioProviderProps) => {
  // Initialize portfolio with all assets, 0 shares
  const initialPortfolio: Portfolio = AVAILABLE_ASSETS.reduce((acc, symbol) => {
    acc[symbol] = 0;
    return acc;
  }, {} as Portfolio);

  const [tokens, setTokens] = useState(0);
  const [portfolio, setPortfolio] = useState<Portfolio>(initialPortfolio);

  // Mix starts with SPY
  const [mix, setMix] = useState<string[]>(["SPY"]);

  // Add shares to an asset
  const addShares = (symbol: string, amount: number) => {
    setPortfolio((prev) => ({
      ...prev,
      [symbol]: (prev[symbol] || 0) + amount,
    }));
  };

  // Remove shares from an asset
  const removeShares = (symbol: string, amount: number) => {
    setPortfolio((prev) => {
      const updated = Math.max((prev[symbol] || 0) - amount, 0);
      const copy = { ...prev, [symbol]: updated };
      return copy;
    });
  };

  const divvyFunds = async (dollars: number) => {
    if (mix.length === 0) return;

    const dollarsPerAsset = Math.floor((dollars * 100) / mix.length) / 100;

    for (const symbol of mix) {
      try {
        const res = await fetch(`http://140.232.181.109:8000/quote/${symbol}`);
        const data = await res.json();
        if (!data?.price) throw new Error(`Invalid quote for ${symbol}`);
        const price = data.price;
        const sharesToAdd = dollarsPerAsset / price;
        addShares(symbol, sharesToAdd);
      } catch (err) {
        console.error(`Failed to fetch quote for ${symbol}:`, err);
      }
    }

    // Optionally update tokens here if desired
    setTokens((prev) => prev + dollars * 100);
  };

  return (
    <PortfolioContext.Provider
      value={{
        tokens,
        setTokens,
        portfolio,
        addShares,
        removeShares,
        mix,
        setMix,
        divvyFunds,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
