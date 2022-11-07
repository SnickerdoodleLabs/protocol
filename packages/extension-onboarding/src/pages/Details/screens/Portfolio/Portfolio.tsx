import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import {
  BigNumberString,
  chainConfig,
  ChainId,
  EChainType,
  EVMAccountAddress,
  TokenBalance,
  TickerSymbol,
  WalletNFT,
} from "@snickerdoodlelabs/objects";
import clsx from "clsx";
import { BigNumber } from "ethers";
import React, { FC, useEffect, useMemo, useState } from "react";

import coinbaseSmall from "@extension-onboarding/assets/icons/coinbaseSmall.svg";
import metamaskLogo from "@extension-onboarding/assets/icons/metamaskSmall.svg";
import emptyNfts from "@extension-onboarding/assets/images/empty-nfts.svg";
import emptyTokens from "@extension-onboarding/assets/images/empty-tokens.svg";
import NFTItem from "@extension-onboarding/components/NFTItem";
import Switch from "@extension-onboarding/components/Switch";
import { EWalletProviderKeys } from "@extension-onboarding/constants";
import { tokenInfoObj } from "@extension-onboarding/constants/tokenInfo";
import { useAppContext } from "@extension-onboarding/context/App";
import InfoCard from "@extension-onboarding/pages/Details/screens/Portfolio/components/InfoCard";
import TokenItem from "@extension-onboarding/pages/Details/screens/Portfolio/components/TokenItem";
import { useStyles } from "@extension-onboarding/pages/Details/screens/Portfolio/Portfolio.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";

declare const window: IWindowWithSdlDataWallet;

export enum EDisplayMode {
  MAINNET,
  TESTNET,
}
interface IPagination {
  currentIndex: number;
  numberOfPages: number;
  totalItems: number;
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

const PAGINATION_RANGE = 5;

const Portfolio: FC = () => {
  const { linkedAccounts } = useAppContext();
  const [accountBalances, setAccountBalances] = useState<TokenBalance[]>();
  const [accountTestnetBalances, setAccountTestnetBalances] =
    useState<TokenBalance[]>();
  const [accountNFTs, setAccountNFTs] = useState<WalletNFT[]>();
  const [accountTestnetNFTs, setAccountTestnetNFTs] = useState<WalletNFT[]>();

  const [isBalancesLoading, setIsBalancesLoading] = useState(true);
  const [isNFTsLoading, setIsNFTsLoading] = useState(true);
  const [accountSelect, setAccountSelect] = useState<EVMAccountAddress>();
  const [chainSelect, setChainSelect] = useState<ChainId>();
  const [displayMode, setDisplayMode] = useState<EDisplayMode>(
    EDisplayMode.MAINNET,
  );
  const [tokensPagination, setTokensPagination] = useState<IPagination>();
  const [nftsPagination, setNftsPagination] = useState<IPagination>();

  useEffect(() => {
    initializeBalances();
    initializeNfts();
  }, []);

  useEffect(() => {
    setIsBalancesLoading(true);
    setIsNFTsLoading(true);
    initializeBalances();
    initializeNfts();
  }, [linkedAccounts.length]);

  useEffect(() => {
    if (accountBalances) {
      setIsBalancesLoading(false);
    }
  }, [JSON.stringify(accountBalances)]);

  useEffect(() => {
    if (accountNFTs) {
      setIsNFTsLoading(false);
    }
  }, [JSON.stringify(accountNFTs)]);

  const initializeBalances = async () => {
    window.sdlDataWallet
      .getAccountBalances()
      .mapErr((e) => {
        setIsBalancesLoading(false);
      })
      .map((result) => {
        const structeredBalances = result.reduce(
          (acc, item) => {
            const isMainnetItem = mainnetSupportedChainIds.includes(
              item.chainId,
            );
            if (isMainnetItem) {
              acc.mainnetBalances = [...acc.mainnetBalances, item];
            } else {
              acc.testnetBalances = [...acc.testnetBalances, item];
            }
            return acc;
          },
          { mainnetBalances: [], testnetBalances: [] } as {
            mainnetBalances: TokenBalance[];
            testnetBalances: TokenBalance[];
          },
        );
        setAccountBalances(structeredBalances.mainnetBalances);
        setAccountTestnetBalances(structeredBalances.testnetBalances);
        setIsBalancesLoading(false);
      });
  };

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

  const { netWorth, numberOfTokens } = useMemo(() => {
    if (accountBalances && accountTestnetBalances) {
      const balanceArr =
        EDisplayMode.MAINNET === displayMode
          ? accountBalances
          : accountTestnetBalances;

      return {
        netWorth: balanceArr.reduce(
          (acc, item) => acc + Number.parseFloat(item.quoteBalance),
          0,
        ),
        numberOfTokens: new Set(balanceArr.map((balance) => balance.ticker))
          .size,
      };
    }
    return { netWorth: 0, numberOfTokens: 0 };
  }, [displayMode, accountBalances, accountTestnetBalances]);

  const numberOfNFTs = useMemo(() => {
    if (accountNFTs && accountTestnetNFTs) {
      const ntfArr =
        EDisplayMode.MAINNET === displayMode ? accountNFTs : accountTestnetNFTs;
      return ntfArr.length;
    }
    return 0;
  }, [displayMode, accountNFTs, accountTestnetNFTs]);

  const handleAccountChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>,
  ) => {
    const value = (
      event.target.value === "all" ? undefined : event.target.value
    ) as EVMAccountAddress;
    setAccountSelect(value);
  };

