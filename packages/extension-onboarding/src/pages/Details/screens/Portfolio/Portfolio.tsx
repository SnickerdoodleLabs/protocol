import { EWalletProviderKeys } from "@extension-onboarding/constants";
import { useAppContext } from "@extension-onboarding/context/App";

import { useStyles } from "@extension-onboarding/pages/Details/screens/Portfolio/Portfolio.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  TablePagination,
  Typography,
} from "@material-ui/core";
import React, { FC, useEffect, useMemo, useState } from "react";
import coinbaseSmall from "@extension-onboarding/assets/icons/coinbaseSmall.svg";

import metamaskLogo from "@extension-onboarding/assets/icons/metamaskSmall.svg";

import {
  chainConfig,
  ChainId,
  EVMAccountAddress,
  IEVMBalance,
  IEVMNFT,
} from "@snickerdoodlelabs/objects";

import TokenItem from "@extension-onboarding/pages/Details/screens/Portfolio/components/TokenItem/TokenItem";
import Switch from "@extension-onboarding/components/Switch";
import NFTItem from "@extension-onboarding/components/NFTItem";
import { Pagination } from "@material-ui/lab";

declare const window: IWindowWithSdlDataWallet;

export interface IAccountBalanceObject {
  [id: EVMAccountAddress]: IEVMBalance[];
}
export interface IChainBalanceObject {
  [id: ChainId]: IEVMBalance[];
}
export interface IAccountNFTsObject {
  [id: EVMAccountAddress]: IEVMNFT[];
}

export enum EDisplayMode {
  MAINNET,
  TESTNET,
}
interface IPagination {
  currentIndex: number;
  numberOfPages: number;
  totalItems: number;
}

