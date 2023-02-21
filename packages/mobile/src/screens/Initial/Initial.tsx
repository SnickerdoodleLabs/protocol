import LottieView from "lottie-react-native";
import React, { useEffect, useMemo } from "react";
import { StyleSheet, Image, View, Dimensions } from "react-native";

import LoadingLottie from "../../assets/lotties/loading.json";

import { styles } from "./Initial.styles";

// Make all neccassary checks here

const Initial = ({ navigation }) => {
  const allChecksCompleted: boolean = useMemo(() => {
    return false;
  }, []);

  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Home");
    }, 3000);
  }, []);

  return (
    <View
      style={[
        {
          alignItems: "center",
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#222039",
        },
      ]}
    >
      <Image
        resizeMode={"cover"}
        source={require("../../assets/images/sd-horizontal.png")}
        style={{
          width: Dimensions.get("window").width * 0.8,
          marginTop: Dimensions.get("window").height * 0.3,
        }}
      />

      <LottieView source={LoadingLottie} autoPlay loop />
    </View>
  );
};

export default Initial;
