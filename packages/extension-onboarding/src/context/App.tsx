/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import { ALERT_MESSAGES } from "@extension-onboarding/constants";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
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
import {
  EarnedReward,
  EChainTechnology,
  EVMContractAddress,
  IpfsCID,
  LinkedAccount,
} from "@snickerdoodlelabs/objects";
import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
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
  earnedRewards: EarnedReward[];
  optedInContracts: Map<EVMContractAddress, IpfsCID>;
  socialMediaProviderList: ISocialMediaWrapper[];
  addAccount(account: LinkedAccount): void;
  setLinkerModalOpen: (chainFilters?: EChainTechnology[]) => void;
  setLinkerModalClose: () => void;
  linkAccountModalState: ILinkAccountModalState | undefined;
  isDefaultContractOptedIn: boolean;
}

const AppContext = createContext<IAppContext>({} as IAppContext);

export const AppContextProvider: FC = ({ children }) => {
  const { sdlDataWallet } = useDataWalletContext();
  const [chainProviderList, setChainProviderList] = useState<IProvider[]>([]);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>();
  const { setAlert } = useNotificationContext();
  const [earnedRewards, setEarnedRewards] = useState<EarnedReward[]>();
  const [optedInContracts, setOptedInContracts] =
    useState<Map<EVMContractAddress, IpfsCID>>();
  const [linkAccountModalState, setLinkAccountModalState] =
    useState<ILinkAccountModalState>();
  const [appInitFlag, setAppInitFlag] = useState<boolean>(false);
  const [accountLinkingRequested, setAccountLinkingRequested] = useState(false);
  const [defaultContractAddress, setDefaultContractAddress] =
    useState<EVMContractAddress | null>();
  // #region refs
  const initialAccountsFetchRef = useRef<boolean>(false);
  const accountLinkingEventSubscription = useRef<Subscription>();
  const accountAddedSubscription = useRef<Subscription>();
  const accountRemovedSubscription = useRef<Subscription>();
  const earnedRewardsAddedSubscription = useRef<Subscription>();
  const cohortJoinedSubscription = useRef<Subscription>();
  const cohortLeftSubscription = useRef<Subscription>();
  // #endregion

  useEffect(() => {
    setTimeout(() => {
      setChainProviderList(getChainProviderList());
      checkDataWalletAddressAndInitializeApp();
    }, 500);
  }, []);

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

  // register events
  useEffect(() => {
    if (appInitFlag) {
      getUserAccounts();
      getOptedInContracts();
      getEarnedRewards();
      getDefaultContractAddress();

      accountAddedSubscription.current =
        sdlDataWallet.events.onAccountAdded.subscribe(onAccountAdded);
      accountRemovedSubscription.current =
        sdlDataWallet.events.onAccountRemoved.subscribe(onAccountRemoved);
      earnedRewardsAddedSubscription.current =
        sdlDataWallet.events.onEarnedRewardsAdded.subscribe(
          onEarnedRewardAdded,
        );
      cohortJoinedSubscription.current =
        sdlDataWallet.events.onCohortJoined.subscribe(onCohortStatusChanged);
      cohortLeftSubscription.current =
        sdlDataWallet.events.onCohortLeft.subscribe(onCohortStatusChanged);
    }
    return () => {
      accountAddedSubscription.current?.unsubscribe();
      accountRemovedSubscription.current?.unsubscribe();
      earnedRewardsAddedSubscription.current?.unsubscribe();
      cohortJoinedSubscription.current?.unsubscribe();
      cohortLeftSubscription.current?.unsubscribe();
    };
  }, [appInitFlag]);

  // #region event handlers
  const onEarnedRewardAdded = (earnedRewards: EarnedReward[]) => {
    getEarnedRewards();
  };

  const onAccountAdded = useCallback((linkedAccount: LinkedAccount) => {
    addAccount(linkedAccount);
    setAlert({
      message: ALERT_MESSAGES.ACCOUNT_ADDED,
      severity: EAlertSeverity.SUCCESS,
    });
  }, []);

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

  // #endregion

  const isDefaultContractOptedIn = useMemo(() => {
    if (defaultContractAddress === null) {
      return true;
    }
    if (!defaultContractAddress || !optedInContracts) {
      return undefined;
    }
    return optedInContracts.has(defaultContractAddress);
  }, [optedInContracts, defaultContractAddress]);

  // useEffect(() => {
  //   if (
  //     accountLinkingRequested &&
  //     isDefaultContractOptedIn &&
  //     linkedAccounts.length === 0
  //   ) {
  //     setTimeout(() => {
  //       setLinkAccountModalState({ chainFilters: [EChainTechnology.EVM] });
  //       setAccountLinkingRequested(false);
  //     }, 100);
  //   }
  // }, [
  //   accountLinkingRequested,
  //   isDefaultContractOptedIn,
  //   linkedAccounts.length,
  // ]);

  const uiStateReady = useMemo(
    () =>
      isDefaultContractOptedIn !== undefined && linkedAccounts !== undefined,
    [isDefaultContractOptedIn],
  );

  const getDefaultContractAddress = () => {
    return sdlDataWallet.getDefaultContractAddress().map((contractAddress) => {
      setDefaultContractAddress(contractAddress);
    });
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
    setLinkedAccounts((prev) => [...(prev ?? []), account]);
  };

  return (
    <>
      {isDefaultContractOptedIn !== undefined &&
      linkedAccounts !== undefined &&
      optedInContracts !== undefined &&
      earnedRewards !== undefined ? (
        <AppContext.Provider
          value={{
            isDefaultContractOptedIn,
            linkedAccounts,
            optedInContracts,
            apiGateway: new ApiGateway(),
            providerList: chainProviderList,
            socialMediaProviderList: getSocialMediaProviderList(sdlDataWallet),
            earnedRewards,
            addAccount,
            setLinkerModalOpen: (chainFilters = [EChainTechnology.EVM]) =>
              setLinkAccountModalState({ chainFilters }),
            setLinkerModalClose: () => setLinkAccountModalState(undefined),
            linkAccountModalState,
          }}
        >
          {children}
        </AppContext.Provider>
      ) : (
        <Loading />
      )}
    </>
  );
};

export const useAppContext = () => useContext(AppContext);
