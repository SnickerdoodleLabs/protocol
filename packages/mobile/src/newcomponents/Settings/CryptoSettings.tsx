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
import { EVMAccountAddress } from "@snickerdoodlelabs/objects";
import { useTheme } from "../../context/ThemeContext";

export default function CryptoSettings() {
  const { mobileCore } = useAppContext();
  const { onWCButtonClicked } = useAccountLinkingContext();
  const { linkedAccounts } = useAppContext();
  const [selected, setSelected] = React.useState<string>(linkedAccounts[0]);
  const navigation = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    mobileCore
      .getCore()
      .getReceivingAddress()
      .map((receiveAccount) => {
        setSelected(receiveAccount);
      });
  }, []);

  const handleSelect = (value: string) => {
    mobileCore.getCore().setDefaultReceivingAddress(value as EVMAccountAddress);
    setSelected(value);
  };

  const styles = StyleSheet.create({
    borderBox: {
      width: "100%",
      borderWidth: 1,
      borderColor: theme?.colors.border,
      borderRadius: normalizeWidth(24),
      marginTop: normalizeHeight(24),
      paddingVertical: normalizeHeight(20),
      paddingHorizontal: normalizeWidth(20),
    },
  });
  return (
    <ScrollView
      style={{
        paddingHorizontal: normalizeWidth(20),
        backgroundColor: theme?.colors.background,
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
            color: theme?.colors.title,
            marginTop: normalizeHeight(15),
          }}
        >
          Linked Wallets
        </Text>

        <Text
          style={{
            fontSize: normalizeWidth(16),
            lineHeight: normalizeHeight(22),
            fontWeight: "400",
            color: theme?.colors.description,
            marginTop: normalizeHeight(32),
          }}
        >
          {`Add wallets to control the Web3 information that\nappears in your Data Wallet.\n\nAny Web3 activity you share is anonymized and\ncannot be linked back to your public addresses.`}{" "}
        </Text>

        <View style={{ marginTop: normalizeHeight(20) }}>
          <View style={styles.borderBox}>
            <Text
              style={{
                fontWeight: "700",
                fontSize: normalizeWidth(20),
                color: theme?.colors.description,
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
                color: theme?.colors.description,
                marginBottom: normalizeHeight(20),
              }}
            >
              Linked Accounts
            </Text>
            <Text
              style={{
                fontSize: normalizeWidth(15),
                lineHeight: normalizeHeight(22),
                fontWeight: "400",
                color: theme?.colors.description,
                marginBottom: normalizeHeight(10),
              }}
            >
              Select an account as your default receiving wallet.
            </Text>
            {/* TODO MOBILE */}
            {linkedAccounts.map((account) => {
              return (
                <View
                  style={{
                    marginTop: normalizeHeight(10),
                    flexDirection: "row",
                  }}
                >
                  <RadioButton
                    label={`${account?.slice(
                      0,
                      6,
                    )}...........................${account?.slice(36, 42)}`}
                    checked={account === selected}
                    onPress={() => handleSelect(account)}
                  />
                  <Image
                    style={{
                      width: normalizeWidth(28),
                      height: normalizeHeight(28),
                    }}
                    source={require("../../assets/images/newAccountIcon.png")}
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
