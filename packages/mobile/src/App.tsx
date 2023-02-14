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

  useEffect(() => {
    initBackgroundFetch();
  }, []);

  const initBackgroundFetch = async () => {
    /* // BackgroundFetch event handler.
    const onEvent = async taskId => {
      console.log('[BackgroundFetch] task: ', taskId);
      // Do your background work...
      await addEvent(taskId);
      // IMPORTANT:  You must signal to the OS that your task is complete.
      BackgroundFetch.finish(taskId);
    };

    // Timeout callback is executed when your Task has exceeded its allowed running-time.
    // You must stop what you're doing immediately BackgroundFetch.finish(taskId)
    const onTimeout = async taskId => {
      console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
      BackgroundFetch.finish(taskId);
    };

    // Initialize BackgroundFetch only once when component mounts.
    let status = await BackgroundFetch.configure(
      {minimumFetchInterval: 15},
      onEvent,
      onTimeout,
    );

    console.log('[BackgroundFetch] configure status: ', status);
  };

  // Add a BackgroundFetch event to <FlatList>
  const addEvent = taskId => {
    // Simulate a possibly long-running asynchronous task with a Promise.
    return new Promise<void>((resolve, reject) => {
      setState(state => ({
        events: [
          ...state.events,
          {
            taskId: taskId,
            timestamp: new Date().toString(),
          },
        ],
      }));
      resolve();
    }); */

    // Step 1:  Configure BackgroundFetch as usual.
    let status = await BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,
      },
      async (taskId) => {
        // <-- Event callback
        // This is the fetch-event callback.
        console.log("[BackgroundFetch] taskId: ", taskId);

        // Use a switch statement to route task-handling.
        switch (taskId) {
          case "com.foo.customtask":
            console.log("Received custom task");
            break;
          default:
            console.log("Default fetch task");
        }
        // Finish, providing received taskId.
        BackgroundFetch.finish(taskId);
      },
      async (taskId) => {
        // <-- Task timeout callback
        // This task has exceeded its allowed running-time.
        // You must stop what you're doing and immediately .finish(taskId)
        BackgroundFetch.finish(taskId);
      },
    );

    // Step 2:  Schedule a custom "oneshot" task "com.foo.customtask" to execute 5000ms from now.
    BackgroundFetch.scheduleTask({
      taskId: "com.sdmobile.fetch",
      forceAlarmManager: true,
      delay: 5000, // <-- milliseconds
    });
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
