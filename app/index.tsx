import React from "react";
import { ScrollView, View } from "react-native";
import GameCard from "../components/game-card";
import TokenWidget from "../components/token-widget";
import { usePortfolio } from "../context/user-context";

export default function Home() {
  const { tokens } = usePortfolio();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 48 }} />
      <ScrollView contentContainerStyle={{ padding: 16, rowGap: 16 }}>
        <GameCard
          image={require("../assets/images/td_garden.jpg")}
          day="Mon"
          time="6PM"
          arena="TD Garden"
          teamLogoA={require("../assets/images/celtics.png")}
          teamLogoB={require("../assets/images/hawks.png")}
          oddsA={0.5}
          oddsB={0.5}
          teamA={"Celtics"}
          teamB={"Hawks"}
          gameId={"game1"}
        />
        <GameCard
          image={require("../assets/images/msg.jpg")}
          day="Tue"
          time="5PM"
          arena="Madison Square Garden"
          teamLogoA={require("../assets/images/knicks.png")}
          teamLogoB={require("../assets/images/mavericks.png")}
          oddsA={0.67}
          oddsB={0.33}
          teamA={"Knicks"}
          teamB={"Mavs"}
          gameId={"game2"}
        />
        <GameCard
          image={require("../assets/images/chase_center.jpg")}
          day="Wed"
          time="6PM"
          arena="Chase Center"
          teamLogoA={require("../assets/images/warriors.png")}
          teamLogoB={require("../assets/images/supersonics.png")}
          oddsA={0.78}
          oddsB={0.22}
          teamA={"Warriors"}
          teamB={"Sonics"}
          gameId={"game3"}
        />
        <GameCard
          image={require("../assets/images/td_garden.jpg")}
          day="Thu"
          time="5:30PM"
          arena="TD Garden"
          teamLogoA={require("../assets/images/celtics.png")}
          teamLogoB={require("../assets/images/mavericks.png")}
          oddsA={0.69}
          oddsB={0.31}
          teamA={"Celtics"}
          teamB={"Hawks"}
          gameId={"game4"}
        />
      </ScrollView>

      <TokenWidget tokens={tokens} />
    </View>
  );
}
