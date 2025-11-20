import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import { usePortfolio } from "../context/user-context";

type PortfolioPositionProps = {
  symbol: string;
  shares: number;
};

type QuoteResponse = {
  price: number;
  previous_close?: number;
  symbol: string;
};

export default function PortfolioPosition({
  symbol,
  shares,
}: PortfolioPositionProps) {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sellAmount, setSellAmount] = useState("");

  const { removeShares } = usePortfolio();

  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch(`http://140.232.181.109:8000/quote/${symbol}`);
        const data: QuoteResponse = await res.json();
        if (!data?.price) throw new Error("Invalid API response");
        setPrice(data.price);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch price");
      } finally {
        setLoading(false);
      }
    }

    fetchPrice();
  }, [symbol]);

  const handleSell = (amountUSD: number) => {
    if (!price) return;

    const sharesToSell = amountUSD / price;
    if (sharesToSell > shares) {
      Alert.alert("Not enough shares", "You don't own enough shares to sell.");
      return;
    }

    removeShares(symbol, sharesToSell);
    Alert.alert("Sale complete", `Sold $${amountUSD.toFixed(2)} of ${symbol}.`);
  };

  const promptSell = () => {
    if (Platform.OS === "ios") {
      Alert.prompt(
        `Sell ${symbol}`,
        "Enter dollar amount to sell:",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Sell",
            onPress: (value) => {
              const amount = parseFloat(value || "0");
              if (amount > 0) handleSell(amount);
            },
          },
        ],
        "plain-text",
      );
    } else {
      // Android: use modal input
      setModalVisible(true);
    }
  };

  const totalValue = price ? shares * price : 0;

  if (loading) return <ActivityIndicator size="large" color="#4CAF50" />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.card}>
      <Text style={styles.symbol}>{symbol}</Text>
      <Text style={styles.info}>
        Shares owned: {Math.round(shares * 1000) / 1000}
      </Text>
      <Text style={styles.info}>Current price: ${price.toFixed(2)}</Text>
      <Text style={styles.total}>Total value: ${totalValue.toFixed(2)}</Text>

      <TouchableOpacity style={styles.sellButton} onPress={promptSell}>
        <Text style={styles.sellText}>Sell $</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Sell {symbol}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount in USD"
              keyboardType="numeric"
              value={sellAmount}
              onChangeText={setSellAmount}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#E53935" }]}
                onPress={() => {
                  const amount = parseFloat(sellAmount || "0");
                  if (amount > 0) handleSell(amount);
                  setSellAmount("");
                  setModalVisible(false);
                }}
              >
                <Text style={{ color: "#fff" }}>Sell</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1F3B2D",
    padding: 16,
    borderRadius: 12,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  symbol: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  info: {
    fontSize: 18,
    color: "#C8FACC",
    marginBottom: 4,
  },
  total: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4CAF50",
    marginTop: 8,
  },
  sellButton: {
    backgroundColor: "#E53935",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
  sellText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  error: {
    color: "red",
    fontSize: 16,
    margin: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
});
