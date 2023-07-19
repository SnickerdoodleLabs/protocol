import {
  Button,
  Clipboard,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import "@walletconnect/react-native-compat";

import Icon from "react-native-vector-icons/Ionicons";
import { normalizeHeight, normalizeWidth } from "../../themes/Metrics";
import { ROUTES } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import Svg, { Path } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWalletConnectModal } from "@walletconnect/modal-react-native";
import { BlockchainActions } from "./BlockchainActions";
import { useAppContext } from "../../context/AppContextProvider";
import { LanguageCode } from "@snickerdoodlelabs/objects";

export default function Settings() {
  const [clientId, setClientId] = React.useState<string>();
  const navigation = useNavigation();
  const theme = useTheme();
  const { isConnected, provider, open } = useWalletConnectModal();
  const { mobileCore } = useAppContext();

  useEffect(() => {
    mobileCore.accountService
      .getUnlockMessage(LanguageCode("en"))
      .map((message) => {
        console.log("message", message);
      });
  }, []);

  const onCopy = (value: string) => {
    Clipboard.setString(value);
  };

  const handleButtonPress = async () => {
    if (isConnected) {
      return provider?.disconnect();
    }
    return open();
  };

  useEffect(() => {
    async function getClientId() {
      if (provider && isConnected) {
        const _clientId = await provider?.client?.core.crypto.getClientId();
        setClientId(_clientId);
      } else {
        setClientId(undefined);
      }
    }

    getClientId();
  }, [isConnected, provider]);

  return (
    <SafeAreaView
      style={{ backgroundColor: theme?.colors.background, height: "100%" }}
    >
      <ScrollView
        style={{
          backgroundColor: theme?.colors.background,
          paddingHorizontal: normalizeWidth(18),
        }}
      >
        <SafeAreaView style={{ backgroundColor: theme?.colors.background }}>
          <Text
            style={{
              fontWeight: "700",
              fontSize: normalizeWidth(24),
              color: theme?.colors.title,
              marginTop: normalizeHeight(25),
            }}
          >
            Settings
          </Text>

          <View
            style={{
              position: "absolute",
              top: normalizeHeight(20),
              right: normalizeWidth(0),
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: theme?.colors.backgroundSecondary,
              borderRadius: normalizeWidth(20),
              padding: normalizeWidth(4),
            }}
          >
            {theme?.isDarkMode ? (
              <Icon
                name="moon"
                size={normalizeWidth(24)}
                color="#ffc107"
                style={{ marginHorizontal: normalizeWidth(4) }}
              />
            ) : (
              <Icon
                name="sunny"
                size={normalizeWidth(24)}
                color="#fbc02d"
                style={{ marginHorizontal: normalizeWidth(4) }}
              />
            )}
            <Switch
              style={{ marginRight: normalizeWidth(4) }}
              trackColor={{
                false: "rgba(0, 0, 0, 0.3)",
                true: "rgba(0, 0, 0, 0.3)",
              }}
              thumbColor={theme?.isDarkMode ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="rgba(0, 0, 0, 0.3)"
              onValueChange={() => {
                theme?.setIsDarkMode(!theme.isDarkMode);
                AsyncStorage.setItem(
                  "darkMode",
                  JSON.stringify(!theme?.isDarkMode),
                );
              }}
              value={theme?.isDarkMode}
            />
          </View>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: normalizeHeight(50),
            }}
            onPress={() => {
              navigation.navigate(ROUTES.CRYPTO_SETTINGS);
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: 80,
              }}
            >
              <Image
                style={{
                  width: 62,
                  height: 62,
                }}
                source={require("../../assets/images/settings-crypto.png")}
              />
              <Text
                style={{
                  paddingLeft: normalizeWidth(20),
                  fontWeight: "700",
                  fontSize: 19,
                  color: theme?.colors.description,
                }}
              >
                Linked Wallets
              </Text>
            </View>
            <View>
              <Icon
                name="chevron-forward-outline"
                size={25}
                color={theme?.colors.description}
              />
            </View>
          </TouchableOpacity>

          {/*     <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: normalizeHeight(32),
            }}
            onPress={() => {
              navigation.navigate(ROUTES.SOCIAL_SETTINGS);
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 100,
                  backgroundColor: "#f3f2f9",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="share-social" size={normalizeWidth(28)} />
              </View>

              <Text
                style={{
                  paddingLeft: normalizeWidth(20),
                  fontWeight: "700",
                  fontSize: 19,
                  color: theme?.colors.description,
                }}
              >
                Linked Socails
              </Text>
            </View>
            <View>
              <Icon
                name="chevron-forward-outline"
                size={25}
                color={theme?.colors.description}
              />
            </View>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: normalizeHeight(32),
            }}
            onPress={() => {
              navigation.navigate(ROUTES.PERSONAL_SETTINGS);
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 100,
                  backgroundColor: "#f3f2f9",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="person" size={normalizeWidth(28)} />
              </View>

              <Text
                style={{
                  paddingLeft: normalizeWidth(20),
                  fontWeight: "700",
                  fontSize: 19,
                  color: theme?.colors.description,
                }}
              >
                Personal Info
              </Text>
            </View>
            <View>
              <Icon
                name="chevron-forward-outline"
                size={25}
                color={theme?.colors.description}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: normalizeHeight(32),
            }}
            onPress={() => {
              navigation.navigate(ROUTES.REWARDS_SETTINGS);
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                style={{
                  width: 62,
                  height: 62,
                }}
                source={require("../../assets/images/settings-subscription.png")}
              />
              <Text
                style={{
                  paddingLeft: normalizeWidth(20),
                  fontWeight: "700",
                  fontSize: 19,
                  color: theme?.colors.description,
                }}
              >
                Rewards Subscriptions
              </Text>
            </View>
            <View>
              <Icon
                name="chevron-forward-outline"
                size={25}
                color={theme?.colors.description}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: normalizeHeight(32),
            }}
            onPress={() => {
              navigation.navigate(ROUTES.PERMISSION_SETTINGS);
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                style={{
                  width: 62,
                  height: 62,
                }}
                source={require("../../assets/images/settings-permissions.png")}
              />
              <Text
                style={{
                  paddingLeft: normalizeWidth(20),
                  fontWeight: "700",
                  fontSize: 19,
                  color: theme?.colors.description,
                }}
              >
                Data Permissions
              </Text>
            </View>
            <View>
              <Icon
                name="chevron-forward-outline"
                size={25}
                color={theme?.colors.description}
              />
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </SafeAreaView>
  );
}
