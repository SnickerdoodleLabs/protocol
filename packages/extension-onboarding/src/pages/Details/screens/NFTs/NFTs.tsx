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
} from "@snickerdoodlelabs/objects";
import React, { useEffect, useMemo, useState } from "react";

import emptyNfts from "@extension-onboarding/assets/images/empty-nfts.svg";
import AccountChainBar from "@extension-onboarding/components/AccountChainBar";
import {
  EVMNFTItem,
  SolanaNFTItem,
} from "@extension-onboarding/components/NFTItem";
import { useAppContext } from "@extension-onboarding/context/App";
import { useStyles } from "@extension-onboarding/pages/Details/screens/NFTs/NFTs.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";

declare const window: IWindowWithSdlDataWallet;

export enum EDisplayMode {
  MAINNET,
  TESTNET,
}

const { mainnetSupportedChainIds, testnetSupportedChainIds } = Array.from(
  chainConfig.values(),
).reduce(
  (acc, chainInfo) => {
    if (chainInfo.type === EChainType.Mainnet) {
      acc.mainnetSupportedChainIds = [
        ...acc.mainnetSupportedChainIds,
        chainInfo.chainId,
      ];
    } else if (chainInfo.type === EChainType.Testnet) {
      acc.testnetSupportedChainIds = [
        ...acc.testnetSupportedChainIds,
        chainInfo.chainId,
      ];
    }
    return acc;
  },
  { mainnetSupportedChainIds: [], testnetSupportedChainIds: [] } as {
    mainnetSupportedChainIds: ChainId[];
    testnetSupportedChainIds: ChainId[];
  },
);

export default () => {
  const classes = useStyles();
  const { linkedAccounts } = useAppContext();
  const [isNFTsLoading, setIsNFTsLoading] = useState(true);
  const [accountNFTs, setAccountNFTs] = useState<WalletNFT[]>();
  const [accountTestnetNFTs, setAccountTestnetNFTs] = useState<WalletNFT[]>();
  const [accountSelect, setAccountSelect] = useState<AccountAddress>();
  const [chainSelect, setChainSelect] = useState<ChainId>();
  const [displayMode, setDisplayMode] = useState<EDisplayMode>(
    EDisplayMode.MAINNET,
  );
  useEffect(() => {
    if (linkedAccounts.length) {
      setIsNFTsLoading(true);
      initializeNfts();
    }
  }, [linkedAccounts.length]);

  const initializeNfts = () => {
    window.sdlDataWallet
      .getAccountNFTs()
      .mapErr((e) => {
        setIsNFTsLoading(false);
      })
      .map((result) => {
        const structeredNfts = result.reduce(
          (acc, item) => {
            const isMainnetItem = mainnetSupportedChainIds.includes(item.chain);
            if (isMainnetItem) {
              acc.mainnetNfts = [...acc.mainnetNfts, item];
            } else {
              acc.testnetNfts = [...acc.testnetNfts, item];
            }
            return acc;
          },
          { mainnetNfts: [], testnetNfts: [] } as {
            mainnetNfts: WalletNFT[];
            testnetNfts: WalletNFT[];
          },
        );
        setAccountNFTs(structeredNfts.mainnetNfts);
        setAccountTestnetNFTs(structeredNfts.testnetNfts);
        setIsNFTsLoading(false);
      });
  };

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
      <Box mb={3}>
        <Box mb={0.5}>
          <Typography className={classes.title}>NFTs</Typography>
        </Box>
        <Typography className={classes.description}>
          Your NFTs, from linked accounts and newly earned rewards.
        </Typography>
      </Box>
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
