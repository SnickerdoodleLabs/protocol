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
} from "@extension-onboarding/services/blockChainWalletProviders";
import { PII } from "@extension-onboarding/services/interfaces/objects";
import { EWalletProviderKeys } from "@extension-onboarding/constants";
import { EVMAccountAddress } from "@snickerdoodlelabs/objects";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/sdlDataWallet/interfaces/IWindowWithSdlDataWallet";
import { ResultAsync } from "neverthrow";
import { ApiGateway } from "@extension-onboarding/services/implementations/ApiGateway";
import { DataWalletGateway } from "@extension-onboarding/services/implementations/DataWalletGateway";

export interface ILinkedAccount {
  providerKey: EWalletProviderKeys;
  accountAddress: EVMAccountAddress;
}

export interface IAppContext {
  apiGateway: ApiGateway;
  dataWalletGateway: DataWalletGateway;
  linkedAccounts: ILinkedAccount[];
  isSDLDataWalletDetected: boolean;
  providerList: IProvider[];
  getUserAccounts(): ResultAsync<void, unknown>;
  addAccount(account: ILinkedAccount): void;
  deleteAccount: (account: ILinkedAccount) => void;
  addUserObject: (account: PII) => void;
  getUserObject: () => PII | undefined;
  changeStepperStatus: (status: string) => void;
  stepperStatus: number;
  viewDetailsAccountAddress: EVMAccountAddress | undefined;
  setViewDetailsAccountAddress: (accountAddress: EVMAccountAddress) => void;
}

declare const window: IWindowWithSdlDataWallet;

const AppContext = createContext<IAppContext>({} as IAppContext);

export const AppContextProvider: FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [providerList, setProviderList] = useState<IProvider[]>([]);
  const [stepperStatus, setStepperStatus] = useState(0);
  const [linkedAccounts, setLinkedAccounts] = useState<ILinkedAccount[]>([]);
  const [userObject, setUserObject] = useState<PII>();

  const [viewDetailsAccountAddress, setViewDetailsAccountAddress] =
    useState<EVMAccountAddress>();

  const [isSDLDataWalletDetected, setSDLDataWalletDetected] =
    useState<boolean>(false);
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
    setSDLDataWalletDetected(true);
    setTimeout(() => {
      const providerList = getProviderList();
      setProviderList(providerList);
      setIsLoading(false);
      getUserAccounts();
    }, 500);
  };

  const getUserAccounts = () => {
    return window.sdlDataWallet.getAccounts().map((accounts) => {
      console.log(accounts);
      const _accounts: ILinkedAccount[] = accounts.map(
        (account) =>
          ({
            accountAddress: account,
            providerKey: localStorage.getItem(`${account}`) ?? null,
          } as ILinkedAccount),
      );
      setLinkedAccounts((prev) =>
        [...new Set(_accounts.map((o) => JSON.stringify(o)))].map((s) =>
          JSON.parse(s),
        ),
      );
    });
  };

  const addAccount = (account: ILinkedAccount) => {
    setLinkedAccounts((prev) => [...prev, account]);
  };

  const deleteAccount = (account: ILinkedAccount) => {
    const accounts = linkedAccounts.filter((acc) => acc !== account);
    setLinkedAccounts(accounts);
  };

  // TODO Change Stepper System
  const changeStepperStatus = (status) => {
    if (status === "next") {
      setStepperStatus(stepperStatus + 1);
    } else {
      setStepperStatus(stepperStatus - 1);
    }
  };

  const addUserObject = (user: PII) => {
    console.log("userObject", user);
    setUserObject(user);
  };
  const getUserObject = () => {
    return userObject;
  };

  return (
    <AppContext.Provider
      value={{
        apiGateway: new ApiGateway(),
        dataWalletGateway: new DataWalletGateway(),
        providerList,
        isSDLDataWalletDetected,
        linkedAccounts,
        getUserAccounts,
        addAccount,
        getUserObject,
        deleteAccount,
        stepperStatus,
        changeStepperStatus,
        addUserObject,
        viewDetailsAccountAddress,
        setViewDetailsAccountAddress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
