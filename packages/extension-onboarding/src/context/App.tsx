/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import {
  ALERT_MESSAGES,
  EWalletProviderKeys,
  LOCAL_STORAGE_SDL_INVITATION_KEY,
} from "@extension-onboarding/constants";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import {
  getProviderList as getChainProviderList,
  IProvider,
} from "@extension-onboarding/services/blockChainWalletProviders";
import { ApiGateway } from "@extension-onboarding/services/implementations/ApiGateway";
import { DataWalletGateway } from "@extension-onboarding/services/implementations/DataWalletGateway";
import {
  getProviderList as getSocialMediaProviderList,
  ISocialMediaWrapper,
} from "@extension-onboarding/services/socialMediaProviders";
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
  AccountAddedNotification,
  AccountInitializedNotification,
  AccountRemovedNotification,
  CohortJoinedNotification,
  EarnedRewardsAddedNotification,
  ENotificationTypes,
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

export interface IInvitationInfo {
  consentAddress: EVMContractAddress | undefined;
  tokenId: BigNumberString | undefined;
  signature: Signature | undefined;
  // temporary
  rewardImage: URLString | undefined;
}

export enum EAppModes {
  AUTH_USER = "AUTH",
  UNAUTH_USER = "UNAUTH",
}

export interface IAppContext {
  apiGateway: ApiGateway;
  dataWalletGateway: DataWalletGateway;
  linkedAccounts: LinkedAccount[];
  providerList: IProvider[];
  earnedRewards: EarnedReward[];
  updateOptedInContracts: () => void;
  optedInContracts: EVMContractAddress[];
  socialMediaProviderList: ISocialMediaWrapper[];
  getUserAccounts(): ResultAsync<void, unknown>;
  addAccount(account: LinkedAccount): void;
  appMode: EAppModes | undefined;
  invitationInfo: IInvitationInfo;
  setInvitationInfo: (invitationInfo: IInvitationInfo) => void;
  isProductTourCompleted: boolean;
  completeProductTour: () => void;
  setLinkerModalOpen: () => void;
  setLinkerModalClose: () => void;
  isLinkerModalOpen: boolean;
  disablePopups: () => void;
  popupsDisabled: boolean;
}

const INITIAL_INVITATION_INFO: IInvitationInfo = {
  consentAddress: undefined,
  tokenId: undefined,
  signature: undefined,
  rewardImage: undefined,
};

const AppContext = createContext<IAppContext>({} as IAppContext);

