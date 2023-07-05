import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { normalizeHeight, normalizeWidth } from "../../themes/Metrics";

const MultiSelectOption = ({
  value,
  label,
  image,
  selected,
  onSelect,
  onDeselect,
}) => {
  const handlePress = () => {
    if (selected) {
      onDeselect(value);
    } else {
      onSelect(value);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.option}>
      <View
        style={[
          selected
            ? {
                width: normalizeWidth(28),
                height: normalizeHeight(28),
                borderWidth: 1,
                backgroundColor: "#6E62A6",
                borderColor: "#6E62A6",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: normalizeWidth(8),
              }
            : {
                width: normalizeWidth(28),
                height: normalizeHeight(28),
                borderWidth: 1,
                borderColor: "#6E62A6",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: normalizeWidth(8),
              },
        ]}
      >
        <View>
          <Icon
            name={selected ? "checkmark-sharp" : "close-sharp"}
            color={selected ? "white" : "#6E62A6"}
            size={18}
          />
        </View>
      </View>

      <View style={{ flexDirection: "row", marginLeft: normalizeWidth(5) }}>
        <Image
          style={{ width: normalizeWidth(24), height: normalizeHeight(24) }}
          source={image}
        />
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const MultiSelect = ({ options, handleSelectChain, selectedChains }) => {
  const [selectedOptions, setSelectedOptions] = useState(selectedChains);

  const handleSelect = (value) => {
    setSelectedOptions([...selectedOptions, value]);
    handleSelectChain([...selectedOptions, value]);
  };

  const handleDeselect = (value) => {
    handleSelectChain(selectedOptions.filter((option) => option !== value));
    setSelectedOptions(selectedOptions.filter((option) => option !== value));
  };

  return (
    <View>
      {options.map((option) => (
        <MultiSelectOption
          key={option.value}
          {...option}
          selected={selectedOptions.includes(option.value)}
          onSelect={handleSelect}
          onDeselect={handleDeselect}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: normalizeHeight(15),
  },
  selected: {
    color: "green",
    marginRight: 8,
  },
  deselected: {
    color: "red",
    marginRight: 8,
  },
  label: {
    fontSize: normalizeWidth(18),
    fontWeight: "600",
    color: "#212121",
    marginLeft: normalizeWidth(5),
  },
});

export default MultiSelect;
