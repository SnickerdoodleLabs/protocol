import {
  defaultLanguageCode,
  EChain,
  ESocialType,
  AccountAddress,
  Signature,
  ECoreProxyType,
} from "@snickerdoodlelabs/objects";
import { ConnectModal, useWallet } from "@suiet/wallet-kit";
import { useWeb3Modal } from "@web3modal/wagmi/react";
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
} from "react";
import { useAccount, useDisconnect, useSignMessage, useConnect } from "wagmi";

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

export enum EWalletProviderKit {
  SUI = "SUI",
  WEB3_MODAL = "WEB3_MODAL",
}

interface IWalletProviderKit {
  key: EWalletProviderKit;
  label: string;
  icon: string;
  mobileVisible: boolean;
  iframeVisible: boolean;
}

const WalletKitProviderList: IWalletProviderKit[] = [
  {
    key: EWalletProviderKit.WEB3_MODAL,
    label: "Wallet Connect",
    mobileVisible: true,
    iframeVisible: true,
    icon: "https://seeklogo.com/images/W/walletconnect-logo-EE83B50C97-seeklogo.com.png",
  },
  {
    key: EWalletProviderKit.SUI,
    label: "Suiet Kit",
    iframeVisible: false,
    icon: "https://framerusercontent.com/images/eDZRos3xvCrlWxmLFr72sFtiyQ.png?scale-down-to=512",
    mobileVisible: false,
  },
];

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
    isLinkerModalOpen,
    setLinkerModalClose,
    socialMediaProviderList,
    shoppingDataProviderList,
  } = useAppContext();
  const { setModal, setLoadingStatus } = useLayoutContext();
  const [isSuiOpen, setIsSuiOpen] = useState(false);
  const suiWallet = useWallet();

  const { open } = useWeb3Modal();

  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data, signMessage, reset, isError } = useSignMessage();

  const isMobile = useIsMobile();

  useEffect(() => {
    if (address && data) {
      setLoadingStatus(true, {
        type: ELoadingIndicatorType.COMPONENT,
        component: <AccountLinkingIndicator />,
      });
      sdlDataWallet.account
        .addAccount(
          address as AccountAddress,
          Signature(data),
          defaultLanguageCode,
          EChain.EthereumMainnet,
        )
        .mapErr((e) => {
          reset();
          disconnect();
          console.log("error adding account", e);
          setLoadingStatus(false);
        })
        .map(() => {
          reset();
          disconnect();
        });
    }
  }, [address, data]);

  useEffect(() => {
    if (isError) {
      reset();
      disconnect();
      setLoadingStatus(false);
    }
  }, [isError]);

  const openWarningModal = () => {
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
  };

  useEffect(() => {
    if (address) {
      if (
        linkedAccounts.find(
          (linkedAccount) =>
            linkedAccount.sourceAccountAddress === address.toLowerCase(),
        )
      ) {
        disconnect();
        return openWarningModal();
      }

      sdlDataWallet.account
        .getLinkAccountMessage(defaultLanguageCode)
        .map((message) => {
          signMessage({ message });
        })
        .mapErr((e) => {
          console.log("error signing message", e);
        });
    }
  }, [address]);

  useEffect(() => {
    if (suiWallet.connected) {
      handleSuiWalletConnect();
    }
  }, [suiWallet.connected]);

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

  const handleSuiWalletConnect = useCallback(() => {
    if (suiWallet.connected) {
      if (
        linkedAccounts?.find(
          (linkedAccount) =>
            linkedAccount.sourceAccountAddress ===
            (suiWallet.account?.address || ""),
        )
      ) {
        setIsSuiOpen(false);
        suiWallet.disconnect();
        return openWarningModal();
      }
      return sdlDataWallet.account
        .getLinkAccountMessage(defaultLanguageCode)
        .andThen((message) => {
          return ResultAsync.fromPromise(
            suiWallet.signMessage({
              message: new TextEncoder().encode(message),
            }),
            () => new Error("Error signing message"),
          ).andThen((signature) => {
            setLoadingStatus(true, {
              type: ELoadingIndicatorType.COMPONENT,
              component: <AccountLinkingIndicator />,
            });
            return sdlDataWallet.account
              .addAccount(
                (suiWallet.account?.address || "") as AccountAddress,
                signature.signature as Signature,
                defaultLanguageCode,
                EChain.Sui,
              )
              .mapErr((e) => {
                console.error(e);
                setLoadingStatus(false);
              })
              .map(() => {
                setIsSuiOpen(false);
                setLoadingStatus(false);
              });
          });
        })
        .mapErr(() => {
          setIsSuiOpen(false);

          suiWallet.disconnect();
        })
        .map(() => {
          suiWallet.disconnect();
        });
    }
    return;
  }, [suiWallet, linkedAccounts]);

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

  const onWalletKitConnectClick = (walletKit: EWalletProviderKit) => {
    if (walletKit === EWalletProviderKit.SUI) {
      setIsSuiOpen(true);
    }
    if (walletKit === EWalletProviderKit.WEB3_MODAL) {
      open({ view: "Connect" });
    }
  };

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
      {isLinkerModalOpen && (
        <LinkAccountModal closeModal={setLinkerModalClose} />
      )}
      <ConnectModal
        onOpenChange={() => {
          setIsSuiOpen(false);
        }}
        open={isSuiOpen}
      />
      {children}
    </AccountLinkingContext.Provider>
  );
});

export const useAccountLinkingContext = () => useContext(AccountLinkingContext);

export interface ISuiCredentials {
  messageBytes: string;
  publicKey: Uint8Array | undefined;
}