export const AppContextProvider: FC = ({ children }) => {
  const { sdlDataWallet } = useDataWalletContext();
  const [chainProviderList, setChainProviderList] = useState<IProvider[]>([]);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [appMode, setAppMode] = useState<EAppModes>();
  const { setAlert, setVisualAlert } = useNotificationContext();
  const [invitationInfo, setInvitationInfo] = useState<IInvitationInfo>(
    INITIAL_INVITATION_INFO,
  );
  const [earnedRewards, setEarnedRewards] = useState<EarnedReward[]>([]);
  const [optedInContracts, setUptedInContracts] = useState<
    EVMContractAddress[]
  >([]);
  const [isProductTourCompleted, setIsProductTourCompleted] = useState<boolean>(
    localStorage.getItem("SDL_UserCompletedIntro") === "COMPLETED",
  );
  const [isLinkerModalOpen, setIsLinkerModalOpen] =
    React.useState<boolean>(false);
  const [popupsDisabled, setPopupsDisabled] = useState<boolean>(false);

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
    setTimeout(() => {
      setChainProviderList(getChainProviderList());
      checkDataWalletAddressAndInitializeApp();
    }, 500);
  }, []);

  const checkDataWalletAddressAndInitializeApp = () => {
    sdlDataWallet.getDataWalletAddress().map((dataWalletAddress) => {
      if (dataWalletAddress) {
        setAppMode(EAppModes.AUTH_USER);
      } else {
        setAppMode(EAppModes.UNAUTH_USER);
      }
    });
  };

  // register events
  useEffect(() => {
    if (appMode === EAppModes.UNAUTH_USER) {
      sdlDataWallet.on(
        ENotificationTypes.ACCOUNT_INITIALIZED,
        onAccountInitialized,
      );
    }
    if (appMode === EAppModes.AUTH_USER) {
      getUserAccounts();
      getOptedInContracts();
      getEarnedRewards();
      sdlDataWallet.off(
        ENotificationTypes.ACCOUNT_INITIALIZED,
        onAccountInitialized,
      );
      sdlDataWallet.on(ENotificationTypes.ACCOUNT_ADDED, onAccountAdded);
      sdlDataWallet.on(ENotificationTypes.ACCOUNT_REMOVED, onAccountRemoved);
      sdlDataWallet.on(
        ENotificationTypes.EARNED_REWARDS_ADDED,
        onEarnedRewardAdded,
      );
      sdlDataWallet.on(ENotificationTypes.COHORT_JOINED, onCohortJoined);
    }
    return () => {
      sdlDataWallet.off(
        ENotificationTypes.ACCOUNT_INITIALIZED,
        onAccountInitialized,
      );
      sdlDataWallet.off(ENotificationTypes.ACCOUNT_ADDED, onAccountAdded);
      sdlDataWallet.off(ENotificationTypes.ACCOUNT_REMOVED, onAccountRemoved);
      sdlDataWallet.off(
        ENotificationTypes.EARNED_REWARDS_ADDED,
        onEarnedRewardAdded,
      );
    };
  }, [appMode]);

  // notification handlers
  const onEarnedRewardAdded = (
    notification: EarnedRewardsAddedNotification,
  ) => {
    getEarnedRewards();
  };

  const onAccountInitialized = (
    notification: AccountInitializedNotification,
  ) => {
    getUserAccounts().map(() => {
      setVisualAlert(true);
      setAlert({
        message: ALERT_MESSAGES.ACCOUNT_ADDED,
        severity: EAlertSeverity.SUCCESS,
      });
      setAppMode(EAppModes.AUTH_USER);
    });
  };

  const onAccountAdded = (notification: AccountAddedNotification) => {
    addAccount(notification.data);
    setVisualAlert(true);
    setAlert({
      message: ALERT_MESSAGES.ACCOUNT_ADDED,
      severity: EAlertSeverity.SUCCESS,
    });
  };

  const onAccountRemoved = (notification: AccountRemovedNotification) => {
    getUserAccounts();
  };

  const onCohortJoined = (notification: CohortJoinedNotification) => {
    getOptedInContracts();
  };

  // can be called after recovery
  const updateOptedInContracts = () => {
    getOptedInContracts();
  };

  const getOptedInContracts = () => {
    sdlDataWallet.getAcceptedInvitationsCID().map((records) => {
      setUptedInContracts(Object.keys(records) as EVMContractAddress[]);
    });
  };

  const getUserAccounts = () => {
    return sdlDataWallet.getAccounts().map((accounts) => {
      setLinkedAccounts((prev) =>
        [...new Set(accounts.map((o) => JSON.stringify(o)))].map((s) =>
          JSON.parse(s),
        ),
      );
    });
  };

  const getEarnedRewards = () => {
    return sdlDataWallet.getEarnedRewards().map((rewards) => {
      setEarnedRewards(rewards);
    });
  };

  const addAccount = (account: LinkedAccount) => {
    setLinkedAccounts((prev) => [...prev, account]);
  };

  const completeProductTour = () => {
    setIsProductTourCompleted(true);
  };

  return (
    <AppContext.Provider
      value={{
        updateOptedInContracts,
        optedInContracts,
        apiGateway: new ApiGateway(),
        dataWalletGateway: new DataWalletGateway(sdlDataWallet),
        providerList: chainProviderList,
        socialMediaProviderList: getSocialMediaProviderList(sdlDataWallet),
        linkedAccounts,
        getUserAccounts,
        appMode,
        earnedRewards,
        addAccount,
        invitationInfo,
        setInvitationInfo: updateInvitationInfo,
        isProductTourCompleted,
        completeProductTour,
        setLinkerModalOpen: () => setIsLinkerModalOpen(true),
        setLinkerModalClose: () => setIsLinkerModalOpen(false),
        isLinkerModalOpen,
        popupsDisabled,
        disablePopups: () => setPopupsDisabled(true),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
