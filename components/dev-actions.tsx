import React from "react";
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useBets } from "../context/bet-context";
import { useBanner } from "@/context/banner-context";

type DevActionsProps = {
  gameId: string;
  teamA: string;
  teamB: string;
  arena: string;
  oddsA: number;
  userBet?: { team: "A" | "B"; amount: number; odds: number } | null;
  tokens: number;
  setTokens: (val: number) => void;
  isClosed: boolean;
};

export default function DevActions({
  gameId,
  teamA,
  teamB,
  arena,
  oddsA,
  userBet,
  tokens,
  setTokens,
  isClosed,
}: DevActionsProps) {
  const { closeBetting, resolveBet } = useBets();
  const { showBanner } = useBanner();

  const handleCloseBetting = () => {
    Alert.alert("Close Betting", `Close betting for game ${gameId}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Close",
        style: "destructive",
        onPress: () => {
          closeBetting(gameId);
          showBanner(`${teamA} vs ${teamB} right now @ ${arena}!`);
        },
      },
    ]);
  };

  const handleResolveGame = () => {
    const winner = Math.random() < oddsA ? "A" : "B";

    resolveBet(gameId, winner);

    if (userBet) {
      const teamName = userBet.team === "A" ? teamA : teamB;

      if (userBet.team === winner) {
        const payout = Math.round(userBet.amount * (1 / userBet.odds));
        setTokens(tokens + payout);
        showBanner(`${payout} tokens won on ${teamName}!`);
      } else {
        showBanner(`${userBet.amount} tokens lost on ${teamName}`);
      }
    }
  };

  return (
    <View style={STYLE.container}>
      {__DEV__ && !isClosed && (
        <TouchableOpacity style={STYLE.button} onPress={handleCloseBetting} />
      )}

      {__DEV__ && isClosed && (
        <TouchableOpacity
          style={[STYLE.button, STYLE.resolve]}
          onPress={handleResolveGame}
        />
      )}
    </View>
  );
}

const STYLE = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 60,
    right: 20,
    zIndex: 1000,
    gap: 10,
  },
  button: {
    backgroundColor: "#FF5722",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 3,
  },
  resolve: {
    backgroundColor: "#2196F3",
  },
});
