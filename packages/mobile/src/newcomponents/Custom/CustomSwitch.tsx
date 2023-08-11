import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { normalizeHeight, normalizeWidth } from "../../themes/Metrics";

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  value,
  onValueChange,
}) => {
  const backgroundColor = value ? "#6E62A6" : "#ccc";
  const circlePosition = value
    ? { right: normalizeWidth(2),top:normalizeHeight(2) }
    : { left: normalizeWidth(2),top:normalizeHeight(2) };

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
    width: normalizeWidth(40),
    height: normalizeHeight(24),
    borderRadius: 100,
    paddingVertical: normalizeHeight(2),
    paddingHorizontal: normalizeWidth(2),
  },
  circle: {
    width: normalizeWidth(20),
    height: normalizeHeight(20),
    borderRadius: 100,
    backgroundColor: "white",
    position: "absolute",
  },
});

export default CustomSwitch;
