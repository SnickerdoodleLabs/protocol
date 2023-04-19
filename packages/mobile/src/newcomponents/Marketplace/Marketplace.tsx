import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import Orientation from "react-native-orientation-locker";

export default function Marketplace() {
  React.useEffect(() => {
    Orientation.lockToPortrait(); // lock to portrait mode
  }, []);
  return (
    <SafeAreaView style={{ backgroundColor: 'rgba(9, 16, 29, 0.7)' }}>
      <Image
        style={{ width: "100%", height: "100%", marginTop: 10 }}
        source={require("../../assets/images/comingSoonMarketplace.png")}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
