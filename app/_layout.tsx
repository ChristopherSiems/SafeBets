import React, { useState } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { PortfolioProvider } from "../context/user-context";
import { BetsProvider } from "../context/bet-context";
import { BannerProvider } from "@/context/banner-context";

export default function AppLayout() {
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  return (
    <BannerProvider>
      <PortfolioProvider>
        <BetsProvider>
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: "#4CAF50",
              tabBarInactiveTintColor: "#999",
              tabBarStyle: { height: 60, paddingBottom: 6 },
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: "Home",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="home-outline" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="portfolio"
              options={{
                title: "Portfolio",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons
                    name="stats-chart-outline"
                    size={size}
                    color={color}
                  />
                ),
              }}
            />
          </Tabs>
        </BetsProvider>
      </PortfolioProvider>
    </BannerProvider>
  );
}
