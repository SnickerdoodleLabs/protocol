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
import { PII } from "@extension-onboarding/services/interfaces/objects";

export interface ILinkedAccount {
  name: string;
  key: string;
  accountAddress: string;
  signature?: string; // TODO shouldn't be undefined
}

export interface IAppContext {
  linkedAccounts: ILinkedAccount[];
  providerList: IProvider[];
  addAccount: (account: ILinkedAccount) => void;
  deleteAccount: (account: ILinkedAccount) => void;
  addUserObject: (account: PII) => void;
  getUserObject: () => PII | undefined;
  changeStepperStatus: (status: string) => void;
  stepperStatus: number;
}

const AppContext = createContext<IAppContext>({} as IAppContext);

export const AppContextProvider: FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [providerList, setProviderList] = useState<IProvider[]>([]);
  const [stepperStatus, setStepperStatus] = useState(0);
  const [linkedAccounts, setLinkedAccounts] = useState<ILinkedAccount[]>([]);
  const [userObject, setUserObject] = useState<PII>();
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
      setProviderList(providerList);
      setIsLoading(false);
    }, 500);
  };

  const addAccount = (account: ILinkedAccount) => {
    setLinkedAccounts((prevState) => [...prevState, account]);
  };
  const deleteAccount = (account: ILinkedAccount) => {
   const accounts = linkedAccounts.filter(acc => acc !== account);
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
    console.log("userObject",user)
    setUserObject(user);
  };
  const getUserObject = () => {
   return userObject;
  };

  return (
    <AppContext.Provider
      value={{
        providerList,
        linkedAccounts,
        addAccount,
        getUserObject,
        deleteAccount,
        stepperStatus,
        changeStepperStatus,
        addUserObject
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
