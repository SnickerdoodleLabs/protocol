import { Button, Grid, makeStyles } from "@material-ui/core";
import React, { FC } from "react";
import notLinked from "@extension-onboarding/assets/icons/notLinked.svg";
import UnlinkAccount from "./UnlinkAccount";
import { ProviderContext } from "@browser-extension/Context/ProviderContext";

const LinkedAccountBox: FC = () => {
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

  const classes = useStyles();
  return (
    <Grid className={classes.linkedAccountContainer}>
      {linkedAccounts.length > 0 ? (
        linkedAccounts.map((account) => (
          <UnlinkAccount account={account} key={account.accountAddress} />
        ))
      ) : (
        <Grid className={classes.notLinkedContainer}>
          <img src={notLinked} />
          <p className={classes.text2}>You don’t have any linked account</p>
        </Grid>
      )}
    </Grid>
  );
};

const useStyles = makeStyles({
  notLinkedContainer: {
    textAlign: "center",
    marginTop: "120px",
  },
  text2: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 400,
    fontSize: "18px",
    color: "#232039",
  },
  linkedAccountContainer: {
    width: "430px",
    minHeight: "400px",
    border: "1px solid #ECECEC",
    borderRadius: "12px",
    position: "relative",
  },
});
export default LinkedAccountBox;
