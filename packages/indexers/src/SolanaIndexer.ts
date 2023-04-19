import { Metaplex } from "@metaplex-foundation/js";
import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountIndexingError,
  AjaxError,
  ChainId,
  ISolanaBalanceRepository,
  ISolanaNFTRepository,
  ISolanaTransactionRepository,
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
  getChainInfoByChainId,
} from "@snickerdoodlelabs/objects";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  GetProgramAccountsFilter,
} from "@solana/web3.js";
import { BigNumber } from "ethers";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";

export class SolanaIndexer
  implements
    ISolanaBalanceRepository,
    ISolanaNFTRepository,
    ISolanaTransactionRepository
{
  private _connections?: ResultAsync<SolClients, never>;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this.getNonNativeBalance(chainId, accountAddress),
      this.getNativeBalance(chainId, accountAddress),
    ]).map(([nonNativeBalance, nativeBalance]) => {
      return [nativeBalance, ...nonNativeBalance];
    });
  }

  private getNonNativeBalance(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this._getParsedAccounts(chainId, accountAddress),
    ])
      .map(([accounts]) => {
        return accounts.map((account) => {
          return this.tokenPriceRepo
            .getTokenInfo(
              chainId,
              account?.account?.data["parsed"]["info"]["mint"],
            )
            .andThen((tokenInfo) => {
              if (tokenInfo == null) {
                return okAsync(null);
              }
              return okAsync(
                new TokenBalance(
                  EChainTechnology.Solana,
                  tokenInfo.symbol,
                  chainId,
                  tokenInfo.address,
                  accountAddress,
                  BigNumberString(
                    BigNumber.from(
                      account?.account?.data["parsed"]["info"]["tokenAmount"][
                        "amount"
                      ],
                    ).toString(),
                  ),
                  account?.account?.data["parsed"]["info"]["tokenAmount"][
                    "decimals"
                  ],
                ),
              );
            });
        });
      })
      .map((balances) => {
        return Promise.all(balances).then((balance) => {
          return (
            balance
              //@ts-ignore
              .filter((obj) => obj.value != null)
              .map((tokenBalance) => {
                //@ts-ignore
                return tokenBalance.value;
              })
          );
        });
      });
  }

  private getNativeBalance(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<TokenBalance, AccountIndexingError | AjaxError> {
    const publicKey = new PublicKey(accountAddress);
    return ResultUtils.combine([
      this._getConnectionForChainId(chainId),
      this._getFilters(accountAddress),
    ])
      .map(async ([[conn], filters]) => {
        const balance = await conn.getBalance(publicKey);
        return balance;
      })
      .andThen((balance: number) => {
        const nativeBalance = new TokenBalance(
          EChainTechnology.Solana,
          TickerSymbol("SOL"),
          chainId,
          null,
          accountAddress,
          BigNumberString(BigNumber.from(balance).toString()),
          getChainInfoByChainId(chainId).nativeCurrency.decimals,
        );
        return okAsync(nativeBalance);
      });
  }

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<SolanaNFT[], AccountIndexingError | AjaxError> {
    return this._getConnectionForChainId(chainId)
      .andThen(([conn, metaplex]) => {
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
              chainId,
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
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<SolanaTransaction[], AccountIndexingError | AjaxError> {
    return okAsync([]); //TODO
  }

  private _getConnectionForChainId(
    chainId: ChainId,
  ): ResultAsync<[Connection, Metaplex], AccountIndexingError> {
    return this._getConnections().andThen((connections) => {
      switch (chainId) {
        case ChainId(EChain.Solana):
          return okAsync(connections.mainnet);
        case ChainId(EChain.SolanaTestnet):
          return okAsync(connections.testnet);
        default:
          return errAsync(
            new AccountIndexingError("invalid chain id for solana"),
          );
      }
    });
  }

  private _getConnections(): ResultAsync<SolClients, never> {
    if (this._connections) {
      return this._connections;
    }

    this._connections = this.configProvider.getConfig().andThen((config) => {
      return ResultUtils.combine([
        this._getConnectionForEndpoint(
          config.alchemyEndpoints.get(EChain.Solana)!,
        ),
        this._getConnectionForEndpoint(
          config.alchemyEndpoints.get(EChain.SolanaTestnet)!,
        ),
      ]).map(([mainnet, testnet]) => {
        return {
          mainnet,
          testnet,
        };
      });
    });

    return this._connections;
  }

  private _getConnectionForEndpoint(
    endpoint: string,
  ): ResultAsync<[Connection, Metaplex], never> {
    const connection = new Connection(endpoint);
    const metaplex = new Metaplex(connection);
    return okAsync([connection, metaplex]);
  }

  private _getParsedAccounts(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ) {
    return ResultUtils.combine([
      this._getConnectionForChainId(chainId),
      this._getFilters(accountAddress),
    ]).map(async ([[conn], filters]) => {
      const accounts = await conn.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
        filters: filters,
      });
      const balances = accounts.map((account) => {
        return account;
      });
      return balances;
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

interface SolClients {
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
