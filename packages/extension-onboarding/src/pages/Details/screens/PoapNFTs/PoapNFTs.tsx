import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";

import emptyNfts from "@extension-onboarding/assets/images/empty-nfts.svg";
import { useStyles } from "@extension-onboarding/pages/Details/screens/PoapNFTs/PoapNFTs.style";
import { useDashboardContext } from "@extension-onboarding/context/DashboardContext";
import { PoapNFTItem } from "@extension-onboarding/components/NFTItem";

export default () => {
  const classes = useStyles();

  const { isNFTsLoading, poapNFTs } = useDashboardContext();

  return (
    <Box>
      <Box mb={3}>
        <Box mb={1}>
          <Typography className={classes.title}>POAPs</Typography>
        </Box>
        <Typography className={classes.description}>
          Your POAPs, from linked accounts and newly earned rewards.
        </Typography>
      </Box>
      {isNFTsLoading ? (
        <Box display="flex" alignItems="center" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {poapNFTs && poapNFTs.length ? (
            poapNFTs.map((nftItem) => {
              return <PoapNFTItem key={nftItem.tokenId} item={nftItem} />;
            })
          ) : (
            <Box width="100%" display="flex">
              <Box
                justifyContent="center"
                alignItems="center"
                width="100%"
                display="flex"
                pt={8}
              >
                <img style={{ width: 255, height: "auto" }} src={emptyNfts} />
              </Box>
            </Box>
          )}
        </Grid>
      )}
    </Box>
  );
};
