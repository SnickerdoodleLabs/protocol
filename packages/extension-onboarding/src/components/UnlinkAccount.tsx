import { Button, Grid, makeStyles } from "@material-ui/core";
import React, { useContext } from "react";
import metamaskLogo from "@extension-onboarding/assets/icons/metamaskSmall.svg";
import phantomLogo from "@extension-onboarding/assets/icons/phantomSmall.svg";
import coinbaseLogo from "@extension-onboarding/assets/icons/coinbaseSmall.svg";
import walletConnectLogo from "@extension-onboarding/assets/icons/walletConnectSmall.svg";
import greenTick from "@extension-onboarding/assets/icons/greenTickCircle.svg";
import { ProviderContext } from "@extension-onboarding/Context/ProviderContext";
export default function UnlinkAccount({ account }) {
  const providerContext = useContext(ProviderContext);

  const unlinkAccountHandler = () => {};

  const classes = useStyles();
  return (
    <Grid className={classes.container}>
      <Grid>
        <img
          className={classes.providerLogo}
          src={providerText[account.key].logo}
        />
        <img style={{ marginLeft: "-15px" }} src={greenTick} />
      </Grid>
      <Grid>
        <p className={classes.accountAddress}>
          {account.accountAddress.slice(0, 5)} ................{" "}
          {account.accountAddress.slice(-4)}
        </p>
        <p className={classes.providerText}>{account.name} Account</p>
      </Grid>
      <Grid className={classes.unlinkContainer}>
        <Button onClick={unlinkAccountHandler} className={classes.unlinkButton}>
          Unlink Account
        </Button>
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles({
  unlinkButton: {
    border: "1px solid #B9B6D3",
    width: "142px",
    height: "42px",
    fontFamily: "'Inter'",
    fontWeight: 500,
    fontSize: "12px",
  },
  unlinkContainer: {
    position: "absolute",
    right: "20px",
    paddingTop: "10px",
  },
  providerText: {
    paddingLeft: "15px",
    marginTop: "-15px",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 500,
    fontSize: "12px",
    color: "#5D5A74",
    opacity: 0.6,
  },
  accountAddress: {
    paddingLeft: "15px",
    paddingTop: "10px",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 500,
    fontSize: "16px",
    color: "#5D5A74",
  },
  providerLogo: {
    paddingTop: "15px",
    paddingLeft: "20px",
  },
  container: {
    display: "flex",
    alignItems: "center",
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
