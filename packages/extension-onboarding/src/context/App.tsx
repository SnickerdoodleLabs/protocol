/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import { ALERT_MESSAGES } from "@extension-onboarding/constants";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import {
  EOnboardingState,
  IUIState,
} from "@extension-onboarding/objects/interfaces/IUState";
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
  BigNumberString,
  EarnedReward,
  EVMContractAddress,
  IpfsCID,
  JSONString,
  LinkedAccount,
  Signature,
  URLString,
} from "@snickerdoodlelabs/objects";
import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { Subscription } from "rxjs";
import Loading from "@extension-onboarding/setupScreens/Loading";
import { okAsync } from "neverthrow";
import { UIStateUtils } from "@extension-onboarding/utils/UIStateUtils";

export interface IInvitationInfo {
  consentAddress: EVMContractAddress | undefined;
  tokenId: BigNumberString | undefined;
  signature: Signature | undefined;
  // temporary
  rewardImage: URLString | undefined;
}

export interface IAppContext {
  apiGateway: ApiGateway;
  dataWalletGateway: DataWalletGateway;
  linkedAccounts: LinkedAccount[];
  providerList: IProvider[];
  earnedRewards: EarnedReward[] | undefined;
  optedInContracts: Map<EVMContractAddress, IpfsCID> | undefined;
  socialMediaProviderList: ISocialMediaWrapper[];
  addAccount(account: LinkedAccount): void;
  invitationInfo: IInvitationInfo;
  setInvitationInfo: (invitationInfo: IInvitationInfo) => void;
  setLinkerModalOpen: () => void;
  setLinkerModalClose: () => void;
  isLinkerModalOpen: boolean;
  onboardingState: EOnboardingState | undefined;
  uiStateUtils: UIStateUtils;
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
  const onboardingStateEventSubscription = React.useRef<Subscription>();
  const uiStateUtilsRef = React.useRef<UIStateUtils>();
  const [appInitFlag, setAppInitFlag] = useState<boolean>(false);
  const [uiStateUtils, setUiStateUtils] = useState<UIStateUtils>();
  const [onboardingState, _setonboardingState] = useState<EOnboardingState>();

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
    if (uiStateUtils && !onboardingStateEventSubscription.current) {
      uiStateUtilsRef.current = uiStateUtils;
      onboardingStateEventSubscription.current =
        uiStateUtils.onOnboardingStateUpdated.subscribe(setOnboardingState);
    }
    return () => {
      onboardingStateEventSubscription.current?.unsubscribe();
    };
  }, [!!uiStateUtils]);

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

  useEffect(() => {
    if (initialAccountsFetchRef.current && !onboardingState) {
      getUiState();
    }
  }, [linkedAccounts, onboardingState]);

  const setOnboardingState = (onboardingState: EOnboardingState) => {
    _setonboardingState(onboardingState);
  };

  const checkDataWalletAddressAndInitializeApp = () => {
    setAppInitFlag(true);
  };

  let accountAddedSubscription: Subscription | null = null;
  let accountRemovedSubscription: Subscription | null = null;
  let earnedRewardsAddedSubscription: Subscription | null = null;
  let cohortJoinedSubscription: Subscription | null = null;
  let cohortLeftSubscription: Subscription | null = null;

  // register events
  useEffect(() => {
    if (appInitFlag) {
      getUserAccounts();
      getOptedInContracts();
      getEarnedRewards();

      accountAddedSubscription =
        sdlDataWallet.events.onAccountAdded.subscribe(onAccountAdded);
      accountRemovedSubscription =
        sdlDataWallet.events.onAccountRemoved.subscribe(onAccountRemoved);
      earnedRewardsAddedSubscription =
        sdlDataWallet.events.onEarnedRewardsAdded.subscribe(
          onEarnedRewardAdded,
        );
      cohortJoinedSubscription = sdlDataWallet.events.onCohortJoined.subscribe(
        onCohortStatusChanged,
      );
      cohortLeftSubscription = sdlDataWallet.events.onCohortLeft.subscribe(
        onCohortStatusChanged,
      );
    }
    return () => {
      accountAddedSubscription?.unsubscribe();
      accountRemovedSubscription?.unsubscribe();
      earnedRewardsAddedSubscription?.unsubscribe();
      cohortJoinedSubscription?.unsubscribe();
      cohortLeftSubscription?.unsubscribe();
    };
  }, [appInitFlag]);

  // notification handlers
  const onEarnedRewardAdded = (earnedRewards: EarnedReward[]) => {
    getEarnedRewards();
  };

  const onAccountAdded = useCallback(
    (linkedAccount: LinkedAccount) => {
      addAccount(linkedAccount);
      uiStateUtilsRef.current?.onAccountLinked();
      setAlert({
        message: ALERT_MESSAGES.ACCOUNT_ADDED,
        severity: EAlertSeverity.SUCCESS,
      });
    },
    [uiStateUtils],
  );

  const getUiState = () => {
    return sdlDataWallet.getUIState().map((uiState) => {
      console.log("UI State", uiState, "coming from getUiState");
      const uiStateUtils = new UIStateUtils(uiState, (state: JSONString) => {
        console.log("UI State", state, "coming from setUIState");
        return sdlDataWallet.setUIState(state);
      });
      setUiStateUtils(uiStateUtils);
      setOnboardingState(uiStateUtils.getOnboardingState());
    });
  };

  const uiStateReady = useMemo(
    () => !!onboardingState && !!uiStateUtils,
    [!!onboardingState, !!uiStateUtils],
  );

  const onAccountRemoved = (linkedAccount: LinkedAccount) => {
    getUserAccounts();
  };

  const onCohortStatusChanged = (
    consentContractAddress: EVMContractAddress,
  ) => {
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
        onboardingState: onboardingState as EOnboardingState,
        uiStateUtils: uiStateUtils as UIStateUtils,
        optedInContracts,
        apiGateway: new ApiGateway(),
        dataWalletGateway: new DataWalletGateway(sdlDataWallet),
        providerList: chainProviderList,
        socialMediaProviderList: getSocialMediaProviderList(sdlDataWallet),
        linkedAccounts,
        earnedRewards,
        addAccount,
        invitationInfo,
        setInvitationInfo: updateInvitationInfo,
        setLinkerModalOpen: () => setIsLinkerModalOpen(true),
        setLinkerModalClose: () => setIsLinkerModalOpen(false),
        isLinkerModalOpen,
      }}
    >
      {uiStateReady ? children : <Loading />}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
