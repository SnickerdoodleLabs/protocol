import { CountryCode, Gender, UnixTimestamp } from "@snickerdoodlelabs/objects";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAppContext } from "../../context/AppContextProvider";
import { normalizeHeight, normalizeWidth } from "../../themes/Metrics";
import { countries } from "../../services/interfaces/objects/Countries";
import { useTheme } from "../../context/ThemeContext";

interface Country {
  label: string;
  value: string;
}

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
    Gender: "transgender-outline",
    "Year of birth": "calendar-outline",
  };
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: "transparent",
      marginTop: normalizeHeight(15),
    },

    inputContainer: {
      marginBottom: normalizeHeight(15),
      zIndex: -1,
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
      backgroundColor: theme?.colors.backgroundSecondary,
      borderRadius: normalizeWidth(8),
      paddingHorizontal: normalizeWidth(16),
      paddingVertical: normalizeHeight(12),
    },
    selectedValue: {
      flex: 1,
      fontSize: normalizeWidth(16),
      paddingLeft: normalizeWidth(10),
      color: theme?.colors.title,
    },
    dropdownIcon: {
      marginLeft: "auto",
    },
    dropdown: {
      maxHeight: normalizeHeight(180),
      borderWidth: 0.5,
      borderColor: theme?.colors.border,
      borderRadius: normalizeWidth(8),
      marginTop: normalizeHeight(8),
      backgroundColor: theme?.colors.backgroundSecondary,
      zIndex: 9999,
    },
    dropdownOption: {
      paddingHorizontal: normalizeWidth(16),
      paddingVertical: normalizeHeight(12),
      borderBottomWidth: 1,
      borderBottomColor: theme?.colors.border,
    },
    dropdownOptionText: {
      fontSize: normalizeWidth(16),
      color: theme?.colors.title,
    },
  });

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
          color={theme?.colors.iconColor}
        />
        <Text style={styles.selectedValue}>{selectedValue || `${label}`}</Text>
        <Icon
          name={dropdownVisible ? "chevron-up" : "chevron-down"}
          size={24}
          color={theme?.colors.iconColor}
        />
      </TouchableOpacity>
      {dropdownVisible && (
        <View style={styles.dropdown}>
          <ScrollView>
            {options.map((option: string | Country) => (
              <TouchableOpacity
                key={typeof option === "string" ? option : option.value}
                onPress={() => handlePress(option)}
                style={styles.dropdownOption}
              >
                <Text style={styles.dropdownOptionText}>
                  {typeof option === "string" ? option : `${option.label}`}
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
  const { mobileCore } = useAppContext();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedGender, setSelectedGender] = useState<any | null>(null);
  const [selectedYear, setSelectedYear] = useState<any | null>(null);
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: "transparent",
      marginTop: normalizeHeight(15),
    },

    inputContainer: {
      marginBottom: normalizeHeight(15),
      zIndex: -1,
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
      backgroundColor: theme?.colors.backgroundSecondary,
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

  useEffect(() => {
    mobileCore.piiService.getLocation().map((res) => {
      console.log("res", res);
      if (res) {
        const country = countries.filter((country) => country.value === res);
        setSelectedCountry({
          label: country[0].label,
          value: country[0].value,
        });
      }
    });

    mobileCore.piiService.getGender().map((res) => {
      if (res) {
        setSelectedGender(res);
      }
    });

    mobileCore.piiService.getBirthday().map((res) => {
      if (res) {
        const date = new Date(res * 1000); // multiply by 1000 to convert from seconds to milliseconds
        const year = date.getUTCFullYear(); // get the year in UTC
        setSelectedYear(year);
      }
    });
  }, [mobileCore]);

  const handleCountryPress = (country: any) => {
    mobileCore.piiService.setLocation(country.value as CountryCode);
    setSelectedCountry(country);
  };

  const handleGenderPress = (gender: string) => {
    mobileCore.piiService.setGender(gender.toLowerCase() as Gender);
    setSelectedGender(gender);
  };

  const handleYearPress = (year: string) => {
    mobileCore.piiService.setBirthday(
      (Date.parse(`${year}-01-01T00:00:00Z`) / 1000) as UnixTimestamp,
    );
    setSelectedYear(year);
  };

  return (
    <View style={styles.container}>
      <View style={{ width: "100%", height: 60, zIndex: 999 }}>
        <View style={{ position: "absolute", width: "100%", zIndex: 999 }}>
          <DropdownInput
            label="Country"
            selectedValue={selectedCountry ? `${selectedCountry.label}` : null}
            options={countries}
            setSelectedValue={handleCountryPress}
          />
        </View>
      </View>

      <View style={{ width: "100%", height: 60, zIndex: 998 }}>
        <View style={{ position: "absolute", width: "100%", zIndex: 998 }}>
          <DropdownInput
            label="Gender"
            selectedValue={selectedGender}
            options={genders}
            setSelectedValue={handleGenderPress}
          />
        </View>
      </View>
      <View>
        <View style={{ width: "100%", height: 60, zIndex: 997 }}>
          <View style={{ position: "absolute", width: "100%", zIndex: 997 }}>
            <DropdownInput
              label="Year of birth"
              selectedValue={selectedYear}
              options={years}
              setSelectedValue={handleYearPress}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default MyComponent;
