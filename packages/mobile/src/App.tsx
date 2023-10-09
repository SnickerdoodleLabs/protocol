/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "@walletconnect/react-native-compat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { WalletConnectModal } from "@walletconnect/modal-react-native";
import WalletConnectProvider from "@walletconnect/react-native-dapp";
import setGlobalVars from "indexeddbshim/dist/indexeddbshim-noninvasive";
import React, { useEffect } from "react";
import {
  Platform,
  StyleSheet,
  useColorScheme,
  LogBox,
  Clipboard,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Orientation from "react-native-orientation-locker";
import SQLite from "react-native-sqlite-2";
import Ionicons from "react-native-vector-icons/Ionicons";

import { providerMetadata } from "./constants/WCConfig";
import AccountLinkingContextProvider from "./context/AccountLinkingContextProvider";
import AppContextProvider, {
  useAppContext,
} from "./context/AppContextProvider";
import EventContextProvider from "./context/EventContextProvider";
import InvitationContextProvider from "./context/InvitationContext";
import LayoutContextProvider from "./context/LayoutContext";
import { ThemeContextProvider } from "./context/ThemeContext";
import { AuthNavigator } from "./navigators/AuthNavigator";
import BottomTabNavigator from "./navigators/BottomTabNavigator";
import DeepLinkHandler from "./navigators/DeepLinkHandler";

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

// AntDesign.loadFont().then();
Ionicons.loadFont().then();
// Feather.loadFont().then();

const App = () => {
  const isDarkMode = useColorScheme() === "dark";
  const [state, setState] = React.useState<any>({
    events: [],
  });
  const { isUnlocked } = useAppContext();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const linking = {
    prefixes: ["sdmobile://"],
  };

  useEffect(() => {
    Orientation.lockToPortrait(); // lock to portrait mode
  }, []);
  const onCopy = (value: string) => {
    Clipboard.setString(value);
  };

  setGlobalVars(global, {
    checkOrigin: false,
    win: SQLite,
    /*   deleteDatabaseFiles: false,
      useSQLiteIndexes: true, */
  });
  return (
    <AppContextProvider>
      <ThemeContextProvider>
        <NavigationContainer linking={linking}>
          <LayoutContextProvider>
            <InvitationContextProvider>
              <DeepLinkHandler />
              <EventContextProvider>{null}</EventContextProvider>
              <WalletConnectProvider
                bridge="https://bridge.walletconnect.org"
                clientMeta={{
                  description: "Connect with WalletConnect",
                  url: "https://walletconnect.org",
                  icons: ["https://walletconnect.org/walletconnect-logo.png"],
                  name: "WalletConnect",
                }}
                redirectUrl={
                  Platform.OS === "web" ? "https:google.com" : "sdmobile://"
                }
                storageOptions={{
                  asyncStorage: AsyncStorage as any,
                }}
              >
                <WalletConnectModal
                  projectId={"7b43f10fd3404bb16a3c0947b0ff3436"}
                  providerMetadata={providerMetadata}
                />
                <AccountLinkingContextProvider>
                  <BottomTabNavigator />
                </AccountLinkingContextProvider>
              </WalletConnectProvider>
            </InvitationContextProvider>
          </LayoutContextProvider>
        </NavigationContainer>
      </ThemeContextProvider>
    </AppContextProvider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
});

export default App;
