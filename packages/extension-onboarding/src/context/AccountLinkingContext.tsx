import { EChain, ESocialType } from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";
import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";

import AccountLinkingIndicator from "@extension-onboarding/components/loadingIndicators/AccountLinking";
import { EModalSelectors } from "@extension-onboarding/components/Modals/";
import { EWalletProviderKeys } from "@extension-onboarding/constants";
import { useAppContext } from "@extension-onboarding/context/App";
import {
  ELoadingIndicatorType,
  useLayoutContext,
} from "@extension-onboarding/context/LayoutContext";
import { IProvider } from "@extension-onboarding/services/blockChainWalletProviders";
import {
  IDiscordProvider,
  ITwitterProvider,
} from "@extension-onboarding/services/socialMediaProviders/interfaces";
import {
  DiscordProvider,
  TwitterProvider,
} from "@extension-onboarding/services/socialMediaProviders/implementations";
import LinkAccountModal from "@extension-onboarding/components/Modals/LinkAccountModal";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";

interface IAccountLinkingContext {
  detectedProviders: IProvider[];
  unDetectedProviders: IProvider[];
  walletConnect: IProvider | null;
  discordProvider: IDiscordProvider;
  twitterProvider: ITwitterProvider;
  onProviderConnectClick: (
    providerObj: IProvider,
  ) => ResultAsync<void, unknown>;
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
      // setSelectedProviderKey(providerObj.key);
      return providerObj.provider.connect().andThen((account) => {
        return sdlDataWallet.getUnlockMessage().andThen((message) => {
          return providerObj.provider
            .getSignature(message)
            .andThen((signature) => {
              if (
                !linkedAccounts?.find(
                  (linkedAccount) =>
                    linkedAccount.sourceAccountAddress === account,
                )
              ) {
                return sdlDataWallet.metrics
                  .getUnlocked()
                  .andThen((isUnlocked) => {
                    if (!linkedAccounts.length && !isUnlocked) {
                      setLoadingStatus(true, {
                        type: ELoadingIndicatorType.COMPONENT,
                        component: <AccountLinkingIndicator />,
                      });
                      return sdlDataWallet
                        .unlock(account, signature, getChain(providerObj.key))
                        .mapErr((e) => {
                          setLoadingStatus(false);
                        });
                    }
                    setLoadingStatus(true, {
                      type: ELoadingIndicatorType.COMPONENT,
                      component: <AccountLinkingIndicator />,
                    });
                    return sdlDataWallet
                      .addAccount(account, signature, getChain(providerObj.key))
                      .mapErr((e) => {
                        setLoadingStatus(false);
                      });
                  });
              } else {
                setModal({
                  modalSelector: EModalSelectors.PHANTOM_LINKING_STEPS,
                  onPrimaryButtonClick: () => {},
                  customProps: { accountAddress: account },
                });
              }
              return okAsync(undefined);
            });
        });
      });
    },
    [linkedAccounts],
  );

  return (
    <AccountLinkingContext.Provider
      value={{
        detectedProviders,
        unDetectedProviders,
        walletConnect,
        discordProvider,
        twitterProvider,
        onProviderConnectClick,
      }}
    >
      {isLinkerModalOpen && (
        <LinkAccountModal closeModal={setLinkerModalClose} />
      )}
      {children}
    </AccountLinkingContext.Provider>
  );
};

export const useAccountLinkingContext = () => useContext(AccountLinkingContext);
