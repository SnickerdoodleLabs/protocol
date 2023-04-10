import {
  ILinkedAccount,
  useAppContext,
} from "@extension-onboarding/context/App";
import { IBalanceItem } from "@extension-onboarding/objects";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { NftMetadataParseUtils } from "@extension-onboarding/utils";
import {
  chainConfig,
  EChainType,
  ChainId,
  WalletNFT,
  EVMNFT,
  EChainTechnology,
  EChain,
  LinkedAccount,
  AccountAddress,
  formatValue,
} from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
declare const window: IWindowWithSdlDataWallet;

interface IDashboardContext {
  accountNFTs?: WalletNFT[];
  accountTestnetNFTs?: WalletNFT[];
  poapNFTs?: EVMNFT[];
  isNFTsLoading: boolean;
  accountBalances: IBalanceItem[];
  accountTestnetBalances: IBalanceItem[];
  balancesLoadingState: {
    balancesPartialyLoaded: boolean;
    balanceFetchCompleted: boolean;
    balancesIndicator: {
      completed: number;
      total: number;
    };
  };
}

const DashboardContext = createContext<IDashboardContext>(
  {} as IDashboardContext,
);

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

export const DashboardContextProvider: FC = ({ children }) => {
  const getInitialLoadidngStatus = (
    accounts: ILinkedAccount[],
  ): Record<ChainId, Record<AccountAddress, boolean>> =>
    [...mainnetSupportedChainIds, ...testnetSupportedChainIds].reduce(
      (upperAcc, chainId) => {
        return {
          ...upperAcc,
          [chainId]: accounts.reduce((acc, account) => {
            return { ...acc, [account.accountInfo.sourceAccountAddress]: true };
          }, {}),
        };
      },
      {} as Record<ChainId, Record<AccountAddress, boolean>>,
    );

  const [accountNFTs, setAccountNFTs] = useState<WalletNFT[]>();
  const [poapNFTs, setPoapNFTs] = useState<EVMNFT[]>();
  const [accountTestnetNFTs, setAccountTestnetNFTs] = useState<WalletNFT[]>();
  const [isNFTsLoading, setIsNFTsLoading] = useState(true);
  const { linkedAccounts } = useAppContext();

  const [accountBalances, setAccountBalances] = useState<IBalanceItem[]>([]);
  const [accountTestnetBalances, setAccountTestnetBalances] = useState<
    IBalanceItem[]
  >([]);

  const intialAccounts = useRef<ILinkedAccount[] | undefined>(linkedAccounts);

  const [balancesLoadingStatus, setBalancesLoadingStatus] = useState<
    Record<ChainId, Record<AccountAddress, boolean>>
  >(getInitialLoadidngStatus(linkedAccounts));

  useEffect(() => {
    subscribeToAccountAdding();
    return () => {
      removeAccountAddingSubscription();
    };
  }, []);

  // run only one time
  // load when linkedAccount has an item
  // handle with page refreshes

  useEffect(() => {
    if (
      !!intialAccounts.current &&
      !!linkedAccounts.length &&
      (JSON.stringify(intialAccounts.current) ===
        JSON.stringify(linkedAccounts) ||
        intialAccounts.current.length === 0)
    ) {
      // set flags
      if (intialAccounts.current?.length === 0) {
        setBalancesLoadingStatus(getInitialLoadidngStatus(linkedAccounts));
      }
      intialAccounts.current = undefined;
      // fetch initial balances
      loadBalancesSync();
    }
  }, [JSON.stringify(linkedAccounts)]);

  const subscribeToAccountAdding = () => {
    window?.sdlDataWallet?.on("onAccountAdded", onAccountAdded);
  };

  const removeAccountAddingSubscription = () => {
    window?.sdlDataWallet.removeListener("onAccountAdded", onAccountAdded);
  };

  const onAccountAdded = (notification: {
    data: { linkedAccount: LinkedAccount };
  }) => {
    // add account item to loading status
    updateLoadingStatusRecord(
      notification.data.linkedAccount.sourceAccountAddress,
    );
    // load balances only for newly added account
    loadBalancesForAllChains([notification.data.linkedAccount]);
  };

  const updateLoadingStatusRecord = (accountAddress: AccountAddress) => {
    setBalancesLoadingStatus((balancesLoadingStatus) => {
      Object.keys(balancesLoadingStatus).forEach(
        (chainId) =>
          (balancesLoadingStatus[chainId] = {
            ...balancesLoadingStatus[chainId],
            [accountAddress]: true,
          }),
      );
      return balancesLoadingStatus;
    });
  };

  const updateLoadingFlag = (
    chainId: ChainId,
    accountAddress: AccountAddress,
  ) => {
    setBalancesLoadingStatus((balancesLoadingStatus) => ({
      ...balancesLoadingStatus,
      [chainId]: {
        ...balancesLoadingStatus[chainId],
        [accountAddress]: false,
      },
    }));
  };

  const getBalanceForChainIDAndAccount = (
    chainID: ChainId,
    account: LinkedAccount,
  ) => {
    window.sdlDataWallet
      .getAccountBalances([chainID], [account])
      .map((balances) =>
        balances.map((b) => ({ ...b, balance: formatValue(b) })),
      )
      .andThen((balanceResults) =>
        ResultUtils.combine(
          balanceResults.map((balanceItem) =>
            window.sdlDataWallet
              .getTokenInfo(balanceItem.chainId, balanceItem.tokenAddress)
              .orElse((e) => okAsync(null)),
          ),
        ).map((tokenInfo) =>
          balanceResults.map((balanceItem, index) => ({
            ...balanceItem,
            tokenInfo: tokenInfo[index],
          })),
        ),
      )
      .andThen((balancesWithTokenInfo) => {
        return (
          balancesWithTokenInfo.length
            ? window.sdlDataWallet.getTokenMarketData(
                balancesWithTokenInfo.map((item) => item.tokenInfo?.id ?? ""),
              )
            : okAsync([])
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
            if (!!combinedBalances.length) {
              if (mainnetSupportedChainIds.includes(chainID)) {
                setAccountBalances((accountBalances) => [
                  ...accountBalances,
                  ...combinedBalances,
                ]);
              } else {
                setAccountTestnetBalances((accountTestnetBalances) => [
                  ...accountTestnetBalances,
                  ...combinedBalances,
                ]);
              }
            }
            updateLoadingFlag(chainID, account.sourceAccountAddress);
          });
      });
  };

  const loadBalancesForAllChains = (accounts: LinkedAccount[]) => {
    [...testnetSupportedChainIds, ...mainnetSupportedChainIds].forEach(
      (chainID) => {
        accounts.forEach((linkedAccount) => {
          getBalanceForChainIDAndAccount(chainID, linkedAccount);
        });
      },
    );
  };

  const loadBalancesSync = () => {
    loadBalancesForAllChains(
      linkedAccounts.map((linkedAccount) => linkedAccount.accountInfo),
    );
  };

  const { balancesPartialyLoaded, balanceFetchCompleted, balancesIndicator } =
    useMemo(() => {
      const loadingStatusArr = Object.values(balancesLoadingStatus)
        .map((record) => Object.values(record))
        .flat();

      return {
        balanceFetchCompleted:
          !!loadingStatusArr.length &&
          loadingStatusArr.every((status) => status === false),
        balancesPartialyLoaded:
          !!loadingStatusArr.length &&
          loadingStatusArr.some((status) => status === false),
        balancesIndicator: {
          completed: loadingStatusArr.filter((status) => status === false)
            .length,
          total: loadingStatusArr.length,
        },
      };
    }, [JSON.stringify(balancesLoadingStatus)]);

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
            const isPopap =
              item.chain === EChain.Gnosis ||
              (item.type === EChainTechnology.EVM &&
                !!NftMetadataParseUtils.getParsedNFT(
                  JSON.stringify((item as EVMNFT).metadata) || "",
                ).event);

            if (isPopap) {
              acc.poapNfts = [...acc.poapNfts, item as EVMNFT];
              return acc;
            }
            if (isMainnetItem) {
              acc.mainnetNfts = [...acc.mainnetNfts, item];
              return acc;
            }
            acc.testnetNfts = [...acc.testnetNfts, item];
            return acc;
          },
          { mainnetNfts: [], testnetNfts: [], poapNfts: [] } as {
            mainnetNfts: WalletNFT[];
            testnetNfts: WalletNFT[];
            poapNfts: EVMNFT[];
          },
        );
        setAccountNFTs(structeredNfts.mainnetNfts);
        setAccountTestnetNFTs(structeredNfts.testnetNfts);
        setPoapNFTs(structeredNfts.poapNfts);
        setIsNFTsLoading(false);
      });
  };

  return (
    <DashboardContext.Provider
      value={{
        accountNFTs,
        accountTestnetNFTs,
        poapNFTs,
        isNFTsLoading,
        accountBalances,
        accountTestnetBalances,
        balancesLoadingState: {
          balancesPartialyLoaded,
          balanceFetchCompleted,
          balancesIndicator,
        },
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);
