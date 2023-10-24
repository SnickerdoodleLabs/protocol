import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  value,
  onValueChange,
}) => {
  const backgroundColor = value ? "#rgba(37, 40, 45, 1)" : "#ccc";
  const circlePosition = value ? { right: -2, top: -2 } : { left: -2, top: -2 };

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
    height: 19,
    borderRadius: 100,
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 100,
    backgroundColor: "rgba(250, 250, 250, 1)",
    boxShadowColor: "rgba(0, 0, 0, 0.14)",
    boxShadowOffset: { width: 3, height: 3 },
    position: "absolute",
  },
});

export default CustomSwitch;
