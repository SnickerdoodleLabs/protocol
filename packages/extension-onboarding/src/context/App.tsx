/* eslint-disable @typescript-eslint/no-non-null-assertion */

import {
  BigNumberString,
  DataWalletAddress,
  EarnedReward,
  EVMContractAddress,
  IpfsCID,
  LinkedAccount,
  Signature,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import { Subscription } from "rxjs";

import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import {
  ALERT_MESSAGES,
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
  getProviderList as getShoppingDataProviderList,
  IShoppingDataWrapper,
} from "@extension-onboarding/services/shoppingDataProvider";
import {
  getProviderList as getSocialMediaProviderList,
  ISocialMediaWrapper,
} from "@extension-onboarding/services/socialMediaProviders";

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
  earnedRewards: EarnedReward[] | undefined;
  updateOptedInContracts: () => void;
  optedInContracts: Map<EVMContractAddress, IpfsCID> | undefined;
  socialMediaProviderList: ISocialMediaWrapper[];
  shoppingDataProviderList: IShoppingDataWrapper[];
  getUserAccounts(): ResultAsync<void, unknown>;
  addAccount(account: LinkedAccount): void;
  appMode: EAppModes | undefined;
  invitationInfo: IInvitationInfo;
  setInvitationInfo: (invitationInfo: IInvitationInfo) => void;
  setLinkerModalOpen: () => void;
  setLinkerModalClose: () => void;
  isLinkerModalOpen: boolean;
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
  const [earnedRewards, setEarnedRewards] = useState<EarnedReward[]>();
  const [optedInContracts, setOptedInContracts] =
    useState<Map<EVMContractAddress, IpfsCID>>();
  const [isLinkerModalOpen, setIsLinkerModalOpen] =
    React.useState<boolean>(false);
  const initialAccountsFetchRef = React.useRef<boolean>(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (!queryParams.has("consentAddress")) {
      return;
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
    if (
      invitationInfo.consentAddress &&
      linkedAccounts.length === 0 &&
      initialAccountsFetchRef.current
    ) {
      setIsLinkerModalOpen(true);
    }
  }, [JSON.stringify(invitationInfo), linkedAccounts]);

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
    setAppMode(EAppModes.AUTH_USER);
  };

  let initializedSubscription: Subscription | null = null;
  let accountAddedSubscription: Subscription | null = null;
  let accountRemovedSubscription: Subscription | null = null;
  let earnedRewardsAddedSubscription: Subscription | null = null;
  let cohortJoinedSubscription: Subscription | null = null;

  // register events
  useEffect(() => {
    if (appMode === EAppModes.UNAUTH_USER) {
      initializedSubscription =
        sdlDataWallet.events.onInitialized.subscribe(onAccountInitialized);
    }
    if (appMode === EAppModes.AUTH_USER) {
      getUserAccounts();
      getOptedInContracts();
      getEarnedRewards();

      initializedSubscription?.unsubscribe();
      accountAddedSubscription =
        sdlDataWallet.events.onAccountAdded.subscribe(onAccountAdded);
      accountRemovedSubscription =
        sdlDataWallet.events.onAccountRemoved.subscribe(onAccountRemoved);
      earnedRewardsAddedSubscription =
        sdlDataWallet.events.onEarnedRewardsAdded.subscribe(
          onEarnedRewardAdded,
        );
      cohortJoinedSubscription =
        sdlDataWallet.events.onCohortJoined.subscribe(onCohortJoined);
    }
    return () => {
      initializedSubscription?.unsubscribe();
      accountAddedSubscription?.unsubscribe();
      accountRemovedSubscription?.unsubscribe();
      earnedRewardsAddedSubscription?.unsubscribe();
      cohortJoinedSubscription?.unsubscribe();
    };
  }, [appMode]);

  // notification handlers
  const onEarnedRewardAdded = (earnedRewards: EarnedReward[]) => {
    getEarnedRewards();
  };

  const onAccountInitialized = (dataWalletAddress: DataWalletAddress) => {
    getUserAccounts().map(() => {
      setVisualAlert(true);
      setAlert({
        message: ALERT_MESSAGES.ACCOUNT_ADDED,
        severity: EAlertSeverity.SUCCESS,
      });
      setAppMode(EAppModes.AUTH_USER);
    });
  };

  const onAccountAdded = (linkedAccount: LinkedAccount) => {
    addAccount(linkedAccount);
    setVisualAlert(true);
    setAlert({
      message: ALERT_MESSAGES.ACCOUNT_ADDED,
      severity: EAlertSeverity.SUCCESS,
    });
  };

  const onAccountRemoved = (linkedAccount: LinkedAccount) => {
    getUserAccounts();
  };

  const onCohortJoined = (consentContractAddress: EVMContractAddress) => {
    getOptedInContracts();
  };

  // can be called after recovery
  const updateOptedInContracts = () => {
    getOptedInContracts();
  };

  const getOptedInContracts = () => {
    sdlDataWallet.getAcceptedInvitationsCID().map((res) => {
      setOptedInContracts(res);
    });
  };

  const getUserAccounts = () => {
    if (!initialAccountsFetchRef.current) {
      initialAccountsFetchRef.current = true;
    }
    return sdlDataWallet.account.getAccounts().map((accounts) => {
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

  return (
    <AppContext.Provider
      value={{
        updateOptedInContracts,
        optedInContracts,
        apiGateway: new ApiGateway(),
        dataWalletGateway: new DataWalletGateway(sdlDataWallet),
        providerList: chainProviderList,
        socialMediaProviderList: getSocialMediaProviderList(sdlDataWallet),
        shoppingDataProviderList: getShoppingDataProviderList(),
        linkedAccounts,
        getUserAccounts,
        appMode,
        earnedRewards,
        addAccount,
        invitationInfo,
        setInvitationInfo: updateInvitationInfo,
        setLinkerModalOpen: () => setIsLinkerModalOpen(true),
        setLinkerModalClose: () => setIsLinkerModalOpen(false),
        isLinkerModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
