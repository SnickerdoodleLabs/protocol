import { useStyles } from "@extension-onboarding/pages/Details/screens/BrowseRewards/BrowseRewards.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import { IpfsCID, MarketplaceListing } from "@snickerdoodlelabs/objects";
import React, { FC, useEffect, useState } from "react";
import BrowseRewardItem from "@extension-onboarding/pages/Details/screens/BrowseRewards/components/BrowseRewardItem";
import featuredRewards from "@extension-onboarding/assets/images/featured-rewards.svg";
declare const window: IWindowWithSdlDataWallet;

const BrowseRewards: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [marketplaceListings, setMarketplaceListings] =
    useState<MarketplaceListing>();

  const classes = useStyles();

  useEffect(() => {
    window.sdlDataWallet.getMarketplaceListings().map((result) => {
      setMarketplaceListings(result);
    });
  }, []);

  return (
    <Box>
      <Box mb={5}>
        <Typography className={classes.title}>
          Browse Available Rewards
        </Typography>
      </Box>
      <Box mt={2} mb={5}>
        <img style={{ width: "100%" }} src={featuredRewards} />
      </Box>
      {isLoading ? (
        <Box display="flex" alignItems="center" justifyContent="center" mt={15}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {(marketplaceListings?.cids?.length || 0) > 0 &&
            marketplaceListings?.cids.map((cid) => {
              return <BrowseRewardItem key={cid} cid={cid} />;
            })}
        </Grid>
      )}
    </Box>
  );
};
export default BrowseRewards;
