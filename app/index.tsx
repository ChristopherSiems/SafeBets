import React from "react";
import { ScrollView } from "react-native";
import GameCard from "../components/game-card";

export default function Home() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, rowGap: 16 }}>
      <GameCard
        image={require("../assets/images/td_garden.jpg")}
        day="Mon"
        time="6PM"
        arena="TD Garden"
        teamA={require("../assets/images/celtics.png")}
        teamB={require("../assets/images/hawks.png")}
      />
      <GameCard
        image={require("../assets/images/td_garden.jpg")}
        day="Mon"
        time="6PM"
        arena="TD Garden"
        teamA={require("../assets/images/celtics.png")}
        teamB={require("../assets/images/hawks.png")}
      />
      <GameCard
        image={require("../assets/images/td_garden.jpg")}
        day="Mon"
        time="6PM"
        arena="TD Garden"
        teamA={require("../assets/images/celtics.png")}
        teamB={require("../assets/images/hawks.png")}
      />
      <GameCard
        image={require("../assets/images/td_garden.jpg")}
        day="Mon"
        time="6PM"
        arena="TD Garden"
        teamA={require("../assets/images/celtics.png")}
        teamB={require("../assets/images/hawks.png")}
      />
      <GameCard
        image={require("../assets/images/td_garden.jpg")}
        day="Mon"
        time="6PM"
        arena="TD Garden"
        teamA={require("../assets/images/celtics.png")}
        teamB={require("../assets/images/hawks.png")}
      />
      <GameCard
        image={require("../assets/images/td_garden.jpg")}
        day="Mon"
        time="6PM"
        arena="TD Garden"
        teamA={require("../assets/images/celtics.png")}
        teamB={require("../assets/images/hawks.png")}
      />
      <GameCard
        image={require("../assets/images/td_garden.jpg")}
        day="Mon"
        time="6PM"
        arena="TD Garden"
        teamA={require("../assets/images/celtics.png")}
        teamB={require("../assets/images/hawks.png")}
      />
      <GameCard
        image={require("../assets/images/td_garden.jpg")}
        day="Mon"
        time="6PM"
        arena="TD Garden"
        teamA={require("../assets/images/celtics.png")}
        teamB={require("../assets/images/hawks.png")}
      />
      <GameCard
        image={require("../assets/images/td_garden.jpg")}
        day="Mon"
        time="6PM"
        arena="TD Garden"
        teamA={require("../assets/images/celtics.png")}
        teamB={require("../assets/images/hawks.png")}
      />
    </ScrollView>
  );
}
