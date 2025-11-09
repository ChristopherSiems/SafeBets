import React, { createContext, useContext, useState, ReactNode } from "react";

export type GameState = "open" | "closed" | "resolved";

export type UserBet = {
  team: "A" | "B";
  amount: number;
  odds: number;
  state: GameState;
};

type GameInfo = {
  state: GameState; // "open" | "closed" | "resolved"
};

const BetsContext = createContext<BetsContextType | null>(null);

export const useBets = () => {
  const context = useContext(BetsContext);
  if (!context) {
    throw new Error("useBets must be used within a BetsProvider");
  }
  return context;
};

type BetsContextType = {
  bets: Record<string, UserBet | null>;
  games: Record<string, GameInfo>; // <-- add this
  placeBet: (
    gameId: string,
    team: "A" | "B",
    amount: number,
    odds: number,
  ) => void;
  closeBetting: (gameId: string) => void;
  resolveBet: (gameId: string, winner: "A" | "B") => void;
  refundBet: (gameId: string, refundTokens: (amount: number) => void) => void;
};

export const BetsProvider = ({ children }: { children: ReactNode }) => {
  const [bets, setBets] = useState<Record<string, UserBet | null>>({});
  const [games, setGames] = useState<Record<string, GameInfo>>({});

  const placeBet = (
    gameId: string,
    team: "A" | "B",
    amount: number,
    odds: number,
  ) => {
    setBets((prev) => ({
      ...prev,
      [gameId]: { team, amount, odds, state: "open" },
    }));
  };

  const closeBetting = (gameId: string) => {
    setGames((prev) => ({ ...prev, [gameId]: { state: "closed" } }));
  };

  const resolveBet = (gameId: string, winner: "A" | "B") => {
    setGames((prev) => ({ ...prev, [gameId]: { state: "resolved" } }));
  };

  const refundBet = (
    gameId: string,
    refundTokens: (amount: number) => void,
  ) => {
    const bet = bets[gameId];
    if (!bet || games[gameId]?.state === "closed") return;
    refundTokens(bet.amount);
    setBets((prev) => {
      const copy = { ...prev };
      delete copy[gameId];
      return copy;
    });
  };

  return (
    <BetsContext.Provider
      value={{ bets, games, placeBet, closeBetting, resolveBet, refundBet }}
    >
      {children}
    </BetsContext.Provider>
  );
};
