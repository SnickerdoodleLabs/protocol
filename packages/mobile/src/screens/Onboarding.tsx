import * as React from "react";
import {
  StatusBar,
  Animated,
  Text,
  Image,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AppCtx } from "../context/AppContextProvider";

export default function Onboarding(props: any) {
  const { navigation } = props;
  const { coreContext } = React.useContext(AppCtx);
  const { width, height } = Dimensions.get("screen");
  const scrollX = React.useRef(new Animated.Value(0)).current;

  // https://www.flaticon.com/packs/retro-wave
  // inspiration: https://dribbble.com/shots/11164698-Onboarding-screens-animation
  // https://twitter.com/mironcatalin/status/1321180191935373312

  const bgs = ["#A5BBFF", "#DDBEFE", "#FF63ED", "#B98EFF"];
  const DATA = [
    {
      key: "3571572",
      title: "Multi-lateral intermediate moratorium",
      description:
        "I'll back up the multi-byte XSS matrix, that should feed the SCSI application!",
      image: "https://pngimg.com/d/lion_king_PNG18.png",
    },
    {
      key: "3571747",
      title: "Automated radical data-warehouse",
      description:
        "Use the optical SAS system, then you can navigate the auxiliary alarm!",
      image: "https://pngimg.com/d/lion_king_PNG18.png",
    },
    {
      key: "3571680",
      title: "Inverse attitude-oriented system engine",
      description:
        "The ADP array is down, compress the online sensor so we can input the HTTP panel!",
      image: "https://pngimg.com/d/lion_king_PNG18.png",
    },
    {
      key: "3571603",
      title: "Monitored global data-warehouse",
      description: "We need to program the open-source IB interface!",
      image: "https://pngimg.com/d/lion_king_PNG18.png",
    },
  ];

  const Indicator = ({ scrollX }) => {
    return (
      <View
        style={{
          position: "absolute",
          bottom: 100,
          flexDirection: "row",
        }}
      >
        {DATA.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.4, 0.8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.6, 0.9, 0.6],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={`indicator-${i}`}
              style={{
                height: 10,
                width: 10,
                borderRadius: 5,
                backgroundColor: "#333",
                margin: 10,
                opacity,
                transform: [{ scale }],
              }}
            />
          );
        })}
      </View>
    );
  };

  const Backdrop = ({ scrollX }) => {
    const backgroundColor = scrollX.interpolate({
      inputRange: bgs.map((_, i) => i * width),
      outputRange: bgs.map((bg) => bg),
    });
    return (
      <Animated.View
        style={[StyleSheet.absoluteFillObject, { backgroundColor }]}
      />
    );
  };

  const Square = ({ scrollX }) => {
    const YOLO = Animated.modulo(
      Animated.divide(
        Animated.modulo(scrollX, width),
        new Animated.Value(width),
      ),
      1,
    );

    const rotate = YOLO.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ["20deg", "-12deg", "27deg"],
    });
    const translateX = YOLO.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, -height, 0],
    });

    return (
      <Animated.View
        style={{
          width: height,
          height: height,
          backgroundColor: "#fff",
          borderRadius: 86,
          position: "absolute",
          top: -height * 0.5,
          left: -height * 0.3,
          transform: [{ rotate }, { translateX }],
        }}
      />
    );
  };

  return (
    <>
      <View style={styles.container}>
        <StatusBar hidden />
        <Backdrop scrollX={scrollX} />
        <Square scrollX={scrollX} />
        <Animated.FlatList
          data={DATA}
          keyExtractor={(item) => item.key}
          horizontal
          scrollEventThrottle={32}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false },
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  width,
                  height,
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 20,
                }}
              >
                <View
                  style={{
                    flex: 0.7,
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={{
                      width: width / 2,
                      height: width / 2,
                      resizeMode: "contain",
                    }}
                  />
                  <View style={{ flex: 0.3 }}>
                    <Text
                      style={{
                        fontWeight: "800",
                        fontSize: 24,
                        marginBottom: 10,
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text style={{ fontWeight: "300" }}>
                      {item.description}
                    </Text>
                  </View>
                </View>
                <Indicator scrollX={scrollX} />
              </View>
            );
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
