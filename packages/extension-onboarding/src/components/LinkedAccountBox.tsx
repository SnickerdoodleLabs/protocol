import { Button, Grid, makeStyles } from "@material-ui/core";
import React, { FC, useContext } from "react";
import notLinked from "@extension-onboarding/assets/icons/notLinked.svg";
import UnlinkAccount from "./UnlinkAccount";
import { ProviderContext } from "@extension-onboarding/Context/ProviderContext";

const LinkedAccountBox: FC = () => {
  const providerContext = useContext(ProviderContext);

  const classes = useStyles();
  return (
    <Grid className={classes.linkedAccountContainer}>
      {providerContext!.linkedAccounts!.length > 0 ? (
        providerContext?.linkedAccounts?.map((account) => (
          <UnlinkAccount account={account} key={account.accountAddress} />
        ))
      ) : (
        <Grid className={classes.notLinkedContainer}>
          <img src={notLinked} />
          <p className={classes.noLinkedAccountText}>
            You don’t have any linked account
          </p>
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
  noLinkedAccountText: {
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
