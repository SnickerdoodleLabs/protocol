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
import { Buffer } from "buffer";
global.Buffer = Buffer;
import "react-native-get-random-values";
import "@ethersproject/shims";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Platform, StyleSheet, useColorScheme, LogBox } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";

import { Colors } from "react-native/Libraries/NewAppScreen";
import AuthNavigator from "./navigators/AuthNavigator";
import WalletConnectProvider from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackgroundFetch from "react-native-background-fetch";
import AppContextProvider from "./context/AppContextProvider";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

AntDesign.loadFont().then();
Ionicons.loadFont().then();
Feather.loadFont().then();

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
        <WalletConnectProvider
          bridge="https://bridge.walletconnect.org"
          clientMeta={{
            description: "Connect with WalletConnect",
            url: "https://walletconnect.org",
            icons: ["https://walletconnect.org/walletconnect-logo.png"],
            name: "WalletConnect",
          }}
          redirectUrl={
            Platform.OS === "web" ? "https:google.com" : "app://SDMobile2://"
          }
          storageOptions={{
            //@ts-ignore
            asyncStorage: AsyncStorage,
          }}
        >
          <AuthNavigator />
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
