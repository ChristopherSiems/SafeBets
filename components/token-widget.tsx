import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import { usePortfolio } from "../context/user-context";

export default function TokenWidget({ size }: { size?: number }) {
  const { tokens, divvyFunds, setTokens } = usePortfolio();

  const [showDeposit, setShowDeposit] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const dollars = Math.round(parseFloat(amount) * 100) / 100;
    if (isNaN(dollars) || dollars <= 0) {
      setAmount("");
      setShowDeposit(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      divvyFunds(dollars);
    } catch (err: any) {
      console.error("Deposit error:", err);
      setError(err.message || "Failed to deposit funds");
    } finally {
      setLoading(false);
      setAmount("");
      setShowDeposit(false);
    }
  };

  return (
    <>
      {showDeposit && (
        <View style={styles.overlay}>
          <View style={styles.depositBox}>
            <Text style={styles.depositTitle}>Deposit Money</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount ($)"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              onSubmitEditing={handleSubmit}
              autoFocus
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitText}>
                {loading ? "Depositing…" : "Deposit"}
              </Text>
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowDeposit(false);
                setAmount("");
                setError(null);
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.wrapper}>
        <TouchableOpacity
          style={[
            styles.container,
            size ? { width: size, height: size, borderRadius: size / 2 } : {},
          ]}
          onPress={() => setShowDeposit(true)}
        >
          <Text style={styles.text}>{tokens.toFixed(0)} Tokens</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: "absolute", bottom: 24, right: 24 },
  container: {
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  text: { color: "#fff", fontWeight: "700", fontSize: 16 },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  depositBox: {
    width: 250,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  depositTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: "100%",
    marginBottom: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: "100%",
    alignItems: "center",
  },
  cancelText: { color: "#4CAF50", fontWeight: "700", fontSize: 16 },
  errorText: { color: "red", fontSize: 14, marginTop: 8 },
});
