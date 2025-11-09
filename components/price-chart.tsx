import React, { useEffect, useState } from "react";
import { View, Dimensions, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-chart-kit";

type PriceChartProps = {
  symbol?: string; // default to S&P 500
};

const screenWidth = Dimensions.get("window").width;

export default function PriceChart({ symbol = "^GSPC" }: PriceChartProps) {
  const [prices, setPrices] = useState<number[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `https://yh-finance.p.rapidapi.com/stock/v3/get-historical-data?symbol=${symbol}&region=US`,
          {
            method: "GET",
            headers: {
              "X-RapidAPI-Key":
                "a56d448039msh682a42b98c57c3cp1be983jsn15fa9cf2870c",
              "X-RapidAPI-Host": "yh-finance.p.rapidapi.com",
            },
          },
        );
        const data = await res.json();

        const history = data.prices.slice(-30).reverse(); // last 30 days
        setPrices(history.map((h: any) => h.close));
        setDates(
          history.map((h: any) => new Date(h.date * 1000).toLocaleDateString()),
        );
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    fetchData();
  }, [symbol]);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      <LineChart
        data={{
          labels: dates,
          datasets: [{ data: prices }],
        }}
        width={screenWidth - 32} // padding
        height={220}
        chartConfig={{
          backgroundColor: "#1E2923",
          backgroundGradientFrom: "#08130D",
          backgroundGradientTo: "#1F3B2D",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        bezier
        style={{ borderRadius: 12 }}
      />
    </View>
  );
}
