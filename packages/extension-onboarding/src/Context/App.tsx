import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getProviderList,
  IProvider,
} from "@extension-onboarding/services/providers";

export interface ILinkedAccount {
  name: string;
  key: string;
  accountAddress: string;
}

export interface IAppContext {
  linkedAccounts: ILinkedAccount[];
  providerList: IProvider[];
  addAccount: (account: ILinkedAccount) => void;
}
const AppContext = createContext<IAppContext>({} as IAppContext);

export const AppContextProvider: FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [providerList, setProviderList] = useState<IProvider[]>([]);
  const [installedProviders, setInstalledProviders] = useState<IProvider[]>([]);
  const [linkedAccounts, setLinkedAccounts] = useState<ILinkedAccount[]>([]);
  useEffect(() => {
    document.addEventListener(
      "SD_WALLET_EXTENSION_CONNECTED",
      onWalletConnected,
    );
  }, []);

  useEffect(() => {
    if (isLoading === false) {
      document.removeEventListener(
        "SD_WALLET_EXTENSION_CONNECTED",
        onWalletConnected,
      );
    }
  }, [isLoading]);

  const onWalletConnected = () => {
    // Phantom wallet can not initiate window phantom object at time
    setTimeout(() => {
      const providerList = getProviderList();
      providerList.map((list) => {
        if (list.provider.isInstalled && list.key != "walletConnect") {
          setInstalledProviders((old) => [...old, list]);
        }
      });
      setProviderList(providerList);
      setIsLoading(false);
    }, 500);
  };

  const addAccount = (account: ILinkedAccount) => {
    console.log("a", "account");
    setLinkedAccounts((prevState) => [...prevState, account]);
  };

  return (
    <AppContext.Provider
      value={{
        providerList,
        linkedAccounts,
        addAccount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
