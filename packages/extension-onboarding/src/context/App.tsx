import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import {
  ALERT_MESSAGES,
  EWalletProviderKeys,
  LOCAL_STORAGE_SDL_INVITATION_KEY,
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
  AccountAddress,
  BigNumberString,
  DataWalletAddress,
  EChain,
  EVMContractAddress,
  LinkedAccount,
  Signature,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface ILinkedAccount {
  providerKey: EWalletProviderKeys;
  accountAddress: AccountAddress;
  chain: EChain;
}

export interface IInvitationInfo {
  consentAddress: EVMContractAddress | undefined;
  tokenId: BigNumberString | undefined;
  signature: Signature | undefined;
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
  invitationInfo: IInvitationInfo;
}

declare const window: IWindowWithSdlDataWallet;

const AppContext = createContext<IAppContext>({} as IAppContext);

export const AppContextProvider: FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [providerList, setProviderList] = useState<IProvider[]>([]);
  const [stepperStatus, setStepperStatus] = useState(
    parseInt(sessionStorage.getItem("onboardingCurrentScreenIndex") ?? "0"),
  );
  const [linkedAccounts, setLinkedAccounts] = useState<ILinkedAccount[]>([]);
  const [isSDLDataWalletDetected, setSDLDataWalletDetected] =
    useState<boolean>(false);
  const [appMode, setAppMode] = useState<EAppModes>();
  const { setAlert } = useNotificationContext();

  const invitationInfo: IInvitationInfo = useMemo(() => {
    const queryParams = new URLSearchParams(window.location.search);
    return {
      consentAddress: queryParams.get("consentAddress")
        ? EVMContractAddress(queryParams.get("consentAddress")!)
        : undefined,
      tokenId: queryParams.get("tokenId")
        ? BigNumberString(queryParams.get("tokenId")!)
        : undefined,
      signature: queryParams.get("signature")
        ? Signature(queryParams.get("signature")!)
        : undefined,
    };
  }, [window]);

  useEffect(() => {
    if (invitationInfo.consentAddress) {
      localStorage.setItem(
        LOCAL_STORAGE_SDL_INVITATION_KEY,
        JSON.stringify(invitationInfo),
      );
    }
  }, [invitationInfo]);

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
        subscribeToAccountRemoving();
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

  const subscribeToAccountRemoving = () => {
    window?.sdlDataWallet?.on("onAccountRemoved", onAccountRemoved);
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
    data: { linkedAccount: LinkedAccount };
  }) => {
    addAccount({
      accountAddress: notification.data.linkedAccount.sourceAccountAddress,
      providerKey:
        localStorage.getItem(
          `${notification.data.linkedAccount.sourceAccountAddress}`,
        ) ?? null,
      chain: notification.data.linkedAccount.sourceChain,
    } as ILinkedAccount);
    setAlert({
      message: ALERT_MESSAGES.ACCOUNT_ADDED,
      severity: EAlertSeverity.SUCCESS,
    });
  };

  const onAccountRemoved = (notification: {
    data: { linkedAccount: LinkedAccount };
  }) => {
    getUserAccounts();
  };

  const onWalletConnected = useCallback(() => {
    // Phantom wallet can not initiate window phantom object at time
    setSDLDataWalletDetected(true);
    setTimeout(() => {
      checkDataWalletAddressAndInitializeApp();
      const providerList = getProviderList();
      setProviderList(providerList);
      setIsLoading(false);
    }, 500);
  }, []);

  const getUserAccounts = () => {
    return window.sdlDataWallet.getAccounts().map((accounts) => {
      const _accounts: ILinkedAccount[] = accounts.map(
        (account) =>
          ({
            accountAddress: account.sourceAccountAddress,
            providerKey:
              localStorage.getItem(`${account.sourceAccountAddress}`) ?? null,
            chain: account.sourceChain,
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
      sessionStorage.setItem(
        "onboardingCurrentScreenIndex",
        `${stepperStatus + 1}`,
      );
      setStepperStatus(stepperStatus + 1);
    } else {
      sessionStorage.setItem(
        "onboardingCurrentScreenIndex",
        `${stepperStatus - 1}`,
      );
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
        invitationInfo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
