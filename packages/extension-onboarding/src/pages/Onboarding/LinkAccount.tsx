import { Grid, makeStyles } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";

import AccountsCard from "@extension-onboarding/components/AccountsCard";
import WalletProviderCardItem from "@extension-onboarding/components/WalletProviderCardItem";
import { useAppContext } from "@extension-onboarding/Context/App";
import { ProviderContext } from "@extension-onboarding/Context/ProviderContext";
import { IProvider } from "@extension-onboarding/services/providers";

export default function LinkAccount() {
  const { providerList } = useAppContext();
  const [installedProviders, setInstalledProviders] = useState<IProvider[]>([]);

  const installedProvider = useMemo(
    () =>
      providerList?.map((list) => {
        if (list.provider.isInstalled && list.key != "walletConnect") {
          setInstalledProviders((old) => [...old, list]);
        }
      }),
    [providerList],
  );

  const returnYourWallets = () => {
    return installedProviders.map((provider, index) => (
      <Grid style={{ paddingTop: "15px" }} key={provider.key}>
        <WalletProviderCardItem provider={provider} />
      </Grid>
    ));
  };

  const returnOtherWallets = () => {
    return providerList?.map((provider, index) => {
      if (
        !installedProviders.includes(provider) &&
        provider.key != "walletConnect"
      ) {
        return (
          <Grid style={{ paddingTop: "15px" }} key={provider.key}>
            <WalletProviderCardItem provider={provider} />
          </Grid>
        );
      } else {
        return;
      }
    });
  };

  const classes = useStyles();
  return (
    <Grid style={{ display: "flex" }}>
      <Grid>
        <h3 className={classes.linkCryptoText}>Link your Crypto Accounts</h3>
        <p className={classes.manageText}>
          Manage all your personal data from your Snickerdoodle Data Wallet.
        </p>
        <Grid>
          <p className={classes.connectText}>Your Wallets</p>

          {returnYourWallets()}

          <p className={classes.connectText}>Other Supported Wallets</p>

          {returnOtherWallets()}

          <p className={classes.connectText}>
            Connect Your Wallets From Your Mobile Devices
          </p>

          <Grid>
            {/* <ProviderCard provider={{ key: "walletConnect" }} /> */}
          </Grid>
        </Grid>
      </Grid>

      <Grid className={classes.yourLinkedAccountContainer}>
        <p className={classes.yourLinkedAccountText}>Your Linked Account</p>
        <AccountsCard />
      </Grid>
    </Grid>
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
