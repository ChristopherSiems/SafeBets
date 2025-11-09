import React, { createContext, useContext, useState, ReactNode } from "react";
import { Text, View } from "react-native";

type BannerContextType = {
  showBanner: (message: string, duration?: number) => void;
};

const BannerContext = createContext<BannerContextType | null>(null);

export const useBanner = () => {
  const context = useContext(BannerContext);
  if (!context) throw new Error("useBanner must be used within BannerProvider");
  return context;
};

export const BannerProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);

  const showBanner = (msg: string, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), duration);
  };

  return (
    <BannerContext.Provider value={{ showBanner }}>
      {children}
      {message && (
        <View
          style={{
            position: "absolute",
            top: 50,
            left: 0,
            right: 0,
            padding: 16,
            backgroundColor: "orange",
            zIndex: 1000,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>{message}</Text>
        </View>
      )}
    </BannerContext.Provider>
  );
};
