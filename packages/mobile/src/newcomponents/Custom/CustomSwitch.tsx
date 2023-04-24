import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  value,
  onValueChange,
}) => {
  const backgroundColor = value ? "#6E62A6" : "#ccc";
  const circlePosition = value ? { right: 0.5 } : { left: 1.5 };

  const handlePress = () => {
    onValueChange(!value);
  };

  return (
    <TouchableOpacity
      style={[styles.switchContainer, { backgroundColor }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={[styles.circle, circlePosition]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: 40,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  circle: {
    width: 20,
    height: 23,
    borderRadius: 10,
    backgroundColor: "white",
    position: "absolute",
  },
});

export default CustomSwitch;
