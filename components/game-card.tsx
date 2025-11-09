import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useBets } from "../context/bet-context";
import { usePortfolio } from "../context/user-context";
import DevActions from "./dev-actions";
import { useBanner } from "@/context/banner-context";

type GameCardProps = {
  gameId: string;
  image: ImageSourcePropType;
  teamLogoA: ImageSourcePropType;
  teamLogoB: ImageSourcePropType;
  oddsA: number;
  oddsB: number;
  day: string;
  time: string;
  arena: string;
  teamA: string;
  teamB: string;
};

const STYLE = StyleSheet.create({
  card: { borderRadius: 12, overflow: "hidden", padding: 16 },
  image: { borderRadius: 12 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
  },
  topRow: { flexDirection: "row", justifyContent: "space-between", margin: 4 },
  text: { color: "#fff", fontSize: 18, fontWeight: "700" },
  teamsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 12,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  betSummary: {
    marginTop: 12,
    padding: 8,
    backgroundColor: "#333",
    borderRadius: 12,
    alignItems: "center",
  },
  betText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});

export default function GameCard({
  gameId,
  image,
  day,
  time,
  arena,
  teamLogoA,
  teamLogoB,
  oddsA,
  oddsB,
  teamA,
  teamB,
}: GameCardProps) {
  const [width, setWidth] = useState(0);
  const [activeButton, setActiveButton] = useState<"A" | "B" | null>(null);
  const [betAmount, setBetAmount] = useState("");
  const { tokens, setTokens } = usePortfolio();
  const { bets, games, placeBet, refundBet, resolveBet } = useBets();
  const userBet = bets[gameId];
  const gameState = games[gameId]?.state || "open";

  if (gameState == "resolved") return null;

  const isClosed = gameState === "closed";

  const handleSubmit = (team: "A" | "B") => {
    if (isClosed) return;

    const amount = parseFloat(betAmount);

    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Invalid bet", "Please enter a number greater than 0.");
      setActiveButton(null);
      setBetAmount("");
      return;
    }

    if (amount > tokens) {
      Alert.alert(
        "Not enough tokens",
        `You only have ${tokens} tokens available.`,
      );
      setActiveButton(null);
      setBetAmount("");
      return;
    }

    const odds = team === "A" ? oddsA : oddsB;
    setTokens(tokens - amount);
    placeBet(gameId, team, amount, odds);

    setBetAmount("");
    setActiveButton(null);
  };

  const handlePressButton = (team: "A" | "B") => {
    if (userBet || isClosed) return;
    setActiveButton(team);
    setBetAmount("");
  };

  const handleRefund = () => {
    if (!userBet || isClosed) return;

    Alert.alert("Refund Bet", `Refund ${userBet.amount} tokens?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Refund",
        onPress: () =>
          refundBet(gameId, (amount) => setTokens(tokens + amount)),
        style: "destructive",
      },
    ]);
  };

  return (
    <ImageBackground
      source={image}
      style={STYLE.card}
      imageStyle={STYLE.image}
      resizeMode="cover"
      onLayout={(event: LayoutChangeEvent) =>
        setWidth(event.nativeEvent.layout.width * 0.33)
      }
    >
      <View style={STYLE.overlay} />
      {__DEV__ && (
        <DevActions
          gameId={gameId}
          teamA={teamA}
          teamB={teamB}
          arena={arena}
          oddsA={oddsA}
          userBet={userBet}
          tokens={tokens}
          setTokens={setTokens}
          isClosed={isClosed}
        />
      )}
      <View style={STYLE.topRow}>
        <Text style={STYLE.text}>
          {isClosed ? "Right Now!" : `${day} @ ${time}`}
        </Text>
        <Text style={STYLE.text}>{arena}</Text>
      </View>

      <View style={STYLE.teamsRow}>
        <Image
          source={teamLogoA}
          style={{ width, height: width }}
          resizeMode="contain"
        />
        <Text style={STYLE.text}>VS</Text>
        <Image
          source={teamLogoB}
          style={{ width, height: width }}
          resizeMode="contain"
        />
      </View>

      {userBet ? (
        <TouchableOpacity
          style={STYLE.betSummary}
          onPress={handleRefund}
          disabled={isClosed}
        >
          <Text style={STYLE.betText}>
            {isClosed ? "🔒 " : ""}
            {userBet.amount} tokens for {{ A: teamA, B: teamB }[userBet.team]} @{" "}
            {userBet.odds * 100}%
          </Text>
        </TouchableOpacity>
      ) : (
        !isClosed && (
          <View style={STYLE.buttonRow}>
            {activeButton === "A" ? (
              <TextInput
                style={STYLE.input}
                placeholder="Enter bet"
                keyboardType="numeric"
                value={betAmount}
                onChangeText={setBetAmount}
                onBlur={() => handleSubmit("A")}
                autoFocus
              />
            ) : (
              <TouchableOpacity
                style={STYLE.button}
                onPress={() => handlePressButton("A")}
              >
                <Text style={STYLE.buttonText}>
                  Buy {teamA} @ {oddsA * 100}%
                </Text>
              </TouchableOpacity>
            )}

            {activeButton === "B" ? (
              <TextInput
                style={STYLE.input}
                placeholder="Enter bet"
                keyboardType="numeric"
                value={betAmount}
                onChangeText={setBetAmount}
                onBlur={() => handleSubmit("B")}
                autoFocus
              />
            ) : (
              <TouchableOpacity
                style={STYLE.button}
                onPress={() => handlePressButton("B")}
              >
                <Text style={STYLE.buttonText}>
                  Buy {teamB} @ {oddsB * 100}%
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )
      )}
    </ImageBackground>
  );
}