  const getGroupedBalances = (balanceArr: TokenBalance[]): TokenBalance[] => {
    return Object.values(
      balanceArr.reduce((acc, item) => {
        if (acc[item.ticker]) {
          acc[item.ticker] = {
            ...acc[item.ticker],
            balance: BigNumberString(
              BigNumber.from(acc[item.ticker].balance)
                .add(BigNumber.from(item.balance))
                .toString(),
            ),
            quoteBalance: BigNumberString(
              (acc[item.ticker].quoteBalance + item.quoteBalance).toString(),
            ),
          };
        } else {
          acc[item.ticker] = item;
        }
        return acc;
      }, {} as { [key: TickerSymbol]: TokenBalance }),
    );
  };

  const tokensToRender: TokenBalance[] | null = useMemo(() => {
    if (accountBalances && accountTestnetBalances) {
      const balanceArr =
        EDisplayMode.MAINNET === displayMode
          ? accountBalances
          : accountTestnetBalances;

      if (!accountSelect && !chainSelect) {
        return getGroupedBalances(balanceArr);
      }
      if (!accountSelect && chainSelect) {
        return getGroupedBalances(
          balanceArr.filter((item) => item.chainId === chainSelect),
        );
      }
      if (accountSelect && !chainSelect) {
        return balanceArr.filter(
          (item) => item.accountAddress === accountSelect,
        );
      }
      return balanceArr.filter(
        (item) =>
          item.accountAddress === accountSelect && item.chainId === chainSelect,
      );
    } else {
      return null;
    }
  }, [
    accountSelect,
    chainSelect,
    displayMode,
    accountBalances,
    accountTestnetBalances,
  ]);

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

  const getPaginationObject = (itemCount): IPagination | undefined => {
    if (itemCount <= PAGINATION_RANGE) {
      return undefined;
    }
    return {
      currentIndex: 1,
      numberOfPages:
        ((itemCount / PAGINATION_RANGE) | 0) +
        (itemCount % PAGINATION_RANGE != 0 ? 1 : 0),
      totalItems: itemCount,
    };
  };

  useEffect(() => {
    if (tokensToRender) {
      setTokensPagination(getPaginationObject(tokensToRender.length));
    }
  }, [tokensToRender]);

  useEffect(() => {
    if (nftsToRender) {
      setNftsPagination(getPaginationObject(nftsToRender.length));
    }
  }, [nftsToRender]);

  useEffect(() => {
    setChainSelect(undefined);
  }, [displayMode]);

  const chainIdsToRender = useMemo(() => {
    if (EDisplayMode.MAINNET === displayMode) {
      return mainnetSupportedChainIds;
    }
    return testnetSupportedChainIds;
  }, [displayMode]);

  console.log("balances", tokensToRender);
  console.log("nfts", nftsToRender);

