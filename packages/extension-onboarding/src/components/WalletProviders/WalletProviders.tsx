import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import WalletProviderItem from "@extension-onboarding/components/WalletProviders/WalletProviderItem";
import { useStyles } from "@extension-onboarding/components/WalletProviders/WalletProviders.style";
import {
  ALERT_MESSAGES,
  EWalletProviderKeys,
} from "@extension-onboarding/constants";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { IProvider } from "@extension-onboarding/services/blockChainWalletProviders";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/sdlDataWallet/interfaces/IWindowWithSdlDataWallet";
import { Box, Typography } from "@material-ui/core";
import {
  IMinimalForwarderRequest,
  MinimalForwarderContract,
} from "@snickerdoodlelabs/contracts-sdk";
import {
  ChainId,
  EVMContractAddress,
  HexString,
  Signature,
} from "@snickerdoodlelabs/objects";
import {
  forwardRequestTypes,
  getMinimalForwarderSigningDomain,
} from "@snickerdoodlelabs/signature-verification";
import { BigNumber, ethers } from "ethers";
import e, { request } from "express";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

declare const window: IWindowWithSdlDataWallet;

const WalletProviders: FC = () => {
  const classes = useStyles();
  const { providerList, linkedAccounts, addAccount } = useAppContext();
  const [pendingMetatransaction, setPendingMetatransaction] = useState();
  const [loading, setIsloading] = useState(false);
  const [selectedProviderKey, setSelectedProviderKey] =
    useState<EWalletProviderKeys>();
  const { setAlert } = useLayoutContext();

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

        provider.getWeb3Provider().andThen((res) => {
          console.log("coming from next call", res?.getSigner());
          console.log("coming from next call", res?.getNetwork());
          return okAsync(undefined);
        });

        console.log("check for exist one", _web3Provider.getNetwork());

        return ResultAsync.fromPromise(
          new MinimalForwarderContract(
            _web3Provider.getSigner(),
            EVMContractAddress("0x5FbDB2315678afecb367f032d93F642f64180aa3"),
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
            value: BigNumber.from(0),
            gas: BigNumber.from(1000000),
            nonce: BigNumber.from(nonce),
            data: HexString(pendingMetatransaction.data.data),
          } as IMinimalForwarderRequest;

          return ResultAsync.fromPromise(
            _web3Provider
              .getSigner()
              ._signTypedData(
                getMinimalForwarderSigningDomain(
                  ChainId(31337),
                  EVMContractAddress(
                    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
                  ),
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
    // // @ts-ignore
    // const currentChainInfo = await provider.getProvider().getNetwork();
    // if (currentChainInfo.chainId != 31337) {
    //   // @ts-ignore
    //   await window.ethereum.request({
    //     method: "wallet_addEthereumChain",
    //     params: [
    //       {
    //         chainId: "0x7A69",
    //         chainName: "Doodle Chain",
    //         rpcUrls: ["http://localhost:8545"],
    //       },
    //     ],
    //   });
    // }
    // // @ts-ignore
    // const nonceResult = await new MinimalForwarderContract(
    //   // @ts-ignore
    //   provider.getSigner(),
    //   EVMContractAddress("0x5FbDB2315678afecb367f032d93F642f64180aa3"),
    // ).getNonce(pendingMetatransaction.data.accountAddress);

    // if (nonceResult.isErr()) {
    //   console.log(nonceResult.error);
    //   return null;
    // }
    // const nonce = nonceResult.value;

    // const value = {
    //   to: pendingMetatransaction.data.contractAddress,
    //   from: pendingMetatransaction.data.accountAddress,
    //   value: BigNumber.from(0),
    //   gas: BigNumber.from(1000000),
    //   nonce: BigNumber.from(nonce),
    //   data: HexString(pendingMetatransaction.data.data),
    // } as IMinimalForwarderRequest;

    // const signature = await provider
    //   // @ts-ignore
    //   .getSigner()
    //   ._signTypedData(
    //     getMinimalForwarderSigningDomain(
    //       ChainId(31337),
    //       EVMContractAddress("0x5FbDB2315678afecb367f032d93F642f64180aa3"),
    //     ),
    //     forwardRequestTypes,
    //     value,
    //   );
    // return window.sdlDataWallet.metatransactionSignatureRequestCallback(
    //   pendingMetatransaction.key,
    //   signature,
    //   nonce,
    // );
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
                addAccount({
                  key: providerObj.key,
                  accountAddress: account,
                  name: providerObj.name,
                });
                if (!linkedAccounts.length) {
                  return window.sdlDataWallet.unlock(account, signature);
                }
                setAlert({
                  message: ALERT_MESSAGES.ACCOUNT_ADDED,
                  severity: EAlertSeverity.SUCCESS,
                });
                return window.sdlDataWallet.addAccount(account, signature);
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
        <Box mt={2} key={provider.key}>
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
