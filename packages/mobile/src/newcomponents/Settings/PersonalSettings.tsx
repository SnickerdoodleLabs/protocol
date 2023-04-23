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

export default function PersonalSettings() {
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
            marginTop: normalizeHeight(60),
          }}
        >
          Personal Info
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
          Control your data in the wallet by adding or removing demographic
          information. Shared insights are anonymous.
        </Text>
        <MyComponent />
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
