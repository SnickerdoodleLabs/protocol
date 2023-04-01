import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { normalizeHeight, normalizeWidth } from "../../themes/Metrics";

interface Country {
  name: string;
  code: string;
}

const countries: Country[] = [
  { name: "United States", code: "US" },
  { name: "Canada", code: "CA" },
  { name: "Mexico", code: "MX" },
  // Add more countries here
];

const genders: string[] = ["Male", "Female", "Non-binary"];

const years: string[] = Array.from(
  { length: 100 },
  (_, i) => `${new Date().getFullYear() - i}`,
);

const DropdownInput = ({
  label,
  selectedValue,
  options,
  setSelectedValue,
}: {
  label: string;
  selectedValue: string | null;
  options: string[] | Country[];
  setSelectedValue: (value: string | Country) => void;
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handlePress = (value: string | Country) => {
    setSelectedValue(value);
    setDropdownVisible(false);
  };
  const iconNameObject = {
    Country: "location-outline",
    Gender: "person-outline",
    "Year of birth": "calendar-outline",
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        onPress={() => setDropdownVisible(!dropdownVisible)}
        style={styles.dropdownInput}
      >
        <Icon
          name={iconNameObject[label]}
          size={normalizeWidth(20)}
          color="#9E9E9E"
        />
        <Text style={styles.selectedValue}>{selectedValue || `${label}`}</Text>
        <Icon
          name={dropdownVisible ? "chevron-up" : "chevron-down"}
          size={24}
          color="#999"
        />
      </TouchableOpacity>
      {dropdownVisible && (
        <View style={styles.dropdown}>
          <ScrollView>
            {options.map((option: string | Country) => (
              <TouchableOpacity
                key={typeof option === "string" ? option : option.code}
                onPress={() => handlePress(option)}
                style={styles.dropdownOption}
              >
                <Text style={styles.dropdownOptionText}>
                  {typeof option === "string"
                    ? option
                    : `${option.name} (${option.code})`}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const MyComponent = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const handleCountryPress = (country: Country) => {
    setSelectedCountry(country);
  };

  const handleGenderPress = (gender: string) => {
    setSelectedGender(gender);
  };

  const handleYearPress = (year: string) => {
    setSelectedYear(year);
  };

  return (
    <View style={styles.container}>
      <DropdownInput
        label="Country"
        selectedValue={
          selectedCountry
            ? `${selectedCountry.name} (${selectedCountry.code})`
            : null
        }
        options={countries}
        setSelectedValue={handleCountryPress}
      />
      <DropdownInput
        label="Gender"
        selectedValue={selectedGender}
        options={genders}
        setSelectedValue={handleGenderPress}
      />
      <DropdownInput
        label="Year of birth"
        selectedValue={selectedYear}
        options={years}
        setSelectedValue={handleYearPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginTop: normalizeHeight(15),
  },

  inputContainer: {
    marginBottom: normalizeHeight(15),
  },
  label: {
    display: "none",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: normalizeWidth(16),
    paddingVertical: normalizeHeight(12),
    fontSize: normalizeWidth(16),
    color: "#333",
    backgroundColor: "#FAFAFA",
  },
  dropdownInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: normalizeWidth(8),
    paddingHorizontal: normalizeWidth(16),
    paddingVertical: normalizeHeight(12),
  },
  selectedValue: {
    flex: 1,
    fontSize: normalizeWidth(16),
    paddingLeft: normalizeWidth(10),
    color: "#333",
  },
  dropdownIcon: {
    marginLeft: "auto",
  },
  dropdown: {
    maxHeight: normalizeHeight(150),
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: normalizeWidth(8),
    marginTop: normalizeHeight(8),
    backgroundColor: "#FAFAFA",
  },
  dropdownOption: {
    paddingHorizontal: normalizeWidth(16),
    paddingVertical: normalizeHeight(12),
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  dropdownOptionText: {
    fontSize: normalizeWidth(16),
    color: "#333",
  },
  buttonContainer: {
    alignSelf: "center",
    backgroundColor: "#2e6cff",
    paddingHorizontal: normalizeWidth(16),
    paddingVertical: normalizeHeight(12),
    borderRadius: normalizeWidth(8),
    marginTop: normalizeHeight(24),
  },
  buttonText: {
    color: "#fff",
    fontSize: normalizeWidth(16),
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginTop: normalizeHeight(8),
    fontSize: normalizeWidth(14),
  },
});

export default MyComponent;
