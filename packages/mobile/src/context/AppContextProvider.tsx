import { AccountAddress } from "@snickerdoodlelabs/objects";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

import { MobileCore } from "../services/implementations/Gateway";

export interface IAppCtx {
  coreContext?: MobileCore;
  appState?: AppStateStatus;
  isUnlocked?: boolean;
  setUnlockState?: (boolean) => void;
  updateLinkedAccounts?: () => void;
}

export const AppCtx = React.createContext<IAppCtx>({});

const AppContextProvider = ({ children }) => {
  const coreContext = useMemo(() => new MobileCore(), []);
  const [appState, setAppState] = useState<AppStateStatus>("active");
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [linkedAccounts, setLinkedAccounts] = useState<AccountAddress[]>([]);

  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);
    return () => {};
  }, []);

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
        setUnlockState,
        updateLinkedAccounts,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
};

export default AppContextProvider;
