import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { useAccountLinkingContext } from "../../context/AccountLinkingContextProvider";
import { useAppContext } from "../../context/AppContextProvider";
import { normalizeHeight, normalizeWidth } from "../../themes/Metrics";
import RadioButton from "../Custom/RadioButton";
import MyComponent from "../Onboarding/Mycomponent";
import Permission from "../Onboarding/Permission";
import { useTheme } from "../../context/ThemeContext";

export default function PermissionSettings() {
  const theme = useTheme();
  const { onWCButtonClicked } = useAccountLinkingContext();
  const { linkedAccounts } = useAppContext();
  const [selected, setSelected] = React.useState<string>(linkedAccounts[0]);

  const handleSelect = (value: string) => {
    setSelected(value);
  };

  return (
    <SafeAreaView>
      <ScrollView
        style={{
          paddingHorizontal: normalizeWidth(20),
          backgroundColor: theme?.colors.background,
        }}
      >
        <SafeAreaView style={{height:normalizeHeight(750)}}>
          <Text
            style={{
              fontWeight: "700",
              fontSize: normalizeWidth(24),
              color: theme?.colors.title,
              marginTop: normalizeHeight(10),
            }}
          >
            Data Permissions
          </Text>

          <Text
            style={{
              fontSize: normalizeWidth(16),
              lineHeight: normalizeHeight(22),
              fontWeight: "400",
              color: theme?.colors.description,
              marginTop: normalizeHeight(20),
            }}
          >
            {`Consent to share aggregated, anonymized insights\nderived from your data. You can set permissions\nindividually, for each item.`}
          </Text>
          <Permission />
        </SafeAreaView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  borderBox: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#EAECF0",
    borderRadius: normalizeWidth(24),
    marginTop: normalizeHeight(24),
    paddingVertical: normalizeHeight(20),
    paddingHorizontal: normalizeWidth(20),
  },
});
