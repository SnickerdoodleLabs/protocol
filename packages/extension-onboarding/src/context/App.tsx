/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import { ALERT_MESSAGES } from "@extension-onboarding/constants";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import { EOnboardingState } from "@extension-onboarding/objects/interfaces/IUState";
import {
  getProviderList as getChainProviderList,
  IProvider,
} from "@extension-onboarding/services/blockChainWalletProviders";
import { ApiGateway } from "@extension-onboarding/services/implementations/ApiGateway";
import {
  getProviderList as getSocialMediaProviderList,
  ISocialMediaWrapper,
} from "@extension-onboarding/services/socialMediaProviders";
import Loading from "@extension-onboarding/setupScreens/Loading";
import { UIStateUtils } from "@extension-onboarding/utils/UIStateUtils";
import {
  BigNumberString,
  EarnedReward,
  EChainTechnology,
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
interface ILinkAccountModalState {
  chainFilters?: EChainTechnology[];
}

interface ILinkAccountModalState {
  chainFilters?: EChainTechnology[];
}
export interface IAppContext {
  apiGateway: ApiGateway;
  linkedAccounts: LinkedAccount[];
  providerList: IProvider[];
  earnedRewards: EarnedReward[] | undefined;
  optedInContracts: Map<EVMContractAddress, IpfsCID> | undefined;
  socialMediaProviderList: ISocialMediaWrapper[];
  addAccount(account: LinkedAccount): void;
  setLinkerModalOpen: (chainFilters?: EChainTechnology[]) => void;
  setLinkerModalClose: () => void;
  linkAccountModalState: ILinkAccountModalState | undefined;
  onboardingState: EOnboardingState | undefined;
  uiStateUtils: UIStateUtils;
}

const AppContext = createContext<IAppContext>({} as IAppContext);

export const AppContextProvider: FC = ({ children }) => {
  const { sdlDataWallet } = useDataWalletContext();
  const [chainProviderList, setChainProviderList] = useState<IProvider[]>([]);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const { setAlert } = useNotificationContext();
  const [earnedRewards, setEarnedRewards] = useState<EarnedReward[]>();
  const [optedInContracts, setOptedInContracts] =
    useState<Map<EVMContractAddress, IpfsCID>>();
  const [linkAccountModalState, setLinkAccountModalState] =
    React.useState<ILinkAccountModalState>();
  const initialAccountsFetchRef = React.useRef<boolean>(false);
  const accountLinkingEventSubscription = React.useRef<Subscription>();
  const onboardingStateEventSubscription = React.useRef<Subscription>();
  const uiStateUtilsRef = React.useRef<UIStateUtils>();
  const [appInitFlag, setAppInitFlag] = useState<boolean>(false);
  const [uiStateUtils, setUiStateUtils] = useState<UIStateUtils>();
  const [onboardingState, _setonboardingState] = useState<EOnboardingState>();
  const [accountLinkingRequested, setAccountLinkingRequested] = useState(false);

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
      accountLinkingRequested &&
      onboardingState === EOnboardingState.COMPLETED &&
      linkedAccounts.length === 0
    ) {
      setTimeout(() => {
        setLinkAccountModalState({ chainFilters: [EChainTechnology.EVM] });
        setAccountLinkingRequested(false);
      }, 100);
    }
  }, [accountLinkingRequested, onboardingState, linkedAccounts.length]);

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

  useEffect(() => {
    if (appInitFlag) {
      accountLinkingEventSubscription.current =
        sdlDataWallet.formFactorEvents.onLinkAccountRequested.subscribe(() => {
          setAccountLinkingRequested(true);
        });
    }
    return () => {
      accountLinkingEventSubscription.current?.unsubscribe();
    };
  }, [appInitFlag]);

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
      const uiStateUtils = new UIStateUtils(uiState, (state: JSONString) => {
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
    setAlert({
      message: ALERT_MESSAGES.ACCOUNT_REMOVED,
      severity: EAlertSeverity.SUCCESS,
    });
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
        providerList: chainProviderList,
        socialMediaProviderList: getSocialMediaProviderList(sdlDataWallet),
        linkedAccounts,
        earnedRewards,
        addAccount,
        setLinkerModalOpen: (chainFilters = [EChainTechnology.EVM]) =>
          setLinkAccountModalState({ chainFilters }),
        setLinkerModalClose: () => setLinkAccountModalState(undefined),
        linkAccountModalState,
      }}
    >
      {uiStateReady ? children : <Loading />}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
