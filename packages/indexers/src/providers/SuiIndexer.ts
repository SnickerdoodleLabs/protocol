import { Metaplex } from "@metaplex-foundation/js";
import {
  ILogUtils,
  ILogUtilsType,
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountIndexingError,
  AjaxError,
  SuiAccountAddress,
  TokenBalance,
  SuiNFT,
  SuiTransaction,
  EChain,
  URLString,
  SuiTokenAddress,
  BigNumberString,
  EChainTechnology,
  ITokenPriceRepositoryType,
  ITokenPriceRepository,
  TickerSymbol,
  SuiCollection,
  EComponentStatus,
  IndexerSupportSummary,
  EDataProvider,
  EExternalApi,
  getChainInfoByChain,
} from "@snickerdoodlelabs/objects";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  GetProgramAccountsFilter,
  AccountInfo,
  ParsedAccountData,
} from "@solana/web3.js";
import { BigNumber } from "ethers";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
  IIndexerContextProvider,
  IIndexerContextProviderType,
  ISuiIndexer,
} from "@indexers/interfaces/index.js";
import { MasterIndexer } from "@indexers/MasterIndexer.js";

@injectable()
export class SuiIndexer implements ISuiIndexer {
  protected health: Map<EChain, EComponentStatus> = new Map<
    EChain,
    EComponentStatus
  >();
  protected indexerSupport = new Map<EChain, IndexerSupportSummary>([
    [EChain.Sui, new IndexerSupportSummary(EChain.Sui, true, true, true)],
  ]);

  protected suiApiKey: string | null = null;
  // protected suiTestnetApiKey: string | null = null;
  //   protected suiTestnetApiKey: string | null = null;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IIndexerContextProviderType)
    protected contextProvider: IIndexerContextProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public initialize(): ResultAsync<void, never> {
    return this.configProvider.getConfig().map((config) => {
      // Sui Mainnet
      if (this.suiApiKey == "" || this.suiApiKey == null) {
        this.health.set(EChain.Sui, EComponentStatus.NoKeyProvided);
      } else {
        this.health.set(EChain.Sui, EComponentStatus.Available);
      }

      // Sui Testnet
      //   if (
      //     config.apiKeys.alchemyApiKeys.SuiTestnet == "" ||
      //     config.apiKeys.alchemyApiKeys.SuiTestnet == null
      //   ) {
      //     this.health.set(EChain.SuiTestnet, EComponentStatus.NoKeyProvided);
      //   } else {
      //     this.health.set(EChain.SuiTestnet, EComponentStatus.Available);
      //   }

      this.suiApiKey = ""; //config.apiKeys.alchemyApiKeys.Sui;
      // this.suiTestnetApiKey = config.apiKeys.alchemyApiKeys.SuiTestnet;
    });
  }

  public name(): string {
    return EDataProvider.Sui;
  }

  public getBalancesForAccount(
    chain: EChain,
    accountAddress: SuiAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    // return okAsync([]);
    return ResultUtils.combine([
      this.getNonNativeBalance(chain, accountAddress),
      this.getNativeBalance(chain, accountAddress),
    ]).map(([nonNativeBalance, nativeBalance]) => {
      if (nonNativeBalance.length == 0) {
        return [nativeBalance];
      }
      return [nativeBalance, ...nonNativeBalance];
    });
  }

