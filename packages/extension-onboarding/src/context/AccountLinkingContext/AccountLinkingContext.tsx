import AccountLinkingIndicator from "@extension-onboarding/components/loadingIndicators/AccountLinking";
import { EModalSelectors } from "@extension-onboarding/components/Modals/";
import LinkAccountModal from "@extension-onboarding/components/Modals/V2/LinkAccountModal";
import { EWalletProviderKeys } from "@extension-onboarding/constants";
import { useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import {
  ELoadingIndicatorType,
  useLayoutContext,
} from "@extension-onboarding/context/LayoutContext";
import useIsMobile from "@extension-onboarding/hooks/useIsMobile";
import { IProvider } from "@extension-onboarding/services/blockChainWalletProviders";
import {
  DiscordProvider,
  TwitterProvider,
} from "@extension-onboarding/services/socialMediaProviders/implementations";
import {
  IDiscordProvider,
  ITwitterProvider,
} from "@extension-onboarding/services/socialMediaProviders/interfaces";
import {
  defaultLanguageCode,
  EChain,
  ESocialType,
  ECoreProxyType,
  EChainTechnology,
} from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  memo,
  lazy,
  Suspense,
} from "react";

export enum EWalletProviderKit {
  SUI = "SUI",
  WEB3_MODAL = "WEB3_MODAL",
}

interface IWalletProviderKit {
  key: EWalletProviderKit;
  label: string;
  icon: string;
  chainTech: EChainTechnology;
  mobileVisible: boolean;
  iframeVisible: boolean;
}

const WalletKitProviderList: IWalletProviderKit[] = [
  {
    key: EWalletProviderKit.WEB3_MODAL,
    label: "Wallet Connect",
    mobileVisible: true,
    chainTech: EChainTechnology.EVM,
    iframeVisible: true,
    icon: "https://seeklogo.com/images/W/walletconnect-logo-EE83B50C97-seeklogo.com.png",
  },
  {
    key: EWalletProviderKit.SUI,
    label: "Suiet Kit",
    iframeVisible: false,
    chainTech: EChainTechnology.Sui,
    icon: "https://framerusercontent.com/images/eDZRos3xvCrlWxmLFr72sFtiyQ.png?scale-down-to=512",
    mobileVisible: false,
  },
];

const LazySuietKit = lazy(
  () => import("@extension-onboarding/context/AccountLinkingContext/SuietKit"),
);

const LazyWalletConnect = lazy(
  () =>
    import("@extension-onboarding/context/AccountLinkingContext/WalletConnect"),
);

interface IAccountLinkingContext {
  detectedProviders: IProvider[];
  unDetectedProviders: IProvider[];
  walletKits: IWalletProviderKit[];
  discordProvider: IDiscordProvider;
  twitterProvider: ITwitterProvider;
  onProviderConnectClick: (
    providerObj: IProvider,
  ) => ResultAsync<void, unknown>;
  onWalletKitConnectClick: (walletKit: EWalletProviderKit) => void;
}

const AccountLinkingContext = createContext<IAccountLinkingContext>(
  {} as IAccountLinkingContext,
);

