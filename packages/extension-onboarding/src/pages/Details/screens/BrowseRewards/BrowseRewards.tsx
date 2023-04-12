import { useStyles } from "@extension-onboarding/pages/Details/screens/BrowseRewards/BrowseRewards.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import {
  IpfsCID,
  MarketplaceListing,
  MarketplaceTag,
  PagingRequest,
} from "@snickerdoodlelabs/objects";
import React, { FC, useEffect, useState } from "react";
import BrowseRewardItem from "@extension-onboarding/pages/Details/screens/BrowseRewards/components/BrowseRewardItem";
import featuredRewards from "@extension-onboarding/assets/images/featured-rewards.svg";
declare const window: IWindowWithSdlDataWallet;

const BrowseRewards: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [marketplaceListings, setMarketplaceListings] =
    useState<Map<MarketplaceTag, MarketplaceListing[]>>();

  const classes = useStyles();

  useEffect(() => {
    // TODO: get tags list from here https://github.com/SnickerdoodleLabs/protocol/blob/32534f1f6196fdfcc460f6752e45c0d5bb2c878b/packages/extension-onboarding/src/constants/tags.ts
    const tags = [MarketplaceTag("mock tag")];
    tags.forEach((tag) => {
      window.sdlDataWallet.getListingsTotalByTag(tag).map((total) => {
        window.sdlDataWallet
          .getMarketplaceListingsByTag(new PagingRequest(1, total), tag)
          .map((result) => {
            setMarketplaceListings(
              new Map(marketplaceListings?.set(tag, result.response)),
            );
          });
      });
    });
  }, []);

  const marketplaceList = Array.from(
    marketplaceListings?.values() || [],
  ).flat();

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
          {marketplaceList.map((marketplaceListing) => {
            return (
              <BrowseRewardItem
                key={marketplaceListing.cid}
                cid={marketplaceListing.cid}
              />
            );
          })}
        </Grid>
      )}
    </Box>
  );
};
export default BrowseRewards;
