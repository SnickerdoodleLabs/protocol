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
                flexDirection="column"
                pt={8}
              >
                <img style={{ width: 255, height: "auto" }} src={emptyNfts} />
                <Box mt={2}>
                  <Typography className={classes.description}>
                    You don't have any POAPs.
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Grid>
      )}
    </Box>
  );
};
