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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import WalletConnectProvider from "@walletconnect/react-native-dapp";
import React, { useEffect } from "react";
import { Platform, StyleSheet, useColorScheme, LogBox } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "react-native/Libraries/NewAppScreen";

import AccountLinkingContextProvider from "./context/AccountLinkingContextProvider";
import AppContextProvider from "./context/AppContextProvider";
import EventContextProvider from "./context/EventContextProvider";
import AuthNavigator from "./navigators/AuthNavigator";
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

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const linking = {
    prefixes: ["sdmobile://"],
  };

  return (
    <NavigationContainer linking={linking}>
      <AppContextProvider>
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
            //@ts-ignore
            asyncStorage: AsyncStorage,
          }}
        >
          <AccountLinkingContextProvider>
            <AuthNavigator />
          </AccountLinkingContextProvider>
        </WalletConnectProvider>
      </AppContextProvider>
    </NavigationContainer>
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