  public getTokensForAccount(
    chain: EChain,
    accountAddress: SuiAccountAddress,
  ): ResultAsync<SuiNFT[], AccountIndexingError | AjaxError> {
    const connection = this._getConnectionForChainId(chain);
    if (connection == null) {
      return okAsync([]);
    }
    const [conn, metaplex] = connection;
    return this.contextProvider
      .getContext()
      .andThen((context) => {
        context.privateEvents.onApiAccessed.next(EExternalApi.Sui);
        return ResultAsync.fromPromise(
          metaplex
            .nfts()
            .findAllByOwner({ owner: new PublicKey(accountAddress) }),
          (e) => new AccountIndexingError("error finding sol nfts", e),
        );
      })
      .orElse((e) => {
        this.logUtils.error(
          `In SuiIndexer, error received while fetching NFTs for chain ${chain} for account ${accountAddress}`,
          e,
        );
        return okAsync([]);
      })
      .map((nfts) => {
        return nfts
          .map((nft) => {
            return new SuiNFT(
              chain,
              accountAddress,
              SuiTokenAddress(nft.address.toBase58()),
              nft.collection
                ? new SuiCollection(
                    SuiTokenAddress(nft.collection?.address.toBase58()),
                    nft.collection?.verified,
                  )
                : null,
              nft.uri,
              nft.isMutable,
              nft.primarySaleHappened,
              nft.sellerFeeBasisPoints,
              SuiAccountAddress(nft.updateAuthorityAddress.toBase58()),
              nft.tokenStandard,
              TickerSymbol(nft.symbol),
              nft.name,
            );
          })
          .filter((val, i, arr) => {
            return (
              i ==
              arr.findIndex((ind) => {
                return ind.mint == val.mint;
              })
            );
          }); // remove duplicates
      });
  }
  public getSuiTransactions(
    chain: EChain,
    accountAddress: SuiAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<SuiTransaction[], AccountIndexingError | AjaxError> {
    return okAsync([]); //TODO
  }

  public healthStatus(): Map<EChain, EComponentStatus> {
    return this.health;
  }

  public getSupportedChains(): Map<EChain, IndexerSupportSummary> {
    return this.indexerSupport;
  }

  private getNonNativeBalance(
    chain: EChain,
    accountAddress: SuiAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    return this._getParsedAccounts(chain, accountAddress)
      .andThen((accounts) => {
        return ResultUtils.combine(
          accounts.map((account) => {
            return this.tokenPriceRepo
              .getTokenInfo(chain, account.data["parsed"]["info"]["mint"])
              .map((tokenInfo) => {
                if (tokenInfo == null) {
                  return null;
                }
                return new TokenBalance(
                  EChainTechnology.Sui,
                  tokenInfo.symbol,
                  chain,
                  tokenInfo.address ?? MasterIndexer.nativeAddress,
                  accountAddress,
                  BigNumberString(
                    BigNumber.from(
                      account.data["parsed"]["info"]["tokenAmount"]["amount"],
                    ).toString(),
                  ),
                  account.data["parsed"]["info"]["tokenAmount"]["decimals"],
                );
              });
          }),
        );
      })
      .map((balances) => {
        return balances.filter((obj) => obj != null) as TokenBalance[];
      });
  }
  private getNativeBalance(
    chain: EChain,
    accountAddress: SuiAccountAddress,
  ): ResultAsync<TokenBalance, AccountIndexingError | AjaxError> {
    const publicKey = new PublicKey(accountAddress);

    const connection = this._getConnectionForChainId(chain);
    if (connection == null) {
      return okAsync(
        new TokenBalance(
          EChainTechnology.Sui,
          TickerSymbol("SUI"),
          chain,
          MasterIndexer.nativeAddress,
          accountAddress,
          BigNumberString(BigNumber.from(0).toString()),
          getChainInfoByChain(chain).nativeCurrency.decimals,
        ),
      );
    }
    const [conn] = connection;

    return ResultUtils.combine([
      this._getFilters(accountAddress),
      this.contextProvider.getContext(),
    ])
      .andThen(([_filters, context]) => {
        context.privateEvents.onApiAccessed.next(EExternalApi.Sui);
        return ResultAsync.fromPromise(conn.getBalance(publicKey), (e) => {
          return new AccountIndexingError(
            "Error getting Sui native balance",
            e,
          );
        });
      })
      .map((balance) => {
        const nativeBalance = new TokenBalance(
          EChainTechnology.Sui,
          TickerSymbol("SUI"),
          chain,
          MasterIndexer.nativeAddress,
          accountAddress,
          BigNumberString(BigNumber.from(balance).toString()),
          getChainInfoByChain(chain).nativeCurrency.decimals,
        );
        return nativeBalance;
      });
  }

  private _getConnectionForChainId(
    chain: EChain,
  ): [Connection, Metaplex] | null {
    if (chain === EChain.Sui && this.suiApiKey != null) {
      const mainnet = URLString(
        "https://solana-mainnet.g.alchemy.com/v2/" + this.suiApiKey,
      );
      return this._getConnectionForEndpoint(mainnet);
      // }
      // else if (chain === EChain.SuiTestnet && this.suiTestnetApiKey != null) {
      //   const testnet = URLString(
      //     "https://api.blockvision.org/v2/sui/nft/nftActivity?objectId=0x2db7f2d02dfa110905b0ecbd1f210316e8a70636615384429823958ed46ab6a0&pageIndex=1&pageSize=20" +
      //       this.suiTestnetApiKey,
      //   );
      //   return this._getConnectionForEndpoint(testnet);
    } else {
      return null;
    }
  }

  private _getConnectionForEndpoint(endpoint: string): [Connection, Metaplex] {
    const connection = new Connection(endpoint);
    const metaplex = new Metaplex(connection);
    return [connection, metaplex];
  }

  private _getParsedAccounts(
    chain: EChain,
    accountAddress: SuiAccountAddress,
  ): ResultAsync<
    AccountInfo<Buffer | ParsedAccountData>[],
    AccountIndexingError
  > {
    const connection = this._getConnectionForChainId(chain);
    if (connection == null) {
      return okAsync([]);
    }
    const [conn] = connection;
    return ResultUtils.combine([
      this._getFilters(accountAddress),
      this.contextProvider.getContext(),
    ])
      .andThen(([filters, context]) => {
        context.privateEvents.onApiAccessed.next(EExternalApi.Sui);
        return ResultAsync.fromPromise(
          conn.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
            filters: filters,
          }),
          (e) => {
            return new AccountIndexingError("", e);
          },
        );
      })
      .map((accounts) => {
        return accounts.map((account) => {
          return account.account;
        });
      });
  }
  private _getFilters(
    accountAddress: SuiAccountAddress,
  ): ResultAsync<GetProgramAccountsFilter[], never> {
    const filters: GetProgramAccountsFilter[] = [
      {
        dataSize: 165, //size of account (bytes)
      },
      {
        memcmp: {
          offset: 32, //location of our query in the account (bytes)
          bytes: accountAddress, //our search criteria, a base58 encoded string
        },
      },
    ];
    return okAsync(filters);
  }
  private _lamportsToSol(lamports: number): BigNumberString {
    return BigNumberString((lamports / LAMPORTS_PER_SOL).toString());
  }
}
interface ISolClients {
  mainnet: [Connection, Metaplex];
  testnet: [Connection, Metaplex];
}

type ISolscanBalanceResponse = {
  tokenAddress: SuiTokenAddress;
  tokenAmount: {
    amount: BigNumberString;
    decimals: number;
    uiAmount: number;
    uiAmountString: BigNumberString;
  };
  tokenAccount: string;
  tokenName: string;
  tokenIcon: URLString;
  rentEpoch: number;
  lamports: number;
}[];
type IAlchemyBalanceResponse = {
  id: number;
  jsonrpc: string;
  result: {
    context: {
      slot: number;
    };
    value: {
      amount: string;
      decimals: number;
      uiAmountString: string;
    };
  };
};