const Portfolio: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { linkedAccounts } = useAppContext();
  const [accountBalances, setAccountBalances] =
    useState<IAccountBalanceObject>();
  const [accountTestnetBalances, setAccountTestnetBalances] =
    useState<IAccountBalanceObject>();
  const [accountNFTs, setAccountNFTs] = useState<IAccountNFTsObject>();
  const [accountTestnetNFTs, setAccountTestnetNFTs] =
    useState<IAccountNFTsObject>();

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
            const balanceObjectToUpdate = isMainnetItem
              ? acc.mainnetBalances
              : acc.testnetBalances;

            if (balanceObjectToUpdate[item.accountAddress]) {
              balanceObjectToUpdate[item.accountAddress] = [
                ...balanceObjectToUpdate[item.accountAddress],
                item,
              ];
            } else {
              balanceObjectToUpdate[item.accountAddress] = [item];
            }

            return acc;
          },
          { mainnetBalances: {}, testnetBalances: {} } as {
            mainnetBalances: IAccountBalanceObject;
            testnetBalances: IAccountBalanceObject;
          },
        );
        setAccountBalances(structeredBalances.mainnetBalances);
        setAccountTestnetBalances(structeredBalances.testnetBalances);
      });
  };

  const netWorth = useMemo(() => {
    if (!accountBalances && !accountTestnetBalances) {
      return 0;
    } else {
      const objectsToFilter =
        EDisplayMode.MAINNET === displayMode
          ? accountBalances
          : accountTestnetBalances;

      return Object.values(objectsToFilter!)
        .flat()
        .reduce((acc, item) => {
          return (acc = acc + item?.quoteBalance);
        }, 0);
    }
  }, [displayMode, accountBalances, accountTestnetBalances]);

  const numberOfTokens = useMemo(() => {
    if (!accountBalances && !accountTestnetBalances) {
      return 0;
    } else {
      const objectsToFilter =
        EDisplayMode.MAINNET === displayMode
          ? accountBalances
          : accountTestnetBalances;

      return Array.from(
        new Set(
          Object.values(objectsToFilter!)
            .flat()
            .map((item) => item.ticker),
        ),
      ).length;
    }
  }, [displayMode, accountBalances, accountTestnetBalances]);

  const numberOfNFTs = useMemo(() => {
    if (!accountNFTs && !accountTestnetNFTs) {
      return 0;
    } else {
      const objectsToFilter =
        EDisplayMode.MAINNET === displayMode ? accountNFTs : accountTestnetNFTs;

      return Object.values(objectsToFilter!).flat().length;
    }
  }, [displayMode, accountNFTs, accountTestnetNFTs]);

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
            const nftObjectToUpdate = isMainnetItem
              ? acc.mainnetNfts
              : acc.testnetNfts;

            if (nftObjectToUpdate[item.owner]) {
              nftObjectToUpdate[item.owner] = [
                ...nftObjectToUpdate[item.owner],
                item,
              ];
            } else {
              nftObjectToUpdate[item.owner] = [item];
            }

            return acc;
          },
          { mainnetNfts: {}, testnetNfts: {} } as {
            mainnetNfts: IAccountNFTsObject;
            testnetNfts: IAccountNFTsObject;
          },
        );
        setAccountNFTs(structeredNfts.mainnetNfts);
        setAccountTestnetNFTs(structeredNfts.testnetNfts);
      });
  };

  const handleAccountChange = (event: any) => {
    const value = event.target.value === "all" ? undefined : event.target.value;
    setAccountSelect(value);
  };
  const handleChainChange = (event: any) => {
    setChainSelect(event.target.value);
  };

  const { mainnetSupportedChainIds, testnetSupportedChainIds } = Array.from(
    chainConfig.values(),
  ).reduce(
    (acc, chainInfo) => {
      if (!chainInfo.isDev) {
        acc.mainnetSupportedChainIds = [
          ...acc.mainnetSupportedChainIds,
          chainInfo.chainId,
        ];
      } else {
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

  const tokensToRender: IEVMBalance[] | null = useMemo(() => {
    if (!accountBalances && !accountTestnetBalances) {
      return null;
    } else {
      const objectsToFilter =
        EDisplayMode.MAINNET === displayMode
          ? accountBalances
          : accountTestnetBalances;

      if (!accountSelect && !chainSelect) {
        return Object.values(
          Object.values(objectsToFilter!)
            .flat()
            .reduce((acc, item) => {
              if (acc[item.ticker]) {
                acc[item.ticker] = {
                  ...acc[item.ticker],
                  balance: acc[item.ticker].balance + item.balance,
                  quotoeBalance:
                    acc[item.ticker].quotoeBalance + item.quotoeBalance,
                };
              } else {
                acc[item.ticker] = item;
              }
              return acc;
            }, {}),
        );
      } else if (!accountSelect && chainSelect) {
        return Object.values(
          Object.values(objectsToFilter!)
            .map((arr) => {
              return arr.filter((item) => item.chainId === chainSelect);
            })
            .flat()
            .reduce((acc, item) => {
              if (acc[item.ticker]) {
                acc[item.ticker] = {
                  ...acc[item.ticker],
                  balance: acc[item.ticker].balance + item.balance,
                  quotoeBalance:
                    acc[item.ticker].quotoeBalance + item.quotoeBalance,
                };
              } else {
                acc[item.ticker] = item;
              }
              return acc;
            }, {}),
        );
      } else if (accountSelect && !chainSelect) {
        return objectsToFilter?.[accountSelect] ?? [];
      } else if (accountSelect && chainSelect) {
        return (
          objectsToFilter?.[accountSelect]?.filter(
            (item) => item.chainId === chainSelect,
          ) ?? []
        );
      } else {
        return null;
      }
    }
  }, [
    accountSelect,
    chainSelect,
    displayMode,
    accountBalances,
    accountTestnetBalances,
  ]);

  const nftsToRender = useMemo(() => {
    if (!accountNFTs && !accountTestnetNFTs) {
      return null;
    } else {
      const objectsToFilter =
        EDisplayMode.MAINNET === displayMode ? accountNFTs : accountTestnetNFTs;

      if (!accountSelect && !chainSelect) {
        return Object.values(objectsToFilter!).flat();
      } else if (!accountSelect && chainSelect) {
        return Object.values(objectsToFilter!)
          .map((arr) => {
            return arr.filter((item) => item.chain === chainSelect);
          })
          .flat();
      } else if (accountSelect && !chainSelect) {
        return objectsToFilter?.[accountSelect];
      } else if (accountSelect && chainSelect) {
        return objectsToFilter?.[accountSelect].filter(
          (item) => item.chain === chainSelect,
        );
      } else {
        return null;
      }
    }
  }, [
    accountSelect,
    chainSelect,
    displayMode,
    accountNFTs,
    accountTestnetNFTs,
  ]);

  useEffect(() => {
    if (tokensToRender && tokensToRender.length > 5) {
      setTokensPagination({
        currentIndex: 1,
        numberOfPages:
          ((tokensToRender.length / 5) | 0) +
          (tokensToRender.length % 5 != 0 ? 1 : 0),
        totalItems: tokensToRender.length,
      });
    } else {
      setTokensPagination(undefined);
    }
  }, [tokensToRender]);

  useEffect(() => {
    if (nftsToRender && nftsToRender.length > 5) {
      setNftsPagination({
        currentIndex: 1,
        numberOfPages:
          ((nftsToRender.length / 5) | 0) +
          (nftsToRender.length % 5 != 0 ? 1 : 0),
        totalItems: nftsToRender.length,
      });
    } else {
      setNftsPagination(undefined);
    }
  }, [nftsToRender]);

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
          All of your assets in one place.
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Box
          width={250}
          height={100}
          borderRadius={8}
          bgcolor={"rgba(185, 182, 211, 0.2)"}
        >
          <Box p={2}>
            <Typography
              style={{
                color: "rgba(35, 32, 57, 0.8)",
                fontFamily: "Space Grotesk",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Net Worth
            </Typography>
            <Typography
              style={{
                color: "#5D5A74",
                fontFamily: "Space Grotesk",
                fontSize: 34,
                fontWeight: 400,
              }}
            >
              $ {`${netWorth}`}
            </Typography>
          </Box>
        </Box>
        <Box
          width={250}
          height={100}
          borderRadius={8}
          bgcolor={"rgba(185, 182, 211, 0.2)"}
        >
          <Box p={2}>
            <Typography
              style={{
                color: "rgba(35, 32, 57, 0.8)",
                fontFamily: "Space Grotesk",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Number of Tokens
            </Typography>
            <Typography
              style={{
                color: "#5D5A74",
                fontFamily: "Space Grotesk",
                fontSize: 34,
                fontWeight: 400,
              }}
            >
              {`${numberOfTokens}`}
            </Typography>
          </Box>
        </Box>
        <Box
          width={250}
          height={100}
          borderRadius={8}
          bgcolor={"rgba(253, 243, 225, 0.5)"}
        >
          <Box p={2}>
            <Typography
              style={{
                color: "rgba(35, 32, 57, 0.8)",
                fontFamily: "Space Grotesk",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Number of Collections
            </Typography>
            <Typography
              style={{
                color: "#5D5A74",
                fontFamily: "Space Grotesk",
                fontSize: 34,
                fontWeight: 400,
              }}
            >
              0
            </Typography>
          </Box>
        </Box>
        <Box
          width={250}
          height={100}
          borderRadius={8}
          bgcolor={"rgba(253, 243, 225, 0.5)"}
        >
          <Box p={2}>
            <Typography
              style={{
                color: "rgba(35, 32, 57, 0.8)",
                fontFamily: "Space Grotesk",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Number of NFTs
            </Typography>
            <Typography
              style={{
                color: "#5D5A74",
                fontFamily: "Space Grotesk",
                fontSize: 34,
                fontWeight: 400,
              }}
            >
              {`${numberOfNFTs}`}
            </Typography>
          </Box>
        </Box>
      </Box>
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
            <Box>
              <Switch
                value={displayMode === EDisplayMode.MAINNET}
                onChange={(e) => {
                  if (e.target.checked) {
                    setDisplayMode(EDisplayMode.MAINNET);
                  } else {
                    setDisplayMode(EDisplayMode.TESTNET);
                  }
                }}
              />
            </Box>
            <Box display="flex">
              <Button
                onClick={() => {
                  setChainSelect(undefined);
                }}
              >
                <Typography
                  style={{
                    paddingLeft: "8px",
                    textTransform: "none",
                    fontFamily: "Space Grotesk",
                    fontWeight: 500,
                    fontSize: 16,
                    color: "#232039",
                  }}
                >
                  All
                </Typography>
              </Button>
              {chainIdsToRender.map((chainId) => {
                return (
                  <Button
                    onClick={() => {
                      setChainSelect(chainId);
                    }}
                  >
                    <Typography
                      style={{
                        paddingLeft: "8px",
                        textTransform: "none",
                        fontFamily: "Space Grotesk",
                        fontWeight: 500,
                        fontSize: 16,
                        color: "#232039",
                      }}
                    >
                      {chainConfig.get(chainId)?.name}
                    </Typography>
                  </Button>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        width="100%"
        mt={3}
        style={{
          border: "1px solid rgba(207, 201, 200, 0.37)",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        }}
      >
        <Grid container>
          <Grid xs={6}>
            <Typography
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 500,
                fontSize: 16,
                color: "#5D5A74",
              }}
            >
              My Tokens
            </Typography>
          </Grid>
          <Grid xs={6}>
            <Typography
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 500,
                fontSize: 16,
                color: "#5D5A74",
              }}
            >
              My NFTs
            </Typography>
          </Grid>
          <Grid xs={6} style={{ marginTop: "30px" }}>
            <Box>
              {tokensToRender &&
                (tokensPagination
                  ? tokensToRender.slice(
                      (tokensPagination?.currentIndex - 1) * 5,
                      tokensPagination?.currentIndex * 5,
                    )
                  : tokensToRender
                ).map((item, index) => {
                  return (
                    <Box key={index} mb={3}>
                      <TokenItem item={item} />
                    </Box>
                  );
                })}
            </Box>
            {tokensPagination && (
              <Pagination
                count={tokensPagination.numberOfPages}
                page={tokensPagination.currentIndex}
                onChange={(event, newPage) => {
                  setTokensPagination({
                    ...tokensPagination,
                    currentIndex: newPage,
                  });
                }}
              />
            )}
          </Grid>
          <Grid xs={6}>
            <Box m={3}>
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
                  {nftsToRender &&
                    (nftsPagination
                      ? nftsToRender.slice(
                          (nftsPagination.currentIndex - 1) * 5,
                          nftsPagination.currentIndex * 5,
                        )
                      : nftsToRender
                    )?.map((nftitem, index) => {
                      return <NFTItem key={index} item={nftitem} />;
                    })}
                  {nftsPagination && (
                    <Pagination
                      count={nftsPagination.numberOfPages}
                      page={nftsPagination.currentIndex}
                      onChange={(event, newPage) => {
                        setNftsPagination({
                          ...nftsPagination,
                          currentIndex: newPage,
                        });
                      }}
                    />
                  )}
                </Grid>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
export default Portfolio;
