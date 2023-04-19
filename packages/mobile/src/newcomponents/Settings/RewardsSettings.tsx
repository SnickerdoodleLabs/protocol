import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { normalizeHeight, normalizeWidth } from "../../themes/Metrics";
import Icon from "react-native-vector-icons/Ionicons";
import { useAccountLinkingContext } from "../../context/AccountLinkingContextProvider";
import { useAppContext } from "../../context/AppContextProvider";
import RadioButton from "../Custom/RadioButton";
import MyComponent from "../Onboarding/Mycomponent";

export default function RewardsSettings() {
  const { mobileCore } = useAppContext();
  const { onWCButtonClicked } = useAccountLinkingContext();
  const { linkedAccounts } = useAppContext();
  const [selected, setSelected] = React.useState<string>(linkedAccounts[0]);

  const handleSelect = (value: string) => {
    setSelected(value);
  };

  useEffect(() => {
    mobileCore.invitationService
      .getAcceptedInvitationsCID()
      .mapErr((e) => {})
      .map((metaData) => {
        console.log("ACCEPTEDINVITATIONS", metaData);
      });

    mobileCore.accountService.getEarnedRewards().map((rewards) => {
      console.log("EARNEDREWARDS", rewards);
    });
  }, []);

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
          Rewards Subscription Settings
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
          These are the rewards programs you follow. Through these subscription
          contracts, you have agreed to share anonymized business insights with
          only these rewards programs, in exchange for rewards.
        </Text>
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
