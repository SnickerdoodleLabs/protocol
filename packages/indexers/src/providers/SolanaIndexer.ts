import { Metaplex } from "@metaplex-foundation/js";
import {
  ILogUtils,
  ILogUtilsType,
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountIndexingError,
  AjaxError,
  SolanaAccountAddress,
  TokenBalance,
  SolanaNFT,
  SolanaTransaction,
  EChain,
  URLString,
  SolanaTokenAddress,
  BigNumberString,
  EChainTechnology,
  ITokenPriceRepositoryType,
  ITokenPriceRepository,
  TickerSymbol,
  SolanaCollection,
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
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
  IIndexerContextProvider,
  IIndexerContextProviderType,
  ISolanaIndexer,
} from "@indexers/interfaces/index.js";
import { MasterIndexer } from "@indexers/MasterIndexer.js";

@injectable()
export class SolanaIndexer implements ISolanaIndexer {
  protected health: Map<EChain, EComponentStatus> = new Map<
    EChain,
    EComponentStatus
  >();
  protected indexerSupport = new Map<EChain, IndexerSupportSummary>([
    [EChain.Solana, new IndexerSupportSummary(EChain.Solana, true, true, true)],
    [
      EChain.SolanaTestnet,
      new IndexerSupportSummary(EChain.SolanaTestnet, true, true, true),
    ],
  ]);

  protected solanaApiKey: string | null = null;
  protected solanaTestnetApiKey: string | null = null;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IIndexerContextProviderType)
    protected contextProvider: IIndexerContextProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {}

  public initialize(): ResultAsync<void, never> {
    return this.configProvider.getConfig().map((config) => {
      // Solana Mainnet
      if (
        config.apiKeys.alchemyApiKeys.Solana == "" ||
        config.apiKeys.alchemyApiKeys.Solana == null
      ) {
        this.health.set(EChain.Solana, EComponentStatus.NoKeyProvided);
      } else {
        this.health.set(EChain.Solana, EComponentStatus.Available);
      }

      // Solana Testnet
      if (
        config.apiKeys.alchemyApiKeys.SolanaTestnet == "" ||
        config.apiKeys.alchemyApiKeys.SolanaTestnet == null
      ) {
        this.health.set(EChain.SolanaTestnet, EComponentStatus.NoKeyProvided);
      } else {
        this.health.set(EChain.SolanaTestnet, EComponentStatus.Available);
      }

      this.solanaApiKey = config.apiKeys.alchemyApiKeys.Solana;
      this.solanaTestnetApiKey = config.apiKeys.alchemyApiKeys.SolanaTestnet;
    });
  }

  public name(): EDataProvider {
    return EDataProvider.Solana;
  }

  public getBalancesForAccount(
    chain: EChain,
    accountAddress: SolanaAccountAddress,
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
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<SolanaNFT[], AccountIndexingError | AjaxError> {
    const connection = this._getConnectionForChainId(chain);
    if (connection == null) {
      return okAsync([]);
    }
    const [conn, metaplex] = connection;
    return this.contextProvider
      .getContext()
      .andThen((context) => {
        context.privateEvents.onApiAccessed.next(EExternalApi.Solana);
        return ResultAsync.fromPromise(
          metaplex
            .nfts()
            .findAllByOwner({ owner: new PublicKey(accountAddress) }),
          (e) => new AccountIndexingError("error finding sol nfts", e),
        );
      })
      .orElse((e) => {
        this.logUtils.error("error fetching solana nfts", e);
        return okAsync([]);
      })
      .map((nfts) => {
        return nfts
          .map((nft) => {
            return new SolanaNFT(
              chain,
              accountAddress,
              SolanaTokenAddress(nft.address.toBase58()),
              nft.collection
                ? new SolanaCollection(
                    SolanaTokenAddress(nft.collection?.address.toBase58()),
                    nft.collection?.verified,
                  )
                : null,
              nft.uri,
              nft.isMutable,
              nft.primarySaleHappened,
              nft.sellerFeeBasisPoints,
              SolanaAccountAddress(nft.updateAuthorityAddress.toBase58()),
              nft.tokenStandard,
              TickerSymbol(nft.symbol),
              nft.name,
              BigNumberString("1"),
              this.timeUtils.getUnixNow(),
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
  public getSolanaTransactions(
    chain: EChain,
    accountAddress: SolanaAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<SolanaTransaction[], AccountIndexingError | AjaxError> {
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
    accountAddress: SolanaAccountAddress,
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
                  EChainTechnology.Solana,
                  tokenInfo.symbol,
                  chain,
                  tokenInfo.address ?? MasterIndexer.nativeAddress,
                  accountAddress,
                  BigNumberString(
                    BigInt(
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
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<TokenBalance, AccountIndexingError | AjaxError> {
    const publicKey = new PublicKey(accountAddress);

    const connection = this._getConnectionForChainId(chain);
    if (connection == null) {
      return okAsync(
        new TokenBalance(
          EChainTechnology.Solana,
          TickerSymbol("SOL"),
          chain,
          MasterIndexer.nativeAddress,
          accountAddress,
          BigNumberString(BigInt(0).toString()),
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
        context.privateEvents.onApiAccessed.next(EExternalApi.Solana);
        return ResultAsync.fromPromise(conn.getBalance(publicKey), (e) => {
          return new AccountIndexingError(
            "Error getting Solana native balance",
            e,
          );
        });
      })
      .map((balance) => {
        const nativeBalance = new TokenBalance(
          EChainTechnology.Solana,
          TickerSymbol("SOL"),
          chain,
          MasterIndexer.nativeAddress,
          accountAddress,
          BigNumberString(BigInt(balance).toString()),
          getChainInfoByChain(chain).nativeCurrency.decimals,
        );
        return nativeBalance;
      });
  }

  private _getConnectionForChainId(
    chain: EChain,
  ): [Connection, Metaplex] | null {
    if (chain === EChain.Solana && this.solanaApiKey != null) {
      const mainnet = URLString(
        "https://solana-mainnet.g.alchemy.com/v2/" + this.solanaApiKey,
      );
      return this._getConnectionForEndpoint(mainnet);
    } else if (
      chain === EChain.SolanaTestnet &&
      this.solanaTestnetApiKey != null
    ) {
      const testnet = URLString(
        "https://solana-devnet.g.alchemy.com/v2/" + this.solanaTestnetApiKey,
      );
      return this._getConnectionForEndpoint(testnet);
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
    accountAddress: SolanaAccountAddress,
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
        context.privateEvents.onApiAccessed.next(EExternalApi.Solana);
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
    accountAddress: SolanaAccountAddress,
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
  tokenAddress: SolanaTokenAddress;
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
