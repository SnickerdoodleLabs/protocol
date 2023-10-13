import {
  defaultLanguageCode,
  EChain,
  ESocialType,
  AccountAddress,
  Signature,
} from "@snickerdoodlelabs/objects";
import { ConnectModal, useWallet } from "@suiet/wallet-kit";
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
} from "react";

import AccountLinkingIndicator from "@extension-onboarding/components/loadingIndicators/AccountLinking";
import { EModalSelectors } from "@extension-onboarding/components/Modals/";
import LinkAccountModal from "@extension-onboarding/components/Modals/LinkAccountModal";
import { EWalletProviderKeys } from "@extension-onboarding/constants";
import { useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import {
  ELoadingIndicatorType,
  useLayoutContext,
} from "@extension-onboarding/context/LayoutContext";
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
}

interface IAccountLinkingContext {
  detectedProviders: IProvider[];
  unDetectedProviders: IProvider[];
  walletConnect: IProvider | null;
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

export const AccountLinkingContextProvider: FC = ({ children }) => {
  const { sdlDataWallet } = useDataWalletContext();
  const {
    providerList,
    linkedAccounts,
    isLinkerModalOpen,
    setLinkerModalClose,
    socialMediaProviderList,
  } = useAppContext();
  const { setModal, setLoadingStatus } = useLayoutContext();
  const [isSuiOpen, setIsSuiOpen] = useState(false);
  const suiWallet = useWallet();

  useEffect(() => {}, [suiWallet.connected]);

  useEffect(() => {
    if (suiWallet.connected) {
      handleSuiWalletConnect();
    }
  }, [suiWallet.connected]);

  const { detectedProviders, unDetectedProviders, walletConnect } =
    useMemo(() => {
      return providerList.reduce(
        (acc, provider) => {
          if (provider.key === EWalletProviderKeys.WALLET_CONNECT) {
            acc.walletConnect = provider;
          } else if (provider.provider.isInstalled) {
            acc.detectedProviders = [...acc.detectedProviders, provider];
          } else {
            acc.unDetectedProviders = [...acc.unDetectedProviders, provider];
          }
          return acc;
        },
        {
          detectedProviders: [],
          unDetectedProviders: [],
          walletConnect: null,
        } as {
          detectedProviders: IProvider[];
          unDetectedProviders: IProvider[];
          walletConnect: IProvider | null;
        },
      );
    }, [providerList.length]);

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
      return sdlDataWallet.account
        .getLinkAccountMessage(defaultLanguageCode)
        .andThen((message) => {
          return ResultAsync.fromPromise(
            suiWallet.signMessage({
              message: new TextEncoder().encode(message),
            }),
            () => new Error("Error signing message"),
          ).andThen((signature) => {
            if (
              !linkedAccounts?.find(
                (linkedAccount) =>
                  linkedAccount.sourceAccountAddress ===
                  (suiWallet.account?.address || ""),
              )
            ) {
              setLoadingStatus(true, {
                type: ELoadingIndicatorType.COMPONENT,
                component: <AccountLinkingIndicator />,
              });
              const addr = (suiWallet.account?.address || "") as AccountAddress;
              const sig = signature.signature as Signature;
              console.log("wallet address: " + addr);
              console.log("sui signature: " + JSON.stringify(signature));
              console.log("sui sig: " + sig);

              console.log("wallet account: " + suiWallet.account);
              const publicKey = suiWallet.account?.publicKey;
              console.log("wallet publicKey: " + publicKey);
              const suiReg: ISuiCredentials = {
                messageBytes: signature.messageBytes,
                publicKey: suiWallet.account?.publicKey,
              };

              return (
                // okAsync(undefined)
                // @TODO use that function with correct params
                sdlDataWallet.account
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
                  })
              );
            }
            // The new account is already linked
            setModal({
              modalSelector: EModalSelectors.PHANTOM_LINKING_STEPS,
              onPrimaryButtonClick: () => {},
              customProps: { accountAddress: suiWallet.account?.address || "" },
            });
            return okAsync(undefined);
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
      // setSelectedProviderKey(providerObj.key);
      return ResultUtils.combine([
        providerObj.provider.connect(),
        sdlDataWallet.account.getLinkAccountMessage(defaultLanguageCode),
      ]).andThen(([account, message]) => {
        return providerObj.provider
          .getSignature(message)
          .andThen((signature) => {
            // If the new chosen account is not already linked
            if (
              !linkedAccounts?.find(
                (linkedAccount) =>
                  linkedAccount.sourceAccountAddress === account,
              )
            ) {
              // use it for metadata
              localStorage.setItem(`${account}`, providerObj.key);
              setLoadingStatus(true, {
                type: ELoadingIndicatorType.COMPONENT,
                component: <AccountLinkingIndicator />,
              });
              return sdlDataWallet.account
                .addAccount(
                  account,
                  signature,
                  defaultLanguageCode,
                  getChain(providerObj.key),
                )
                .mapErr((e) => {
                  console.error(e);
                  setLoadingStatus(false);
                });
            }

            // The new account is already linked
            setModal({
              modalSelector: EModalSelectors.PHANTOM_LINKING_STEPS,
              onPrimaryButtonClick: () => {},
              customProps: { accountAddress: account },
            });
            return okAsync(undefined);
          });
      });
    },
    [linkedAccounts],
  );

  const onWalletKitConnectClick = (walletKit: EWalletProviderKit) => {
    if (walletKit === EWalletProviderKit.SUI) {
      setIsSuiOpen(true);
    }
  };

  return (
    <AccountLinkingContext.Provider
      value={{
        detectedProviders,
        unDetectedProviders,
        walletConnect,
        discordProvider,
        twitterProvider,
        onProviderConnectClick,
        onWalletKitConnectClick,
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
};

export const useAccountLinkingContext = () => useContext(AccountLinkingContext);

export interface ISuiCredentials {
  messageBytes: string;
  publicKey: Uint8Array | undefined;
}
