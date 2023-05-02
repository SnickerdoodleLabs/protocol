import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { normalizeHeight, normalizeWidth } from "../../themes/Metrics";
import Icon from "react-native-vector-icons/Ionicons";
import { useAccountLinkingContext } from "../../context/AccountLinkingContextProvider";
import { useAppContext } from "../../context/AppContextProvider";
import RadioButton from "../Custom/RadioButton";
import MyComponent from "../Onboarding/Mycomponent";
import Permission from "../Onboarding/Permission";

export default function PermissionSettings() {
  const { onWCButtonClicked } = useAccountLinkingContext();
  const { linkedAccounts } = useAppContext();
  const [selected, setSelected] = React.useState<string>(linkedAccounts[0]);

  const handleSelect = (value: string) => {
    setSelected(value);
  };

  return (
    <ScrollView
      style={{
        paddingHorizontal: normalizeWidth(20),
        backgroundColor: "white",
      }}
    >
      <SafeAreaView>
        <Text
          style={{
            fontWeight: "700",
            fontSize: normalizeWidth(24),
            color: "#424242",
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
            color: "#424242",
            marginTop: normalizeHeight(32),
          }}
        >
          Consent to share aggregate, anonymized insights derived from your
          data. You can set permissions individually, for each item.
        </Text>
        <Permission />
      </SafeAreaView>
    </ScrollView>
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
