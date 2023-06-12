import {
  Image,
  Linking,
  Platform,
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
import { useTheme } from "../../context/ThemeContext";
import { ResultAsync } from "neverthrow";
import { DiscordProvider } from "../Social/DiscordProvider";
import { authorize, AuthorizeResult } from "react-native-app-auth";

interface AuthorizeConfig {
  clientId: string;
  redirectUrl: string;
  scopes: string[];
  serviceConfiguration: {
    authorizationEndpoint: string;
    tokenEndpoint: string;
  };
}

export default function SocialSettings() {
  const { mobileCore } = useAppContext();
  const { onWCButtonClicked } = useAccountLinkingContext();
  const { linkedAccounts } = useAppContext();
  const [selected, setSelected] = React.useState<string>(linkedAccounts[0]);
  const navigation = useNavigation();
  const theme = useTheme();

  const config = {
    clientId: "1117170975205761236",
    clientSecret: "6Vec0sG6pdKymFNdi0VOqdHlsYHf_W7H",
    redirectUrl: "sdmobile://",
    scopes: ["email", "identify", "guilds"],
    serviceConfiguration: {
      authorizationEndpoint: "https://discordapp.com/api/oauth2/authorize",
      tokenEndpoint: "https://discordapp.com/api/oauth2/token",
    },
  };

  const handleLogin = async () => {
    try {
      console.log("a");
      const authResult = await authorize({
        ...config,
        connectionTimeoutSeconds: 5,
      });
      console.log("authResult", authResult);
    } catch (error) {
      console.log("EEEEEEE", error);
    }
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
          Linked Socials
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

        <View>
          <TouchableOpacity onPress={handleLogin}>
            <Text>Link Discord7</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
