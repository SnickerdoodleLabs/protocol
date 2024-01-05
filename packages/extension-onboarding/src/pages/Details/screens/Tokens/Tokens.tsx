import AccountChainBar from "@extension-onboarding/components/AccountChainBar";
import Card from "@extension-onboarding/components/v2/Card";
import EmptyItem from "@extension-onboarding/components/v2/EmptyItem";
import Table from "@extension-onboarding/components/v2/Table";
import TrendItem from "@extension-onboarding/components/v2/TrendItem";
import UnauthScreen from "@extension-onboarding/components/v2/UnauthScreen/UnauthScreen";
import { tokenInfoObj } from "@extension-onboarding/constants/tokenInfo";
import { useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { IBalanceItem } from "@extension-onboarding/objects";
import { useStyles } from "@extension-onboarding/pages/Details/screens/Tokens/Tokens.style";
import { Box, CircularProgress, Grid } from "@material-ui/core";
import {
  AccountAddress,
  BigNumberString,
  chainConfig,
  ChainId,
  EChainType,
  formatValue,
  getChainInfoByChain,
} from "@snickerdoodlelabs/objects";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import chroma from "chroma-js";
import { okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import React, { useEffect, useMemo, useState } from "react";
import { Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

export enum EDisplayMode {
  MAINNET,
  TESTNET,
}

const chartOptions = {
  layout: {
    padding: 0,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.label} - $${context.formattedValue}`,
      },
    },
  },
};

const colorGenarator = chroma.scale(["#5A5292", "#B9B6D3"]).mode("lab");

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

const CHART_ITEM_COUNT = 3;

export default () => {
  const classes = useStyles();
  const { sdlDataWallet } = useDataWalletContext();
  const { linkedAccounts } = useAppContext();

  const [accountSelect, setAccountSelect] = useState<
    AccountAddress | undefined
  >();
  const [chainSelect, setChainSelect] = useState<ChainId>();
  const [displayMode, setDisplayMode] = useState<EDisplayMode>(
    EDisplayMode.MAINNET,
  );
  const [accountBalances, setAccountBalances] = useState<IBalanceItem[]>();
  const [accountTestnetBalances, setAccountTestnetBalances] =
    useState<IBalanceItem[]>();
  const [isBalancesLoading, setIsBalancesLoading] = useState(true);
  useEffect(() => {
    if (linkedAccounts.length) {
      setIsBalancesLoading(true);
      initializeBalances();
    }
  }, [linkedAccounts.length]);

  const { chains, accounts } = useMemo(() => {
    return [
      ...(accountBalances || ([] as IBalanceItem[])),
      ...(accountTestnetBalances || ([] as IBalanceItem[])),
    ].reduce(
      (acc, balance) => {
        if (!acc.accounts.includes(balance.accountAddress)) {
          acc.accounts.push(balance.accountAddress);
        }
        const nftChainId = getChainInfoByChain(balance.chainId).chainId;
        if (!acc.chains.includes(nftChainId)) {
          acc.chains.push(nftChainId);
        }
        return acc;
      },
      {
        accounts: [] as AccountAddress[],
        chains: [] as ChainId[],
      },
    );
  }, [accountBalances, accountTestnetBalances]);

  const initializeBalances = () => {
    sdlDataWallet
      .getAccountBalances()
      .map((balances) =>
        // TODO: Fix this. This is really bad- The balance is a BNS, and should be formatted at the point of display
        balances.map((b) => ({
          ...b,
          balance: BigNumberString(formatValue(b)),
        })),
      )
      .andThen((balanceResults) => {
        return ResultUtils.combine(
          balanceResults.map((balanceItem) =>
            sdlDataWallet
              .getTokenInfo(
                ChainId(balanceItem.chainId),
                balanceItem.tokenAddress,
              )
              .orElse((e) => okAsync(null)),
          ),
        ).map((tokenInfo) => {
          return balanceResults.map((balanceItem, index) => ({
            ...balanceItem,
            tokenInfo: tokenInfo[index],
          }));
        });
      })
      .andThen((balancesWithTokenInfo) => {
        return sdlDataWallet
          .getTokenMarketData(
            balancesWithTokenInfo.map((item) => item.tokenInfo?.id ?? ""),
          )
          .orElse((e) => okAsync([]))
          .map((res) => {
            const combinedBalances = balancesWithTokenInfo.reduce(
              (acc, item) => {
                if (!item.tokenInfo) {
                  acc = [
                    ...acc,
                    { ...item, marketaData: null, quoteBalance: 0 },
                  ];
                } else {
                  const marketData = res.filter(
                    (marketData) => marketData.id == item.tokenInfo!.id,
                  );
                  const marketDataRes = marketData.length
                    ? marketData[0]
                    : null;
                  acc = [
                    ...acc,
                    {
                      ...item,
                      marketaData: marketData.length ? marketData[0] : null,
                      quoteBalance:
                        Number.parseFloat(item.balance || "0") *
                        (marketDataRes?.currentPrice ?? 0),
                    },
                  ];
                }

                return acc;
              },
              [] as IBalanceItem[],
            );
            const structeredBalances = combinedBalances.reduce(
              (acc, item) => {
                const isMainnetItem = mainnetSupportedChainIds.includes(
                  ChainId(item.chainId),
                );
                if (isMainnetItem) {
                  acc.mainnetBalances = [...acc.mainnetBalances, item];
                } else {
                  acc.testnetBalances = [...acc.testnetBalances, item];
                }
                return acc;
              },
              { mainnetBalances: [], testnetBalances: [] } as {
                mainnetBalances: IBalanceItem[];
                testnetBalances: IBalanceItem[];
              },
            );
            setAccountBalances(structeredBalances.mainnetBalances);
            setAccountTestnetBalances(structeredBalances.testnetBalances);
            setIsBalancesLoading(false);
          });
      });
  };

  const getGroupedBalances = (balanceArr: IBalanceItem[]): IBalanceItem[] => {
    return Object.values(
      balanceArr.reduce((acc, item) => {
        if (acc[item.ticker]) {
          acc[item.ticker] = {
            ...acc[item.ticker],
            balance: BigNumberString(
              (
                Number.parseFloat(acc[item.ticker].balance) +
                Number.parseFloat(item.balance)
              ).toString(),
            ),
            quoteBalance: acc[item.ticker].quoteBalance + item.quoteBalance,
          };
        } else {
          acc[item.ticker] = item;
        }
        return acc;
      }, {} as { [key: string]: IBalanceItem }),
    ).sort((a, b) => b.quoteBalance - a.quoteBalance);
  };

  const tokensToRender: IBalanceItem[] | null = useMemo(() => {
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
        return balanceArr
          .filter((item) => item.accountAddress === accountSelect)
          .sort((a, b) => b.quoteBalance - a.quoteBalance);
      }
      return balanceArr
        .filter(
          (item) =>
            item.accountAddress === accountSelect &&
            item.chainId === chainSelect,
        )
        .sort((a, b) => b.quoteBalance - a.quoteBalance);
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

  const { totalItems, totalBalance } = useMemo(() => {
    if (!tokensToRender) {
      return { totalItems: 0, totalBalance: 0 };
    } else {
      return {
        totalItems: tokensToRender.length,
        totalBalance:
          tokensToRender?.reduce((acc, item) => {
            return (acc += item.quoteBalance);
          }, 0) || 0,
      };
    }
  }, [tokensToRender]);

  const charItemsToRender = useMemo(() => {
    if (!tokensToRender?.length || totalBalance == 0) {
      return undefined;
    }

    const nonZeroHighestItems = tokensToRender
      .slice(0, CHART_ITEM_COUNT)
      .filter((item) => item.quoteBalance != 0);

    const restItemBalance = tokensToRender
      .slice(CHART_ITEM_COUNT)
      .reduce((acc, item) => (acc += item.quoteBalance), 0);

    const options = {
      labels: [
        ...nonZeroHighestItems.map((i) => i.marketaData?.name ?? i.ticker),
        ...(restItemBalance != 0 ? ["Others"] : []),
      ],
      data: [
        ...nonZeroHighestItems.map((i) => i.quoteBalance || 0),
        ...(restItemBalance != 0 ? [restItemBalance] : []),
      ],
    };

    return options;
  }, [tokensToRender, totalBalance]);

  if (!(linkedAccounts.length > 0)) {
    return <UnauthScreen />;
  }

  const columns = [
    {
      label: "Name",
      render: (item: IBalanceItem) => {
        return (
          <Box display="flex">
            <img
              width={24}
              height={24}
              style={{ borderRadius: 18 }}
              src={
                item.marketaData?.image
                  ? item.marketaData?.image
                  : tokenInfoObj[item.ticker]?.iconSrc ??
                    "https://storage.googleapis.com/dw-assets/spa/icons/default-token.png"
              }
            />
            <Box ml={1}>
              <Box>
                <SDTypography
                  variant="bodyLg"
                  fontWeight="medium"
                  color="textHeading"
                >
                  {tokenInfoObj[item.ticker]?.displayName ?? item?.ticker}
                </SDTypography>
              </Box>
              <Box>
                <SDTypography
                  variant="bodySm"
                  fontWeight="medium"
                  color="textLight"
                >
                  {`${item.balance || "0"} ${item.ticker}`}
                </SDTypography>
              </Box>
            </Box>
          </Box>
        );
      },
    },
    {
      label: "Trend",
      hideOn: ["xs" as const],
      render: (item: IBalanceItem) => {
        return <TrendItem item={item} />;
      },
    },
    {
      label: "Value",
      align: "right" as const,
      render: (item: IBalanceItem) => {
        return (
          <Box>
            <SDTypography variant="bodyLg">
              ${item.quoteBalance.toFixed(4)}
            </SDTypography>
            {item.marketaData?.priceChangePercentage24h != null && (
              <SDTypography
                variant="bodySm"
                color={
                  (item.marketaData?.priceChangePercentage24h || 0) > 0
                    ? "textSuccess"
                    : "textError"
                }
              >
                {`${item.marketaData?.priceChangePercentage24h.toFixed(2)}% ($${
                  item.marketaData.currentPrice
                })`}
              </SDTypography>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <Box mb={3}>
        <AccountChainBar
          chainIdsToRender={chains}
          accountAdressesToRender={accounts}
          accountSelect={accountSelect}
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
          setAccountSelect={setAccountSelect}
          setChainSelect={setChainSelect}
          chainSelect={chainSelect}
        />
      </Box>

      {isBalancesLoading ? (
        <Box display="flex" alignItems="center" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      ) : (
        <Card>
          {tokensToRender?.length ? (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box
                    p={3}
                    pb={6}
                    bgcolor="#F2F2F8"
                    border="1px solid rgba(234, 236, 240, 0.6)"
                    borderRadius={8}
                    mb={3}
                  >
                    <Box mb={1.5}>
                      <SDTypography
                        variant="titleSm"
                        color="textHeading"
                        fontWeight="medium"
                      >
                        Total Token Value
                      </SDTypography>
                    </Box>
                    <SDTypography
                      variant="headlineSm"
                      color="textHeading"
                      fontWeight="bold"
                    >
                      ${(totalBalance || 0).toFixed(2)}
                    </SDTypography>
                  </Box>
                  <Box
                    p={3}
                    pb={6}
                    bgcolor="#F2F2F8"
                    border="1px solid rgba(234, 236, 240, 0.6)"
                    borderRadius={8}
                  >
                    <Box mb={1.5}>
                      <SDTypography
                        variant="titleSm"
                        color="textHeading"
                        fontWeight="medium"
                      >
                        Number of Tokens
                      </SDTypography>
                    </Box>
                    <SDTypography
                      variant="headlineSm"
                      color="textHeading"
                      fontWeight="bold"
                    >
                      {totalItems || 0}
                    </SDTypography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box border="1px solid #EAECF0" borderRadius={8} p={3}>
                    <SDTypography
                      variant="titleSm"
                      color="textHeading"
                      fontWeight="medium"
                    >
                      Token Value Breakdown
                    </SDTypography>
                    <Box display="flex" justifyContent="center" mt={4}>
                      {(charItemsToRender?.data?.length || 0) > 0 && (
                        <Box maxWidth="190px" mr={5}>
                          {totalBalance == 0 ? (
                            <Box
                              width={190}
                              height={190}
                              borderRadius={125}
                              bgcolor="#f0f0f0"
                            />
                          ) : (
                            <Pie
                              options={chartOptions}
                              data={{
                                labels: charItemsToRender?.labels,
                                datasets: [
                                  {
                                    data: charItemsToRender?.data,
                                    backgroundColor:
                                      charItemsToRender?.data?.reduce(
                                        (acc, _, index) => {
                                          acc = [
                                            ...acc,
                                            colorGenarator(
                                              index *
                                                (1 /
                                                  (charItemsToRender.data
                                                    .length - 1 || 1)),
                                            ).hex(),
                                          ];
                                          return acc;
                                        },
                                        [] as string[],
                                      ) ?? "#7F79B0",
                                    borderWidth: 0,
                                  },
                                ],
                              }}
                            />
                          )}
                        </Box>
                      )}
                      {(charItemsToRender?.data?.length || 0) > 0 && (
                        <Box mt={2} maxHeight={245} overflow="auto">
                          {charItemsToRender?.data?.map((item, index) => {
                            return (
                              <Box mb={0.5}>
                                <Box display="flex" alignItems="center">
                                  <Box
                                    mr={2}
                                    width={8}
                                    height={8}
                                    borderRadius={4}
                                    bgcolor={colorGenarator(
                                      index *
                                        (1 /
                                          (charItemsToRender.data.length - 1 ||
                                            1)),
                                    ).hex()}
                                  />
                                  <SDTypography
                                    variant="bodyLg"
                                    fontWeight="medium"
                                  >
                                    {charItemsToRender.labels[index]}
                                  </SDTypography>
                                </Box>
                                <Box ml={2.5} mt={0.5}>
                                  <SDTypography
                                    variant="bodyLg"
                                    fontWeight="medium"
                                    color="textHeading"
                                  >
                                    {(
                                      (100 * item) /
                                      (totalBalance || 1)
                                    ).toFixed(2)}
                                    %
                                  </SDTypography>
                                </Box>
                              </Box>
                            );
                          })}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Box mb={3} />
              <Table data={tokensToRender} columns={columns} />
            </>
          ) : (
            <EmptyItem />
          )}
        </Card>
      )}
    </>
  );
};
