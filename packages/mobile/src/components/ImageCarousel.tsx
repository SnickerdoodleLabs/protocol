import { View, Image, Dimensions, StyleSheet, Animated } from "react-native";
import React from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
export type ParamList = {
  Params: {
    userID: string;
    NFTs: string[];
  };
};

const ImageCarousel = () => {
  const route = useRoute<RouteProp<ParamList, "Params">>();
  const myNFTs = route.params?.NFTs;
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get("screen");
  const imageW = width * 0.8;
  const imageH = height * 0.5;
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={StyleSheet.absoluteFillObject}>
        {myNFTs.map((item, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
          });
          return (
            <Animated.Image
              key={`image-${index}`}
              source={{ uri: item }}
              style={[StyleSheet.absoluteFillObject, { opacity }]}
              blurRadius={50}
            />
          );
        })}
      </View>
      <Animated.FlatList
        data={myNFTs}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        renderItem={({ item }) => {
          return (
            <View
              style={{
                width,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowRadius: 20,
              }}
            >
              <Image
                source={{
                  uri: item,
                }}
                style={{
                  width: imageW,
                  height: imageH,
                  resizeMode: "cover",
                  borderRadius: 16,
                }}
              />
            </View>
          );
        }}
      />
    </View>
  );
};

export default ImageCarousel;
