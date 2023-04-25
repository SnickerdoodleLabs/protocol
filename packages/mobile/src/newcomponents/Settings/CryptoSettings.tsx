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
import { useNavigation } from "@react-navigation/native";

export default function CryptoSettings() {
  const { mobileCore } = useAppContext();
  const { onWCButtonClicked } = useAccountLinkingContext();
  const { linkedAccounts } = useAppContext();
  const [selected, setSelected] = React.useState<string>(linkedAccounts[0]);
  const navigation = useNavigation();

  useEffect(() => {
    mobileCore
      .getCore()
      .getReceivingAddress()
      .map((receiveAccount) => {
        setSelected(receiveAccount);
      });
  }, []);

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
        {/*   <Icon
          name="arrow-back-outline"
          size={40}
          onPress={() => {
            navigation.goBack();
          }}
        /> */}
        <Text
          style={{
            fontWeight: "700",
            fontSize: normalizeWidth(24),
            color: "#424242",
            marginTop: normalizeHeight(10),
          }}
        >
          Crypto Accounts
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
          Add or remove wallets to control what web 3 data is stored in your
          data wallet. Any insights you share on your web 3 activity are
          anonymous and never linked back to your public addresses.
        </Text>

        <View style={{ marginTop: normalizeHeight(20) }}>
          <View style={styles.borderBox}>
            <Text
              style={{
                fontWeight: "700",
                fontSize: normalizeWidth(20),
                color: "#424242",
                marginBottom: normalizeHeight(10),
              }}
            >
              Link Account
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#6E62A6",
                width: "100%",
                height: normalizeHeight(58),
                borderRadius: normalizeWidth(100),
                marginVertical: normalizeHeight(15),
                justifyContent: "center",
              }}
              onPress={onWCButtonClicked}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../assets/images/walletConnect.png")}
                />
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontWeight: "700",
                    fontSize: normalizeWidth(16),
                    paddingLeft: normalizeWidth(5),
                  }}
                >
                  Wallet Connect
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginTop: normalizeHeight(20) }}>
          <View style={styles.borderBox}>
            <Text
              style={{
                fontWeight: "700",
                fontSize: normalizeWidth(20),
                color: "#424242",
                marginBottom: normalizeHeight(20),
              }}
            >
              Linked Accounts
            </Text>
            {/* TODO MOBILE */}
            {linkedAccounts.map((account) => {
              return (
                <View style={{ marginTop: normalizeHeight(10) }}>
                  <RadioButton
                    label={`${account?.slice(
                      0,
                      6,
                    )}...........................${account?.slice(36, 42)}`}
                    checked={account === selected}
                    onPress={() => handleSelect(account)}
                  />
                </View>
              );
            })}
          </View>
        </View>
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
