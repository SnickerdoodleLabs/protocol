import { Button, Grid, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import metamaskLogo from "@extension-onboarding/assets/icons/metamaskSmall.svg";
import phantomLogo from "@extension-onboarding/assets/icons/phantomSmall.svg";
import coinbaseLogo from "@extension-onboarding/assets/icons/coinbaseSmall.svg";
import walletConnectLogo from "@extension-onboarding/assets/icons/walletConnectSmall.svg";
import greenTick from "@extension-onboarding/assets/icons/greenTickCircle.svg";
import { IProvider } from "@browser-extension/services/providers";
import { ProviderContext } from "@browser-extension/Context/ProviderContext";
export default function AccountBox({ provider, install }: any) {
  const {
    // @ts-ignore
    providerList,
    // @ts-ignore
    installedProviders,
    // @ts-ignore
    linkedAccounts,
    // @ts-ignore
    setLinkedAccounts,
  } = React.useContext(ProviderContext);

  const [connectedAccounts, setConnectedAccounts] = useState([]);

  useEffect(() => {
    setConnectedAccounts([]);
    if (linkedAccounts.length > 0) {
      linkedAccounts.map((a) => {
        if (a.key === provider.key) {
          // @ts-ignore
          setConnectedAccounts((old) => [...old, a]);
        }
      });
    }
  }, [linkedAccounts]);

  const classes = useStyles();

  const onClickConnect = (providerObj: IProvider) => {
    if (!providerObj.provider.isInstalled) {
      return window.open(providerObj.installationUrl, "_blank");
    }

    return providerObj.provider.connect().andThen((account) => {
      // @ts-ignore
      return window.sdlDataWallet.getUnlockMessage().andThen((message) => {
        return providerObj.provider.getSignature(message).map((signature) => {
          console.log("signature", signature);
          console.log("account", account);
          console.log("ProviderOBjKey", providerObj.key);
          if (!linkedAccounts.find((a) => a.accountAddress === account)) {
            setLinkedAccounts((old) => [
              ...old,
              {
                key: provider.key,
                accountAddress: account,
                name: provider.name,
              },
            ]);
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

  return (
    <Grid className={classes.accountBoxContainer}>
      <Grid className={classes.providerContainer}>
        <Grid>
          <img
            style={{ paddingTop: "15px", paddingLeft: "25px" }}
            src={providerText[provider.key]?.logo}
          />
          {connectedAccounts.length > 0 ? (
            <img style={{ marginLeft: "-15px" }} src={greenTick} />
          ) : (
            ""
          )}
        </Grid>
        <Grid>
          <p className={classes.providerText}>
            {providerText[provider.key]?.text}
          </p>
        </Grid>

        <Grid>
          {connectedAccounts.length > 0 ? (
            <p className={classes.linkedText}>
              {connectedAccounts.length} account linked
            </p>
          ) : (
            ""
          )}
        </Grid>

        <Grid className={classes.linkAccountContainer}>
          <Button
            onClick={() => {
              onClickConnect(provider);
            }}
            className={classes.linkAccountButton}
          >
            {install ? "Install" : "Link Account"}
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
});

const providerText = {
  metamask: {
    text: "MetaMask",
    logo: metamaskLogo,
  },
  phantom: {
    text: "Phantom",
    logo: phantomLogo,
  },
  coinbase: {
    text: "Coinbase",
    logo: coinbaseLogo,
  },
  walletConnect: {
    text: "WalletConnect",
    logo: walletConnectLogo,
  },
};