export const AccountLinkingContextProvider: FC = memo(({ children }) => {
  const { sdlDataWallet } = useDataWalletContext();
  const {
    providerList,
    linkedAccounts,
    linkAccountModalState,
    setLinkerModalClose,
    socialMediaProviderList,
  } = useAppContext();
  const { setModal, setLoadingStatus } = useLayoutContext();
  const isMobile = useIsMobile();
  const [loadSuietKit, setLoadSuietKit] = useState(false);
  const [loadWalletConnect, setLoadWalletConnect] = useState(false);
  const [isSuiOpen, setIsSuiOpen] = useState(false);
  const [walletConnectTrigger, setWalletConnectTrigger] = useState<number>(0);

  const openWarningModal = useCallback(() => {
    setModal({
      modalSelector: EModalSelectors.CONFIRMATION_MODAL,
      onPrimaryButtonClick: () => {},
      customProps: {
        title: "You’ve Already Linked This Account",
        description: `If you want to link different account go to the wallet app you desired, switch to the wallet account you want to link and try linking your switched account by pressing "Link Account" button again.`,
        actionText: "Got it!",
        showCancelButton: false,
      },
    });
  }, [setModal]);

  const startLoadingIndicator = useCallback(() => {
    setLoadingStatus(true, {
      type: ELoadingIndicatorType.COMPONENT,
      component: <AccountLinkingIndicator />,
    });
  }, [setLoadingStatus]);

  const endLoadingIndicator = useCallback(() => {
    setLoadingStatus(false);
  }, [setLoadingStatus]);

  const { detectedProviders, unDetectedProviders } = useMemo(() => {
    if (isMobile) {
      return {
        detectedProviders: [],
        unDetectedProviders: [],
        walletConnect: null,
      };
    }
    return (
      sdlDataWallet.proxyType === ECoreProxyType.IFRAME_BRIDGE
        ? providerList.filter(
            (provider) => provider.key != EWalletProviderKeys.PHANTOM,
          )
        : providerList
    ).reduce(
      (acc, provider) => {
        if (provider.provider.isInstalled) {
          acc.detectedProviders = [...acc.detectedProviders, provider];
        } else {
          acc.unDetectedProviders = [...acc.unDetectedProviders, provider];
        }
        return acc;
      },
      {
        detectedProviders: [],
        unDetectedProviders: [],
      } as {
        detectedProviders: IProvider[];
        unDetectedProviders: IProvider[];
      },
    );
  }, [providerList.length, sdlDataWallet.proxyType, isMobile]);

  const walletKits = useMemo(() => {
    if (sdlDataWallet.proxyType === ECoreProxyType.IFRAME_BRIDGE) {
      return WalletKitProviderList.filter(
        (walletKit) => walletKit.iframeVisible,
      );
    }
    if (isMobile) {
      return WalletKitProviderList.filter(
        (walletKit) => walletKit.mobileVisible,
      );
    }
    return WalletKitProviderList;
  }, [sdlDataWallet.proxyType, isMobile]);

  const discordProvider = useMemo(() => {
    return (socialMediaProviderList.find((provider) => {
      return provider.key === ESocialType.DISCORD;
    })?.provider ?? new DiscordProvider(sdlDataWallet)) as IDiscordProvider;
  }, [socialMediaProviderList.length]);

  const twitterProvider = useMemo(() => {
    return (socialMediaProviderList.find((provider) => {
      return provider.key === ESocialType.TWITTER;
    })?.provider ?? new TwitterProvider(sdlDataWallet)) as ITwitterProvider;
  }, [socialMediaProviderList.length]);

  useEffect(() => {
    setLoadingStatus(false);
  }, [(linkedAccounts ?? []).length]);

  const getChain = (providerKey: EWalletProviderKeys) => {
    return providerKey === EWalletProviderKeys.PHANTOM
      ? EChain.Solana
      : EChain.EthereumMainnet;
  };

  const onProviderConnectClick = useCallback(
    (providerObj: IProvider) => {
      return ResultUtils.combine([
        providerObj.provider.connect(),
        sdlDataWallet.account.getLinkAccountMessage(defaultLanguageCode),
      ]).andThen(([account, message]) => {
        const chain = getChain(providerObj.key);
        if (
          linkedAccounts?.find(
            (linkedAccount) =>
              linkedAccount.sourceAccountAddress ===
              (chain === EChain.EthereumMainnet
                ? account.toLowerCase()
                : account),
          )
        ) {
          openWarningModal();
          return okAsync(undefined);
        }

        return providerObj.provider
          .getSignature(message)
          .andThen((signature) => {
            setLoadingStatus(true, {
              type: ELoadingIndicatorType.COMPONENT,
              component: <AccountLinkingIndicator />,
            });
            return sdlDataWallet.account
              .addAccount(account, signature, defaultLanguageCode, chain)
              .mapErr((e) => {
                console.error(e);
                setLoadingStatus(false);
              });
          });
      });
    },
    [linkedAccounts],
  );

  const onWalletKitConnectClick = useCallback(
    (walletKit: EWalletProviderKit) => {
      if (walletKit === EWalletProviderKit.SUI) {
        if (!loadSuietKit) {
          setLoadSuietKit(true);
        }
        setIsSuiOpen(true);
      }
      if (walletKit === EWalletProviderKit.WEB3_MODAL) {
        if (!loadWalletConnect) {
          setLoadWalletConnect(true);
        }
        setWalletConnectTrigger((prev) => prev + 1);
      }
    },
    [
      loadSuietKit,
      loadWalletConnect,
      setLoadSuietKit,
      setLoadWalletConnect,
      setIsSuiOpen,
      walletConnectTrigger,
      setWalletConnectTrigger,
    ],
  );

  return (
    <AccountLinkingContext.Provider
      value={{
        detectedProviders,
        unDetectedProviders,
        discordProvider,
        twitterProvider,
        onProviderConnectClick,
        onWalletKitConnectClick,
        walletKits,
      }}
    >
      {!!linkAccountModalState && (
        <LinkAccountModal
          chainFilters={linkAccountModalState.chainFilters}
          closeModal={setLinkerModalClose}
        />
      )}
      {loadWalletConnect && walletConnectTrigger && (
        <Suspense fallback={null}>
          <LazyWalletConnect
            triggerConnect={walletConnectTrigger}
            openWarningModal={openWarningModal}
            startLoadingIndicator={startLoadingIndicator}
            endLoadingIndicator={endLoadingIndicator}
          />
        </Suspense>
      )}
      {loadSuietKit && (
        <Suspense fallback={null}>
          <LazySuietKit
            openWarningModal={openWarningModal}
            isSuiOpen={isSuiOpen}
            startLoadingIndicator={startLoadingIndicator}
            endLoadingIndicator={endLoadingIndicator}
            closeSui={() => {
              setIsSuiOpen(false);
            }}
          />
        </Suspense>
      )}
      {children}
    </AccountLinkingContext.Provider>
  );
});

export const useAccountLinkingContext = () => useContext(AccountLinkingContext);
