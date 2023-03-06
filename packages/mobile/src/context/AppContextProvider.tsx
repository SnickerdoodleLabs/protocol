import AsyncStorage from "@react-native-async-storage/async-storage";
import { AccountAddress } from "@snickerdoodlelabs/objects";
import React, { useEffect, useMemo, useState, useContext } from "react";
import { AppState, AppStateStatus } from "react-native";

import { MobileCore } from "../services/implementations/Gateway";

export interface IAppCtx {
  coreContext: MobileCore;
  appState: AppStateStatus;
  isUnlocked: boolean;
  linkedAccounts: AccountAddress[];
  setUnlockState: (boolean) => void;
  updateLinkedAccounts: () => void;
}

export const AppCtx = React.createContext<IAppCtx>({} as IAppCtx);

const AppContextProvider = ({ children }) => {
  // AsyncStorage.setItem(
  //   "dw-address",
  //   "0x3047f77fa1263A86c38a0F9144907F6D9224c778",
  // );
  // AsyncStorage.setItem(
  //   "dw-account-info",
  //   `[{"accountAddress":"0x33aedf3b3f74f733a35434518ba715a2cbe02fd1","signature":"0x1bd4cc1e09516d5e7ef37e6b4630e97b49ac93b47ebf0cbb5e5adca3a5b1b5cc7fbc274387ba1409275784a73d4f5429cfbfe292b725eb8a8cae6a6b1a14d9421b","languageCode":"en","chain":1},{"accountAddress":"0x5d00be2873eac8d22bbdede51ec356b87f9e7ae9","signature":"0x5b9e19425c416d7cb5362c8fb53b22cbbe5bc1a09537bc0c5cac18ccd84dc43671bd2d4dd42fa4ba7ab04680d75197da1022e03d7a1a545a4114e6c00b07317c1b","languageCode":"en","chain":1}]`,
  // );
  const coreContext = useMemo(() => new MobileCore(), []);
  const [appState, setAppState] = useState<AppStateStatus>("active");
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [linkedAccounts, setLinkedAccounts] = useState<AccountAddress[]>([]);

/*   useEffect(() => {
    AsyncStorage.getAllKeys()
      .then((keys) => AsyncStorage.multiRemove(keys))
      .then(() => console.error("storage items deleted"));

    AppState.addEventListener("change", handleAppStateChange);
    return () => {};
  }, []); */

  const handleAppStateChange = (state: AppStateStatus) => {
    if (["active", "background"].includes(state)) {
      setAppState(state);
    }
  };

  const setUnlockState = (state: boolean) => {
    setIsUnlocked(state);
  };

  const updateLinkedAccounts = () => {
    coreContext
      .getAccountService()
      .getAccounts()
      .map((accounts) => {
        setLinkedAccounts(
          Array.from(
            new Set([
              ...linkedAccounts,
              ...accounts.map((account) => account.sourceAccountAddress),
            ]),
          ),
        );
      });
  };

  return (
    <AppCtx.Provider
      value={{
        coreContext,
        appState,
        isUnlocked,
        linkedAccounts,
        setUnlockState,
        updateLinkedAccounts,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
};

export default AppContextProvider;

export const useAppContext = () => useContext(AppCtx);
