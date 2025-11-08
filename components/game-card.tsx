import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from "react-native";

type GameCardProps = {
  day: string;
  time: string;
  arena: string;
  image: ImageSourcePropType;
  teamA: ImageSourcePropType;
  teamB: ImageSourcePropType;
};

const STYLE = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
    padding: 16,
  },
  image: {
    borderRadius: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 4,
    marginRight: 4,
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 700,
  },
  body: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});

export default function GameCard({
  image,
  day,
  time,
  arena,
  teamA,
  teamB,
}: GameCardProps) {
  const [width, setWidth] = useState(0);

  return (
    <ImageBackground
      source={image}
      style={STYLE.card}
      imageStyle={STYLE.image}
      resizeMode="cover"
      onLayout={(event: LayoutChangeEvent) => {
        setWidth(event.nativeEvent.layout.width * 0.33);
      }}
    >
      <View style={STYLE.overlay} />
      <View style={STYLE.topRow}>
        <Text style={STYLE.text}>
          {day} @ {time}
        </Text>
        <Text style={STYLE.text}>{arena}</Text>
      </View>
      <View style={STYLE.body}>
        <Image
          source={teamA}
          style={{ width: width, height: width }}
          resizeMode="contain"
        />
        <Text style={STYLE.text}>VS</Text>
        <Image
          source={teamB}
          style={{ width: width, height: width }}
          resizeMode="contain"
        />
      </View>
    </ImageBackground>
  );
}