  const classes = useStyles();
  return (
    <Box>
      <Box mb={4}>
        <Typography className={classes.title}>My Portfolio</Typography>
        <Typography className={classes.description}>
          View all of your assets in one convenient place.
        </Typography>
      </Box>

      <Grid spacing={2} container>
        <Grid item xs={6}>
          <Grid spacing={2} container>
            <Grid item xs={6}>
              <InfoCard title="Net Worth" value={`$ ${netWorth.toFixed(1)}`} />
            </Grid>
            <Grid item xs={6}>
              <InfoCard title=" Number of Tokens" value={numberOfTokens} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid spacing={2} container>
            <Grid item xs={6}>
              <InfoCard
                bgcolor={"rgba(253, 243, 225, 0.5)"}
                title=" Number of NFT Collections"
                value={0}
              />
            </Grid>
            <Grid item xs={6}>
              <InfoCard
                bgcolor={"rgba(253, 243, 225, 0.5)"}
                title="Number of NFTs"
                value={numberOfNFTs}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box mt={5}>
        <Typography className={classes.subTitle}>Accounts</Typography>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Select
              className={classes.selectAccount}
              fullWidth
              variant="outlined"
              name="accounts"
              value={accountSelect ?? "all"}
              placeholder="All"
              onChange={handleAccountChange}
            >
              <MenuItem value="all">All</MenuItem>
              {linkedAccounts?.map((account) => {
                return (
                  <MenuItem
                    key={account.accountAddress}
                    value={account.accountAddress}
                  >
                    <Box display="flex">
                      <Box>
                        {account.providerKey ===
                        EWalletProviderKeys.METAMASK ? (
                          <img src={metamaskLogo} />
                        ) : (
                          <img src={coinbaseSmall} />
                        )}
                      </Box>
                      <Typography className={classes.accountAddressText}>
                        {account.accountAddress.slice(0, 5)} ................
                        {account.accountAddress.slice(-4)}
                      </Typography>
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>
          </Box>
          <Box>
            <Box display="flex">
              <Box
                display="flex"
                py={0.75}
                px={1.5}
                borderRadius={16}
                {...(!chainSelect && {
                  bgcolor: "rgba(245, 244, 245, 0.52)",
                })}
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  setChainSelect(undefined);
                }}
              >
                <Typography className={classes.buttonText}>All</Typography>
              </Box>
              {chainIdsToRender.map((chainId) => {
                const iconSrc =
                  tokenInfoObj[
                    chainConfig.get(chainId)?.nativeCurrency?.symbol ?? ""
                  ]?.iconSrc;
                return (
                  <Box
                    p={0.75}
                    px={1.5}
                    display="flex"
                    borderRadius={16}
                    {...(chainSelect === chainId && {
                      bgcolor: "rgba(245, 244, 245, 0.52)",
                    })}
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setChainSelect(chainId);
                    }}
                  >
                    <img src={iconSrc} style={{ width: 24, height: 24 }} />
                    <Typography className={classes.buttonText}>
                      {chainConfig.get(chainId)?.name}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
            <Box display="flex">
              <Box
                display="flex"
                alignItems="center"
                pr={1.5}
                marginLeft="auto"
              >
                <Typography
                  onClick={() => {
                    setDisplayMode(EDisplayMode.TESTNET);
                  }}
                  className={clsx(classes.switchNetwork, {
                    [classes.unfocused]: displayMode != EDisplayMode.TESTNET,
                  })}
                >
                  Testnet
                </Typography>
                <Switch
                  checked={displayMode === EDisplayMode.MAINNET}
                  value={displayMode === EDisplayMode.MAINNET}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setDisplayMode(EDisplayMode.MAINNET);
                    } else {
                      setDisplayMode(EDisplayMode.TESTNET);
                    }
                  }}
                />
                <Typography
                  onClick={() => {
                    setDisplayMode(EDisplayMode.MAINNET);
                  }}
                  className={clsx(classes.switchNetwork, {
                    [classes.unfocused]: displayMode != EDisplayMode.MAINNET,
                  })}
                >
                  Mainnet
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        mt={3}
        minHeight={440}
        border="1px solid rgba(207, 201, 200, 0.37)"
        borderRadius={8}
      >
        <Grid container>
          <Grid item xs={6}>
            <Box p={1}>
              <Typography className={classes.gridTitle}>My Tokens</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box p={1} ml={3}>
              <Typography className={classes.gridTitle}>My NFTs</Typography>
            </Box>
          </Grid>
          <Box width="100%" mb={3}>
            <Divider style={{ width: "100%" }} />
          </Box>
          <Grid item xs={6}>
            <Box minHeight={440} display="flex" flexDirection="column">
              {isBalancesLoading ? (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mt={10}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {tokensToRender?.length ? (
                    (tokensPagination
                      ? tokensToRender.slice(
                          (tokensPagination?.currentIndex - 1) *
                            PAGINATION_RANGE,
                          tokensPagination?.currentIndex * PAGINATION_RANGE,
                        )
                      : tokensToRender
                    ).map((item, index) => {
                      return (
                        <Box
                          key={index}
                          mb={3}
                          {...(index % 2 === 1 && {
                            bgcolor: "rgba(245, 244, 245, 0.52)",
                          })}
                        >
                          <TokenItem item={item} />
                        </Box>
                      );
                    })
                  ) : (
                    <Box display="flex">
                      <Box
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                        display="flex"
                        pt={10}
                      >
                        <img
                          style={{ width: 255, height: "auto" }}
                          src={emptyTokens}
                        />
                      </Box>
                    </Box>
                  )}
                </>
              )}
              {tokensPagination && (
                <Box
                  display="flex"
                  marginTop="auto"
                  alignItems="center"
                  py={0.5}
                  justifyContent="flex-end"
                >
                  <Typography className={classes.paginationText}>
                    {`${
                      (tokensPagination.currentIndex - 1) * PAGINATION_RANGE + 1
                    } - ${
                      tokensPagination.currentIndex * PAGINATION_RANGE <
                      tokensPagination.totalItems
                        ? tokensPagination.currentIndex * PAGINATION_RANGE
                        : tokensPagination.totalItems
                    } of ${tokensPagination.totalItems}`}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setTokensPagination({
                        ...tokensPagination,
                        currentIndex: tokensPagination.currentIndex - 1,
                      });
                    }}
                    disabled={tokensPagination.currentIndex === 1}
                  >
                    <KeyboardArrowLeft />
                  </IconButton>
                  <IconButton
                    size="small"
                    disabled={
                      tokensPagination.currentIndex ===
                      tokensPagination.numberOfPages
                    }
                    onClick={() => {
                      setTokensPagination({
                        ...tokensPagination,
                        currentIndex: tokensPagination.currentIndex + 1,
                      });
                    }}
                  >
                    <KeyboardArrowRight />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box minHeight={440} ml={3} display="flex" flexDirection="column">
              {isNFTsLoading ? (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mt={10}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container className={classes.nftContainer}>
                  {nftsToRender?.length ? (
                    (nftsPagination
                      ? nftsToRender.slice(
                          (nftsPagination.currentIndex - 1) * PAGINATION_RANGE,
                          nftsPagination.currentIndex * PAGINATION_RANGE,
                        )
                      : nftsToRender
                    )?.map((nftitem) => {
                      return (
                        <NFTItem key={JSON.stringify(nftitem)} item={nftitem} />
                      );
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
                        <img
                          style={{ width: 255, height: "auto" }}
                          src={emptyNfts}
                        />
                      </Box>
                    </Box>
                  )}
                </Grid>
              )}
              {nftsPagination && (
                <Box
                  display="flex"
                  marginTop="auto"
                  justifyContent="flex-end"
                  alignItems="center"
                  py={0.5}
                >
                  <Typography className={classes.paginationText}>
                    {`${
                      (nftsPagination.currentIndex - 1) * PAGINATION_RANGE + 1
                    } - ${
                      nftsPagination.currentIndex * PAGINATION_RANGE <
                      nftsPagination.totalItems
                        ? nftsPagination.currentIndex * PAGINATION_RANGE
                        : nftsPagination.totalItems
                    } of ${nftsPagination.totalItems}`}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setNftsPagination({
                        ...nftsPagination,
                        currentIndex: nftsPagination.currentIndex - 1,
                      });
                    }}
                    disabled={nftsPagination.currentIndex === 1}
                  >
                    <KeyboardArrowLeft />
                  </IconButton>
                  <IconButton
                    size="small"
                    disabled={
                      nftsPagination.currentIndex ===
                      nftsPagination.numberOfPages
                    }
                    onClick={() => {
                      setNftsPagination({
                        ...nftsPagination,
                        currentIndex: nftsPagination.currentIndex + 1,
                      });
                    }}
                  >
                    <KeyboardArrowRight />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
export default Portfolio;
