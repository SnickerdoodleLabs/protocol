import { PoapNFTItem } from "@extension-onboarding/components/NFTItem";
import Card from "@extension-onboarding/components/v2/Card";
import CustomSizeGrid from "@extension-onboarding/components/v2/CustomSizeGrid";
import EmptyItem from "@extension-onboarding/components/v2/EmptyItem";
import UnauthScreen from "@extension-onboarding/components/v2/UnauthScreen";
import { useAppContext, EAppModes } from "@extension-onboarding/context/App";
import { useDashboardContext } from "@extension-onboarding/context/DashboardContext";
import { useStyles } from "@extension-onboarding/pages/Details/screens/PoapNFTs/PoapNFTs.style";
import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import React from "react";

export default () => {
  const classes = useStyles();

  const { isNFTsLoading, poapNFTs } = useDashboardContext();
  const { linkedAccounts } = useAppContext();

  if (!(linkedAccounts.length > 0)) {
    return <UnauthScreen />;
  }

  return (
    <Card>
      {isNFTsLoading ? (
        <Box display="flex" alignItems="center" justifyContent="center" my={10}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {poapNFTs && poapNFTs.length ? (
            <CustomSizeGrid
              items={poapNFTs.map((nftItem, index) => {
                return <PoapNFTItem item={nftItem} />;
              })}
            />
          ) : (
            <EmptyItem />
          )}
        </>
      )}
    </Card>
  );
};
