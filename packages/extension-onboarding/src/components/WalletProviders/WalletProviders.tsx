import { Box, Typography } from "@material-ui/core";
import {
  IMinimalForwarderRequest,
  MinimalForwarderContract,
} from "@snickerdoodlelabs/contracts-sdk";
import { HexString, Signature } from "@snickerdoodlelabs/objects";
import {
  forwardRequestTypes,
  getMinimalForwarderSigningDomain,
} from "@snickerdoodlelabs/signature-verification";
import { BigNumber } from "ethers";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { EModalSelectors } from "@extension-onboarding/components/Modals/";
import WalletProviderItem from "@extension-onboarding/components/WalletProviders/WalletProviderItem";
import { useStyles } from "@extension-onboarding/components/WalletProviders/WalletProviders.style";
import { EWalletProviderKeys } from "@extension-onboarding/constants";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { IProvider } from "@extension-onboarding/services/blockChainWalletProviders";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";

declare const window: IWindowWithSdlDataWallet;

const WalletProviders: FC = () => {
  const classes = useStyles();
  const { providerList, linkedAccounts, addAccount } = useAppContext();
  const [pendingMetatransaction, setPendingMetatransaction] = useState();
  const [loading, setIsloading] = useState(false);
  const [selectedProviderKey, setSelectedProviderKey] =
    useState<EWalletProviderKeys>();
  const { setModal } = useLayoutContext();

  useEffect(() => {
    window.sdlDataWallet.on(
      "onMetatransactionSignatureRequested",
      setPendingMetatransaction,
    );
  }, []);

  useEffect(() => {
    if (pendingMetatransaction) {
      setIsloading(true);
      handleIncomingMetatransactionSignature(pendingMetatransaction);
    }
  }, [JSON.stringify(pendingMetatransaction ?? "")]);

  const handleIncomingMetatransactionSignature = async (
    pendingMetatransaction,
  ) => {
    const providerObj = providerList.find(
      (provider) => provider.key === selectedProviderKey,
    );
    if (!providerObj) {
      return null;
    }
    const provider = providerObj.provider;
    if (!provider) {
      return null;
    }
    return provider
      .checkAndSwitchToControlChain()
      .mapErr((e) => {
        console.log(e);
        return e;
      })
      .andThen((_web3Provider) => {
        if (!_web3Provider.getSigner()) {
          return errAsync(undefined);
        }
        return ResultAsync.fromPromise(
          new MinimalForwarderContract(
            _web3Provider.getSigner(),
            provider.config.controlChain.metatransactionForwarderAddress,
          ).getNonce(pendingMetatransaction.data.accountAddress),
          (e) => {
            console.log(e);
            return e;
          },
        ).andThen((nonceResult) => {
          if (nonceResult.isErr()) {
            console.log(nonceResult.error);
            return errAsync(undefined);
          }
          const nonce = nonceResult.value;
          const value = {
            to: pendingMetatransaction.data.contractAddress,
            from: pendingMetatransaction.data.accountAddress,
            value: BigNumber.from(pendingMetatransaction.data.value),
            gas: BigNumber.from(pendingMetatransaction.data.gas),
            nonce: BigNumber.from(nonce),
            data: HexString(pendingMetatransaction.data.data),
          } as IMinimalForwarderRequest;

          return ResultAsync.fromPromise(
            _web3Provider
              .getSigner()
              ._signTypedData(
                getMinimalForwarderSigningDomain(
                  provider.config.controlChain.chainId,
                  provider.config.controlChain.metatransactionForwarderAddress,
                ),
                forwardRequestTypes,
                value,
              ),
            (e) => {
              console.log(e);
              return e;
            },
          ).andThen((signature) => {
            return window.sdlDataWallet
              .metatransactionSignatureRequestCallback(
                pendingMetatransaction.key,
                Signature(signature),
                nonce,
              )
              .mapErr((e) => {
                console.log(e);
                return e;
              });
          });
        });
      });
  };

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

  const onProviderConnectClick = useCallback(
    (providerObj: IProvider) => {
      setSelectedProviderKey(providerObj.key);
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

                if (!linkedAccounts.length) {
                  console.log(
                    "No existing linked accounts, calling sdlDataWallet.unlock()",
                  );
                  return window.sdlDataWallet.unlock(account, signature);
                }
                return window.sdlDataWallet.addAccount(account, signature);
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
    <Box>
      {!!detectedProviders.length && (
        <Typography className={classes.sectionTitle}>Your Wallets</Typography>
      )}
      {detectedProviders.map((provider) => (
        <Box mt={2} mb={2} key={provider.key}>
          <WalletProviderItem
            onConnectClick={() => {
              onProviderConnectClick(provider);
            }}
            provider={provider}
          />
          {provider.key === EWalletProviderKeys.PHANTOM && (
            <Box mt={2} mb={5}>
              <Typography className={classes.phantomSteps}>
                Steps to add multiple Phantom account
              </Typography>
            </Box>
          )}
        </Box>
      ))}
      {!!unDetectedProviders.length && (
        <Typography className={classes.sectionTitle}>
          {`${!!detectedProviders.length ? "Other " : ""}Supported Wallets`}
        </Typography>
      )}
      {unDetectedProviders.map((provider) => (
        <Box mt={2} key={provider.key}>
          <WalletProviderItem
            onConnectClick={() => {
              window.open(provider.installationUrl, "_blank");
            }}
            provider={provider}
          />
        </Box>
      ))}
      {walletConnect && (
        <Box mt={2}>
          <Typography className={classes.sectionTitle}>
            Connect Your Wallets From Your Mobile Devices
          </Typography>
          <Box mt={2}>
            <WalletProviderItem
              onConnectClick={() => {
                onProviderConnectClick(walletConnect);
              }}
              provider={walletConnect}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default memo(WalletProviders);
