import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import {
  chainConfig,
  EChainType,
  ChainId,
  WalletNFT,
  AccountAddress,
  EVMNFT,
  SolanaNFT,
  EChainTechnology,
  SuiNFT,
} from "@snickerdoodlelabs/objects";
import React, { useEffect, useMemo, useState } from "react";

import emptyNfts from "@extension-onboarding/assets/images/empty-nfts.svg";
import AccountChainBar from "@extension-onboarding/components/AccountChainBar";
import {
  EVMNFTItem,
  SolanaNFTItem,
  SuiNFTItem,
} from "@extension-onboarding/components/NFTItem";
import UnauthScreen from "@extension-onboarding/components/UnauthScreen";
import { EAppModes, useAppContext } from "@extension-onboarding/context/App";
import { useDashboardContext } from "@extension-onboarding/context/DashboardContext";
import { useStyles } from "@extension-onboarding/pages/Details/screens/NFTs/NFTs.style";

export enum EDisplayMode {
  MAINNET,
  TESTNET,
}

export default () => {
  const classes = useStyles();
  const { accountNFTs, accountTestnetNFTs, isNFTsLoading } =
    useDashboardContext();
  const [accountSelect, setAccountSelect] = useState<AccountAddress>();
  const [chainSelect, setChainSelect] = useState<ChainId>();
  const [displayMode, setDisplayMode] = useState<EDisplayMode>(
    EDisplayMode.MAINNET,
  );

  const { linkedAccounts } = useAppContext();

  const nftsToRender: WalletNFT[] | null = useMemo(() => {
    if (accountNFTs && accountTestnetNFTs) {
      const nftArr =
        EDisplayMode.MAINNET === displayMode ? accountNFTs : accountTestnetNFTs;

      if (!accountSelect && !chainSelect) {
        return nftArr;
      }
      if (!accountSelect && chainSelect) {
        return nftArr.filter((item) => item.chain === chainSelect);
      }
      if (accountSelect && !chainSelect) {
        return nftArr.filter((item) => item.owner === accountSelect);
      }
      return nftArr.filter(
        (item) => item.owner === accountSelect && item.chain === chainSelect,
      );
    } else {
      return null;
    }
  }, [
    accountSelect,
    chainSelect,
    displayMode,
    accountNFTs,
    accountTestnetNFTs,
  ]);

  if (!(linkedAccounts.length > 0)) {
    return <UnauthScreen />;
  }

  return (
    <Box>
      <AccountChainBar
        accountSelect={accountSelect}
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
        setAccountSelect={setAccountSelect}
        setChainSelect={setChainSelect}
        chainSelect={chainSelect}
      />
      {isNFTsLoading ? (
        <Box display="flex" alignItems="center" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {nftsToRender?.length ? (
            nftsToRender.map((nftItem) => {
              if (nftItem.type === EChainTechnology.EVM) {
                return (
                  <EVMNFTItem
                    key={JSON.stringify(nftItem)}
                    item={nftItem as EVMNFT}
                  />
                );
              } else if (nftItem.type === EChainTechnology.Sui) {
                return (
                  <SuiNFTItem
                    key={JSON.stringify(nftItem)}
                    item={nftItem as SuiNFT}
                  />
                );
              } else {
                return (
                  <SolanaNFTItem
                    key={JSON.stringify(nftItem)}
                    item={nftItem as SolanaNFT}
                  />
                );
              }
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
                    You don't have any NFTs.
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
