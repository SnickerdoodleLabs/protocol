import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { normalizeWidth } from "../../themes/Metrics";

type DropdownItem = {
  label: string;
  value: string;
};

type DropdownProps = {
  items: DropdownItem[];
  defaultLabel?: string;
  onSelect: (value: string) => void;
};

const Dropdown: React.FC<DropdownProps> = ({
  items,
  defaultLabel,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(
    defaultLabel || items[0].label,
  );

  const handleSelect = (item: DropdownItem) => {
    setSelectedItem(item.label);
    setIsOpen(false);
    onSelect(item.value);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={styles.button}
      >
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>{selectedItem}</Text>
          <Icon
            name={isOpen ? "caret-up-outline" : "caret-down-outline"}
            size={normalizeWidth(20)}
            color="#9E9E9E"
          />
        </View>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdown}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={item.value}
              onPress={() => handleSelect(item)}
              style={[
                styles.item,
                index + 1 != items.length && { borderBottomWidth: 0.2 },
              ]}
            >
              <Text>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "80%",
    alignItems: "center",
  },
  dropdownContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 6,
    borderWidth: 2,
    borderColor: "#6E62A6",
    width: "100%",
    alignItems: "center",
    borderRadius: 100,
  },
  label: {
    fontSize: normalizeWidth(16),
    color: "#424242",
    fontWeight: "400",
  },
  dropdown: {
    position: "absolute",
    top: 40,
    width: "100%",
    borderWidth: 0.4,
    borderColor: "black",
    backgroundColor: "white",
    zIndex: 1,
    borderRadius: 15,
  },
  item: {
    padding: 10,
    borderRadius: 15,
  },
});

export default Dropdown;
