import { Button, Grid, makeStyles } from "@material-ui/core";
import React, { useContext, useEffect, useMemo, useState, FC } from "react";
import metamaskLogo from "@extension-onboarding/assets/icons/metamaskSmall.svg";
import phantomLogo from "@extension-onboarding/assets/icons/phantomSmall.svg";
import coinbaseLogo from "@extension-onboarding/assets/icons/coinbaseSmall.svg";
import walletConnectLogo from "@extension-onboarding/assets/icons/walletConnectSmall.svg";
import greenTick from "@extension-onboarding/assets/icons/greenTickCircle.svg";
import { IProvider } from "@extension-onboarding/services/providers";
import { useAppContext } from "@extension-onboarding/Context/App";

export interface ISDLDataWallet {
  // TODO add SDLWallet functions with correct types
  getUnlockMessage(): any;
}

declare global {
  interface Window {
    sdlDataWallet: ISDLDataWallet;
  }
}

interface IProviderCardProps {
  provider: IProvider
}

const ProviderCard: FC<IProviderCardProps> =  ({ provider }: IProviderCardProps) => {
  const { linkedAccounts, addAccount } = useAppContext();


  const classes = useStyles();

  const onClickConnect = (providerObj: IProvider) => {
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
            addAccount({
              key: provider.key,
              accountAddress: account,
              name: provider.name,
            });
          }
          document.dispatchEvent(
            new CustomEvent("SD_ONBOARDING_ACCOUNT_ADDED", {
              detail: {
                account,
                signature,
              },
            }),
          );
        });
      });
    });
  };

  const accountCount = useMemo(()=>{
    return linkedAccounts.reduce((acc, value) => {
      if(value.key === provider.key){
        return acc = acc + 1;
      }
      return acc;
    },0)
  }, [JSON.stringify(linkedAccounts)])

  return (
    <Grid className={classes.accountBoxContainer}>
      <Grid className={classes.providerContainer}>
        <Grid>
          <img
            className={classes.providerLogo}
            src={provider.icon}
          />
          {!!accountCount && (
            <img className={classes.greenTick} src={greenTick} />
          )}
        </Grid>
        <Grid>
          <p className={classes.providerText}>
            {provider.name}
          </p>
        </Grid>

        <Grid>
          <p className={classes.linkedText}>
            {accountCount ? accountCount: "" }
          </p>
        </Grid>

        <Grid className={classes.linkAccountContainer}>
          <Button
            onClick={() => {
              onClickConnect(provider);
            }}
            className={classes.linkAccountButton}
          >
            {provider.provider.isInstalled ? "Install" : "Link Account"}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles({
  accountBoxContainer: {
    width: "680px",
    height: "80px",
    border: "1px solid #ECECEC",
    borderRadius: "12px",
    position: "relative",
  },
  providerContainer: {
    display: "flex",
    alignItems: "center",
  },
  providerText: {
    paddingLeft: "24px",
    paddingTop: "10px",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 500,
    fontSize: "20px",
  },
  providerLogo: {
    paddingTop: "15px",
    paddingLeft: "25px",
  },
  linkedText: {
    paddingLeft: "24px",
    paddingTop: "10px",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 500,
    fontSize: "12px",
    color: "#5D5A74",
    opacity: "0.6",
  },
  linkAccountContainer: {
    position: "absolute",
    right: "20px",
    paddingTop: "10px",
  },
  linkAccountButton: {
    border: "1px solid #B9B6D3",
    width: "142px",
    height: "42px",
    fontFamily: "'Inter'",
    fontWeight: 500,
    fontSize: "12px",
  },
  greenTick: { marginLeft: "-15px" },
});


export default ProviderCard;