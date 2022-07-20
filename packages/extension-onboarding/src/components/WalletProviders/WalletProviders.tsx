import { Box, Typography } from "@material-ui/core";
import React, { FC, memo, useCallback, useMemo } from "react";

import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import WalletProviderItem from "@extension-onboarding/components/WalletProviders/WalletProviderItem";
import { useStyles } from "@extension-onboarding/components/WalletProviders/WalletProviders.style";
import {
  ALERT_MESSAGES,
  EWalletProviderKeys,
} from "@extension-onboarding/constants";
import { useAppContext } from "@extension-onboarding/Context/App";
import { useLayoutContext } from "@extension-onboarding/Context/LayoutContext";
import { IProvider } from "@extension-onboarding/services/providers";

const WalletProviders: FC = () => {
  const classes = useStyles();
  const { providerList, linkedAccounts, addAccount } = useAppContext();
  const { setAlert } = useLayoutContext();

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

  const onProviderConnectClick = useCallback((providerObj: IProvider) => {
    if (!providerObj.provider.isInstalled) {
      return window.open(providerObj.installationUrl, "_blank");
    }

    return providerObj.provider.connect().andThen((account) => {
      return window.sdlDataWallet.getUnlockMessage().andThen((message) => {
        return providerObj.provider.getSignature(message).map((signature) => {
          if (
            !linkedAccounts?.find(
              (linkedAccount) => linkedAccount.accountAddress === account,
            )
          ) {
            setAlert({
              message: ALERT_MESSAGES.ACCOUNT_ADDED,
              severity: EAlertSeverity.SUCCESS,
            });
            addAccount({
              key: providerObj.key,
              accountAddress: account,
              name: providerObj.name,
            });
          }
        });
      });
    });
  }, []);

  return (
    <Box>
      <Typography className={classes.sectionTitle}>Your Wallets</Typography>
      {detectedProviders.map((provider) => (
        <Box mt={2} key={provider.key}>
          <WalletProviderItem
            onConnectClick={() => {
              onProviderConnectClick(provider);
            }}
            provider={provider}
          />
          {provider.key === EWalletProviderKeys.PHANTOM && (
            <Box mt={2}>
              <Typography>Steps to add multiple Phantom account</Typography>
            </Box>
          )}
        </Box>
      ))}
      <Typography className={classes.sectionTitle}>
        Other Supported Wallets
      </Typography>
      {unDetectedProviders.map((provider) => (
        <Box mt={2} key={provider.key}>
          <WalletProviderItem
            onConnectClick={() => {
              onProviderConnectClick(provider);
            }}
            provider={provider}
          />
        </Box>
      ))}
      {walletConnect && (
        <>
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
        </>
      )}
    </Box>
  );
};

export default memo(WalletProviders);
