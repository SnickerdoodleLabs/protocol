import { Box, Button, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";

import AccountsCard from "@extension-onboarding/components/AccountsCard";
import WalletProviderCardItem from "@extension-onboarding/components/WalletProviderCardItem";
import { useAppContext } from "@extension-onboarding/Context/App";
import { IProvider } from "@extension-onboarding/services/providers";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import { EWalletProviderKeys } from "@extension-onboarding/constants";

export default function AccountLinking() {
  const { providerList, changeStepperStatus,linkedAccounts } = useAppContext();

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


  const classes = useStyles();
  return (
    <Box style={{ display: "flex" }}>
      <Box>
        <h3 className={classes.linkCryptoText}>Link your Crypto Accounts</h3>
        <p className={classes.manageText}>
          Manage all your personal data from your Snickerdoodle Data Wallet.
        </p>
        <Box>
          <p className={classes.connectText}>Your Wallets</p>

          {detectedProviders.map((provider) => (
            <Box pt={2} key={provider.key}>
              <WalletProviderCardItem provider={provider} />
              {provider.key === EWalletProviderKeys.PHANTOM &&
               <Box mt={2}>
                <Typography>Steps to add multiple Phantom account</Typography>
                </Box>}
            </Box>
          ))}

          <p className={classes.connectText}>Other Supported Wallets</p>

          {unDetectedProviders.map((provider) => (
            <Box pt={2} key={provider.key}>
              <WalletProviderCardItem provider={provider} />
            </Box>
          ))}
          {walletConnect && (
            <>
              <p className={classes.connectText}>
                Connect Your Wallets From Your Mobile Devices
              </p>
              <Box>
                <WalletProviderCardItem provider={walletConnect} />
              </Box>
            </>
          )}
        </Box>
      </Box>

      <Box className={classes.yourLinkedAccountContainer}>
        <p className={classes.yourLinkedAccountText}>Your Linked Account</p>
        <AccountsCard />
      </Box>
      <Box
        style={{
          position: "absolute",
          top: "800px",
          right: "200px",
          marginTop: "140px",
          display: "flex",
        }}
      >
        <Button
          onClick={() => {
            changeStepperStatus("back");
          }}
        >
          Back
        </Button>
        <Box>
          <PrimaryButton
            type="submit"
            disabled = {!linkedAccounts.length}
            onClick={() => {
              changeStepperStatus("next");
            }}
          >
            Next
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
}

const useStyles = makeStyles({
  yourLinkedAccountText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "20px",
    paddingTop: "35px",
  },
  yourLinkedAccountContainer: {
    marginTop: "170px",
    marginLeft: "20px",
  },
  connectText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "20px",
    marginBottom: "0px",
  },
  manageText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 400,
    fontSize: "18px",
    color: "#232039",
  },
  linkCryptoText: {
    fontSize: "36px",
    fontWeight: 400,
    fontStyle: "italic",
    fontFamily: " 'Shrikhand', cursive ",
    marginTop: "100px",
  },
});
