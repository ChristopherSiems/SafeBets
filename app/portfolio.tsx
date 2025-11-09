import React, { useState, useCallback } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  RefreshControl,
} from "react-native";
import PortfolioPosition from "../components/position";
import { usePortfolio } from "../context/user-context";
import AssetMixWidget from "@/components/mix-widget";

export default function PortfolioPage() {
  const { portfolio, mix } = usePortfolio();
  const tickers = Object.keys(portfolio);

  // Refresh state
  const [refreshing, setRefreshing] = useState(false);

  // Callback for pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // If you want to simulate a refresh delay
    setTimeout(() => {
      setRefreshing(false);
      // Optionally, here you can reload any data, call context functions, etc.
    }, 500);
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ height: 48 }} />

      {tickers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Your portfolio is empty. Buy tokens to start investing!
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {tickers
            .filter(
              (symbol) => mix.includes(symbol) || (portfolio[symbol] || 0) > 0,
            )
            .map((symbol) => (
              <PortfolioPosition
                key={symbol}
                symbol={symbol}
                shares={portfolio[symbol]}
              />
            ))}
        </ScrollView>
      )}
      <AssetMixWidget />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    color: "black",
    textAlign: "center",
  },
});
