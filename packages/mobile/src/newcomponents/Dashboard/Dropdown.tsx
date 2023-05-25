import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { normalizeWidth } from "../../themes/Metrics";
import { useTheme } from "../../context/ThemeContext";

type DropdownItem = {
  label: string;
  value: string;
};

type DropdownProps = {
  items: DropdownItem[];
  defaultLabel?: string;
  onSelect: (value: DropdownItem) => void;
  selected: string;
};

const Dropdown: React.FC<DropdownProps> = ({
  items,
  defaultLabel,
  onSelect,
  selected,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(selected);
  useEffect(() => {
    if (selected) {
      const selectedText = `${selected?.slice(
        0,
        10,
      )}...........................${selected.slice(32, 42)}`;
      setSelectedItem(selectedText);
    }
  }, [selected, items]);

  const handleSelect = (item: DropdownItem) => {
    setSelectedItem(
      `${item.label?.slice(0, 10)}...........................${item.label?.slice(
        30,
        42,
      )}`,
    );
    setIsOpen(false);
    onSelect(item);
  };

  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      position: "relative",
      width: "100%",
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
      color: theme?.colors.title,
      fontWeight: "400",
    },
    dropdown: {
      position: "absolute",
      top: 40,
      width: "100%",
      borderWidth: 0.4,
      borderColor: "black",
      backgroundColor: theme?.colors.backgroundSecondary,
      zIndex: 1,
      borderRadius: 15,
    },
    item: {
      padding: 10,
      borderRadius: 15,
    },
  });

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
            color={theme?.colors.iconColor}
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
              <Text style={{color:theme?.colors.title}}>
                {item.label?.slice(0, 12)}...........................
                {item.label?.slice(30, 42)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default Dropdown;
