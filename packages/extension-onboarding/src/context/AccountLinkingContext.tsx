import { EChain } from "@snickerdoodlelabs/objects";
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
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";

declare const window: IWindowWithSdlDataWallet;

interface IAccountLinkingContext {
  detectedProviders: IProvider[];
  unDetectedProviders: IProvider[];
  walletConnect: IProvider | null;
  onProviderConnectClick: (
    providerObj: IProvider,
  ) => ResultAsync<void, unknown>;
}

const AccountLinkingContext = createContext<IAccountLinkingContext>(
  {} as IAccountLinkingContext,
);

export const AccountLinkingContextProvider: FC = ({ children }) => {
  const { providerList, linkedAccounts, isSDLDataWalletDetected } =
    useAppContext();
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
        return window.sdlDataWallet.getUnlockMessage().andThen((message) => {
          return providerObj.provider
            .getSignature(message)
            .andThen((signature) => {
              if (
                !linkedAccounts?.find(
                  (linkedAccount) => linkedAccount.accountAddress === account,
                )
              ) {
                // use it for metadata
                localStorage.setItem(`${account}`, providerObj.key);
                return window.sdlDataWallet
                  .getDataWalletAddress()
                  .andThen((address) => {
                    if (!linkedAccounts.length && !address) {
                      console.log("!address: ", !address);
                      console.log(
                        "!linkedAccounts.length: ",
                        !linkedAccounts.length,
                      );
                      setLoadingStatus(true, {
                        type: ELoadingIndicatorType.COMPONENT,
                        component: <AccountLinkingIndicator />,
                      });
                      return window.sdlDataWallet
                        .unlock(account, signature, getChain(providerObj.key))
                        .mapErr((e) => {
                          setLoadingStatus(false);
                        });
                    }
                    setLoadingStatus(true, {
                      type: ELoadingIndicatorType.COMPONENT,
                      component: <AccountLinkingIndicator />,
                    });
                    return window.sdlDataWallet
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
        onProviderConnectClick,
      }}
    >
      {children}
    </AccountLinkingContext.Provider>
  );
};

export const useAccountLinkingContext = () => useContext(AccountLinkingContext);
