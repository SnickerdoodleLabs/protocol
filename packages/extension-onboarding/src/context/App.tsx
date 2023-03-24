/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  AccountAddress,
  BigNumberString,
  DataWalletAddress,
  EarnedReward,
  EChain,
  EVMContractAddress,
  LinkedAccount,
  Signature,
  URLString,
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

export interface ILinkedAccount {
  providerKey: EWalletProviderKeys;
  accountAddress: AccountAddress;
  chain: EChain;
}

export interface IInvitationInfo {
  consentAddress: EVMContractAddress | undefined;
  tokenId: BigNumberString | undefined;
  signature: Signature | undefined;
  // temporary
  rewardImage: URLString | undefined;
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
  earnedRewards: EarnedReward[];
  updateOptedInContracts: () => void;
  optedInContracts: EVMContractAddress[];
  getUserAccounts(): ResultAsync<void, unknown>;
  addAccount(account: ILinkedAccount): void;
  appMode: EAppModes | undefined;
  invitationInfo: IInvitationInfo;
  setInvitationInfo: (invitationInfo: IInvitationInfo) => void;
}

const INITIAL_INVITATION_INFO: IInvitationInfo = {
  consentAddress: undefined,
  tokenId: undefined,
  signature: undefined,
  rewardImage: undefined,
};

declare const window: IWindowWithSdlDataWallet;

const AppContext = createContext<IAppContext>({} as IAppContext);

export const AppContextProvider: FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [providerList, setProviderList] = useState<IProvider[]>([]);
  const [linkedAccounts, setLinkedAccounts] = useState<ILinkedAccount[]>([]);
  const [isSDLDataWalletDetected, setSDLDataWalletDetected] =
    useState<boolean>(false);
  const [appMode, setAppMode] = useState<EAppModes>();
  const { setAlert, setVisualAlert } = useNotificationContext();
  const [invitationInfo, setInvitationInfo] = useState<IInvitationInfo>(
    INITIAL_INVITATION_INFO,
  );
  const [earnedRewards, setEarnedRewards] = useState<EarnedReward[]>([]);
  const [optedInContracts, setUptedInContracts] = useState<
    EVMContractAddress[]
  >([]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (
      localStorage.getItem(LOCAL_STORAGE_SDL_INVITATION_KEY) &&
      !queryParams.get("consentAddress")
    ) {
      return setInvitationInfo(
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_SDL_INVITATION_KEY)!),
      );
    }
    return setInvitationInfo({
      consentAddress: queryParams.get("consentAddress")
        ? EVMContractAddress(queryParams.get("consentAddress")!)
        : undefined,
      tokenId: queryParams.get("tokenId")
        ? BigNumberString(queryParams.get("tokenId")!)
        : undefined,
      signature: queryParams.get("signature")
        ? Signature(queryParams.get("signature")!)
        : undefined,
      rewardImage: queryParams.get("rewardImage")
        ? URLString(queryParams.get("rewardImage")!)
        : undefined,
    });
  }, [JSON.stringify(window.location.search)]);

  useEffect(() => {
    if (invitationInfo.consentAddress) {
      localStorage.setItem(
        LOCAL_STORAGE_SDL_INVITATION_KEY,
        JSON.stringify(invitationInfo),
      );
    }
  }, [JSON.stringify(invitationInfo)]);

  const updateInvitationInfo = (invitationInfo: IInvitationInfo) => {
    setInvitationInfo(invitationInfo);
  };

  useEffect(() => {
    document.addEventListener(
      "SD_WALLET_EXTENSION_CONNECTED",
      onWalletConnected,
    );
    return () => {
      document.removeEventListener(
        "SD_WALLET_EXTENSION_CONNECTED",
        onWalletConnected,
      );
    };
  }, []);

  const checkDataWalletAddressAndInitializeApp = () => {
    window?.sdlDataWallet?.getDataWalletAddress().map((dataWalletAddress) => {
      if (dataWalletAddress) {
        getUserAccounts();
        getEarnedRewards();
        getOptedInContracts();
        subscribeToAccountAdding();
        subscribeToEarnedRewardAdding();
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

  const subscribeToEarnedRewardAdding = () => {
    window?.sdlDataWallet?.on("onEarnedRewardsAdded", onEarnedRewardAdded);
  };

  const onEarnedRewardAdded = (notification: {
    data: { rewards: EarnedReward[] };
  }) => {
    console.warn("EARNED REWARD ADDED", notification);
    getEarnedRewards();
  };

  const updateOptedInContracts = () => {
    getOptedInContracts();
  };

  const getOptedInContracts = () => {
    window.sdlDataWallet.getAcceptedInvitationsCID().map((records) => {
      setUptedInContracts(Object.keys(records) as EVMContractAddress[]);
    });
  };

  const onAccountInitialized = (notification: {
    data: { dataWalletAddress: DataWalletAddress };
  }) => {
    getUserAccounts().map(() => {
      setVisualAlert(true);
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
    setVisualAlert(true);
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
      const _accounts = accounts.map(
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

  const getEarnedRewards = () => {
    return window.sdlDataWallet.getEarnedRewards().map((rewards) => {
      setEarnedRewards(rewards);
    });
  };

  const addAccount = (account: ILinkedAccount) => {
    setLinkedAccounts((prev) => [...prev, account]);
  };

  return (
    <AppContext.Provider
      value={{
        updateOptedInContracts,
        optedInContracts,
        apiGateway: new ApiGateway(),
        dataWalletGateway: new DataWalletGateway(),
        providerList,
        isSDLDataWalletDetected,
        linkedAccounts,
        getUserAccounts,
        appMode,
        earnedRewards,
        addAccount,
        invitationInfo,
        setInvitationInfo: updateInvitationInfo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
