import {
  Alert,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import Clipboard from "@react-native-clipboard/clipboard";
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
  const handleCopy = (privateKey: string) => {
    Clipboard.setString(privateKey);
    Alert.alert("Information", "Copied to clipboard", [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
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
  const [generatedInfo, setGeneratedInfo] = React.useState<{
    publickey: string;
    privateKey: string;
  } | null>(null);
  useEffect(() => {
    AsyncStorage.getItem("generated-wallet").then((value) => {
      if (value) {
        console.log("generated", value);
        setGeneratedInfo(JSON.parse(value));
      }
    });
  }, []);
  return (
    <SafeAreaView>
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
            {generatedInfo && (
              <View style={styles.borderBox}>
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: normalizeWidth(20),
                    color: theme?.colors.description,
                    marginBottom: normalizeHeight(20),
                  }}
                >
                  Export Generated Account
                </Text>
                <Text
                  style={{
                    fontSize: normalizeWidth(20),
                    color: theme?.colors.title,
                    fontWeight: "700",
                    lineHeight: normalizeWidth(24),
                  }}
                >
                  Account Address
                </Text>
                <View
                  style={{
                    width: "100%",
                    height: normalizeHeight(68),
                    backgroundColor: theme?.colors.backgroundSecondary,
                    justifyContent: "center",
                    paddingHorizontal: normalizeWidth(10),
                    marginVertical: normalizeHeight(12),
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: theme?.colors.description,
                        fontSize: normalizeWidth(16),
                        fontWeight: "600",
                      }}
                    >
                      {generatedInfo?.publicKey?.slice(0, 28)}...
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        handleCopy(generatedInfo?.publicKey ?? "");
                      }}
                    >
                      <Image
                        style={{
                          width: normalizeWidth(22),
                          height: normalizeHeight(22),
                          marginLeft: normalizeWidth(12),
                        }}
                        source={require("../../assets/images/copyIcon.png")}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text
                  style={{
                    fontSize: normalizeWidth(20),
                    color: theme?.colors.title,
                    fontWeight: "700",
                    lineHeight: normalizeWidth(24),
                  }}
                >
                  Private Key
                </Text>
                <View
                  style={{
                    width: "100%",
                    height: normalizeHeight(68),
                    backgroundColor: theme?.colors.backgroundSecondary,
                    justifyContent: "center",
                    paddingHorizontal: normalizeWidth(10),
                    marginTop: normalizeHeight(12),
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: theme?.colors.description,
                        fontSize: normalizeWidth(16),
                        fontWeight: "600",
                      }}
                    >
                      **************************************
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        handleCopy(generatedInfo?.privateKey);
                      }}
                    >
                      <Image
                        style={{
                          width: normalizeWidth(22),
                          height: normalizeHeight(22),
                          marginLeft: normalizeWidth(12),
                        }}
                        source={require("../../assets/images/copyIcon.png")}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            <View style={{ height: normalizeHeight(200) }}></View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </SafeAreaView>
  );
}
