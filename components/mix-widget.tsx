import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { usePortfolio } from "../context/user-context";

// Define available assets for selection
const AVAILABLE_ASSETS = ["SPY", "TLT", "QQQ", "BND", "GLD"];

export default function AssetMixWidget({ size }: { size?: number }) {
  const { portfolio, addShares, removeShares, mix, setMix } = usePortfolio();

  // Modal visibility
  const [modalVisible, setModalVisible] = useState(false);

  //  // Mix state: tracks assets currently in the mix
  //  const [mix, setMix] = useState<string[]>([]);
  //
  //  // Initialize mix from portfolio keys on mount
  //  useEffect(() => {
  //    setMix(Object.keys(portfolio));
  //  }, [portfolio]);

  const toggleAsset = (symbol: string) => {
    if (mix.includes(symbol)) {
      // Remove from mix
      setMix(mix.filter((s) => s !== symbol));

      // Remove from portfolio if shares = 0
      if ((portfolio[symbol] || 0) === 0) {
        removeShares(symbol, 0, true);
      }
    } else {
      // Add to mix
      const mix2 = mix.slice();
      mix2.push(symbol);
      setMix(mix2);
      console.log(mix);

      // Add placeholder to portfolio if it doesn't exist
      if (!(symbol in portfolio)) {
        addShares(symbol, 0);
      }
    }
  };

  // Split assets for rendering
  const includedAssets = mix;
  const excludedAssets = AVAILABLE_ASSETS.filter(
    (symbol) => !mix.includes(symbol),
  );

  return (
    <>
      {/* Floating button bottom-left */}
      <View style={styles.wrapper}>
        <TouchableOpacity
          style={[
            styles.container,
            size ? { width: size, height: size, borderRadius: size / 2 } : {},
          ]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.text}>Asset Mix</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            {/* Top half: included assets */}
            <View style={styles.half}>
              <Text style={styles.halfTitle}>Included Assets</Text>
              <ScrollView
                horizontal
                contentContainerStyle={styles.assetContainer}
              >
                {includedAssets.length > 0 ? (
                  includedAssets.map((symbol) => (
                    <TouchableOpacity
                      key={symbol}
                      style={[styles.assetBox, { backgroundColor: "#4CAF50" }]}
                      onPress={() => toggleAsset(symbol)}
                    >
                      <Text style={styles.assetText}>{symbol}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.emptyText}>None</Text>
                )}
              </ScrollView>
            </View>

            {/* Bottom half: excluded assets */}
            <View style={styles.half}>
              <Text style={styles.halfTitle}>Excluded Assets</Text>
              <ScrollView
                horizontal
                contentContainerStyle={styles.assetContainer}
              >
                {excludedAssets.length > 0 ? (
                  excludedAssets.map((symbol) => (
                    <TouchableOpacity
                      key={symbol}
                      style={[styles.assetBox, { backgroundColor: "#888" }]}
                      onPress={() => toggleAsset(symbol)}
                    >
                      <Text style={styles.assetText}>{symbol}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.emptyText}>None</Text>
                )}
              </ScrollView>
            </View>

            {/* Close button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: "absolute", bottom: 24, left: 24 },
  container: {
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  text: { color: "#fff", fontWeight: "700", fontSize: 16 },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: Dimensions.get("window").width - 32,
    height: Dimensions.get("window").height * 0.6,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  half: { flex: 1, padding: 16 },
  halfTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  assetContainer: { flexDirection: "row", alignItems: "center" },
  assetBox: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 12,
  },
  assetText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  emptyText: { fontSize: 16, color: "#888" },
  closeButton: {
    paddingVertical: 12,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
