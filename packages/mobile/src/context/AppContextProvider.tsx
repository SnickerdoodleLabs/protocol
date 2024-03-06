import { AccountAddress, DomainName } from "@snickerdoodlelabs/objects";
import React, { useMemo, useState, useContext } from "react";
import { AppStateStatus } from "react-native";

import { MobileCore } from "../services/implementations/MobileCore";

export interface IAppCtx {
  mobileCore: MobileCore;
  appState: AppStateStatus;
  isUnlocked: boolean;
  linkedAccounts: AccountAddress[];
  setUnlockState: (boolean) => void;
  updateLinkedAccounts: (sourceDomain: DomainName | undefined) => void;
}

export const AppCtx = React.createContext<IAppCtx>({} as IAppCtx);

const AppContextProvider = ({ children }) => {
  // MobileCore Instance
  const mobileCore = useMemo(() => new MobileCore(), []);
  const [appState, setAppState] = useState<AppStateStatus>("active");
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [linkedAccounts, setLinkedAccounts] = useState<AccountAddress[]>([]);

  const setUnlockState = (state: boolean) => {
    setIsUnlocked(state);
  };

  const updateLinkedAccounts = (sourceDomain: DomainName | undefined) => {
    mobileCore
      .getCore()
      .account.getAccounts(sourceDomain)
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
        mobileCore,
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
