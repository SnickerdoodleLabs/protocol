import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import {
  ALERT_MESSAGES,
  EWalletProviderKeys,
} from "@extension-onboarding/constants";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import {
  getProviderList,
  IProvider,
} from "@extension-onboarding/services/blockChainWalletProviders";
import { ApiGateway } from "@extension-onboarding/services/implementations/ApiGateway";
import { DataWalletGateway } from "@extension-onboarding/services/implementations/DataWalletGateway";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import {
  DataWalletAddress,
  EVMAccountAddress,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface ILinkedAccount {
  providerKey: EWalletProviderKeys;
  accountAddress: EVMAccountAddress;
}

export enum EAppModes {
  ONBOARDING_FLOW = "ONBOARDING_FLOW",
  AUTHENTICATED_FLOW = "AUTHENTICATED_FLOW",
}

export interface IAppContext {
  apiGateway: ApiGateway;
  dataWalletGateway: DataWalletGateway;
  linkedAccounts: ILinkedAccount[];
  isSDLDataWalletDetected: boolean;
  providerList: IProvider[];
  getUserAccounts(): ResultAsync<void, unknown>;
  addAccount(account: ILinkedAccount): void;
  changeStepperStatus: (status: string) => void;
  appMode: EAppModes | undefined;
  stepperStatus: number;
}

declare const window: IWindowWithSdlDataWallet;

const AppContext = createContext<IAppContext>({} as IAppContext);

export const AppContextProvider: FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [providerList, setProviderList] = useState<IProvider[]>([]);
  const [stepperStatus, setStepperStatus] = useState(0);
  const [linkedAccounts, setLinkedAccounts] = useState<ILinkedAccount[]>([]);
  const [isSDLDataWalletDetected, setSDLDataWalletDetected] =
    useState<boolean>(false);
  const [appMode, setAppMode] = useState<EAppModes>();
  const { setAlert } = useNotificationContext();
  console.log({ appMode });

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

  useEffect(() => {
    if (isSDLDataWalletDetected) {
    }
  }, [isSDLDataWalletDetected]);

  const checkDataWalletAddressAndInitializeApp = () => {
    window?.sdlDataWallet?.getDataWalletAddress().map((dataWalletAddress) => {
      if (dataWalletAddress) {
        getUserAccounts();
        subscribeToAccountAdding();
        if (
          sessionStorage.getItem("appMode") ===
          EAppModes.ONBOARDING_FLOW.toString()
        ) {
          setAppMode(EAppModes.ONBOARDING_FLOW);
        } else {
          setAppMode(EAppModes.AUTHENTICATED_FLOW);
        }
      } else {
        subscribeToAccountInitiating();
        subscribeToAccountAdding();
        sessionStorage.setItem("appMode", EAppModes.ONBOARDING_FLOW.toString());
        setAppMode(EAppModes.ONBOARDING_FLOW);
      }
    });
  };

  const subscribeToAccountAdding = () => {
    window?.sdlDataWallet?.on("onAccountAdded", onAccountAdded);
  };

  const subscribeToAccountInitiating = () => {
    window?.sdlDataWallet?.on("onAccountInitialized", onAccountInitialized);
  };

  const onAccountInitialized = (notification: {
    data: { dataWalletAddress: DataWalletAddress };
  }) => {
    getUserAccounts().map(() => {
      setAlert({
        message: ALERT_MESSAGES.ACCOUNT_ADDED,
        severity: EAlertSeverity.SUCCESS,
      });
    });
  };

  const onAccountAdded = (notification: {
    data: { accountAddress: EVMAccountAddress };
  }) => {
    addAccount({
      accountAddress: notification.data.accountAddress,
      providerKey:
        localStorage.getItem(`${notification.data.accountAddress}`) ?? null,
    } as ILinkedAccount);
    setAlert({
      message: ALERT_MESSAGES.ACCOUNT_ADDED,
      severity: EAlertSeverity.SUCCESS,
    });
  };

  const onWalletConnected = useCallback(() => {
    // Phantom wallet can not initiate window phantom object at time
    setSDLDataWalletDetected(true);
    checkDataWalletAddressAndInitializeApp();
    setTimeout(() => {
      checkDataWalletAddressAndInitializeApp();
      const providerList = getProviderList();
      setProviderList(providerList);
      setIsLoading(false);
    }, 500);
  }, []);

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

  // TODO Change Stepper System
  const changeStepperStatus = (status) => {
    if (status === "next") {
      setStepperStatus(stepperStatus + 1);
    } else {
      setStepperStatus(stepperStatus - 1);
    }
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
        appMode,
        addAccount,
        stepperStatus,
        changeStepperStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
