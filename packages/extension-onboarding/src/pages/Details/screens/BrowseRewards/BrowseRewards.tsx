import { useStyles } from "@extension-onboarding/pages/Details/screens/BrowseRewards/BrowseRewards.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import { IpfsCID } from "@snickerdoodlelabs/objects";
import React, { FC, useEffect, useState } from "react";
import BrowseRewardItem from "@extension-onboarding/pages/Details/screens/BrowseRewards/components/BrowseRewardItem";

declare const window: IWindowWithSdlDataWallet;

const BrowseRewards: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const classes = useStyles();

  // TODO RETURN REWARD CIDs
  const a = [IpfsCID("QmTPfcSAr5FKWDmjbyudNae5NMAreqZfYqWUGFzvuWZQDh")];

  return (
    <Box>
      <Box mb={5}>
        <Typography className={classes.title}>
          Browse Available Rewards
        </Typography>
      </Box>
      <Box mb={2}>
        <Typography className={classes.subTitle}>Featured Rewards</Typography>
        <Box mt={2} mb={5}>
          <img
            style={{ width: "100%" }}
            src="https://i.ibb.co/TBfCbXB/Group-626053.png"
          />
        </Box>
      </Box>
      <Box mb={2}>
        <Typography className={classes.subTitle}>
          Browse Available Rewards
        </Typography>
      </Box>
      <Box mb={2}>
        <Typography className={classes.description}>
          Your NFTs, from linked accounts and newly earned rewards.
        </Typography>
      </Box>
      {isLoading ? (
        <Box display="flex" alignItems="center" justifyContent="center" mt={15}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {a.map((cid: IpfsCID) => {
            return <BrowseRewardItem key={cid} cid={cid} />;
          })}
        </Grid>
      )}
    </Box>
  );
};
export default BrowseRewards;
