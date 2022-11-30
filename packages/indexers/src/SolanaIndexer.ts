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
} from "@snickerdoodlelabs/objects";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

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
    if (chainId != ChainId(EChain.Solana)) {
      return errAsync(
        new AccountIndexingError("invalid chain id for solana", chainId),
      );
    }

    const url = urlJoinP("https://public-api.solscan.io/account/tokens", [], {
      account: accountAddress,
    });
    return this.ajaxUtils
      .get<ISolscanBalanceResponse>(new URL(url))
      .andThen((balances) => {
        return ResultUtils.combine(
          balances.map((balance) => {
            return ResultUtils.combine([
              this.tokenPriceRepo.getTokenInfo(chainId, balance.tokenAddress),
              // disabling until we can stop the rate limit
              // this.tokenPriceRepo.getTokenPrice(
              //   chainId,
              //   balance.tokenAddress,
              //   new Date(),
              // ),
            ])
              .andThen(([tokenInfo]) => {
                if (tokenInfo == null) {
                  return okAsync(undefined);
                }

                return okAsync(
                  new TokenBalance(
                    EChainTechnology.Solana,
                    tokenInfo.symbol,
                    chainId,
                    tokenInfo.address,
                    accountAddress,
                    balance.tokenAmount.uiAmountString,
                    BigNumberString("0"),
                  ),
                );
              })
              .orElse((e) => {
                this.logUtils.error("error retrieving token info", e);
                return okAsync(undefined);
              });
          }),
        ).map((balances) => {
          return balances.filter(
            (balance) => balance != null,
          ) as TokenBalance[];
        });
      })
      .andThen((balances) => {
        return this._getConnectionForChainId(chainId).andThen(([conn]) => {
          return ResultAsync.fromPromise(
            conn.getBalance(new PublicKey(accountAddress)),
            (e) => new AccountIndexingError("error getting native balance"),
          ).map((nativeBalanceValue) => {
            const nativeBalance = new TokenBalance(
              EChainTechnology.Solana,
              TickerSymbol("SOL"),
              chainId,
              null,
              accountAddress,
              this._lamportsToSol(nativeBalanceValue),
              BigNumberString("0"),
            );
            return [nativeBalance, ...balances];
          });
        });
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
        return nfts.map((nft) => {
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
        });
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
        this._getConnectionForEndpoint(config.alchemyEndpoints.solana),
        this._getConnectionForEndpoint(config.alchemyEndpoints.solanaTestnet),
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

  private _lamportsToSol(lamports: number): BigNumberString {
    return BigNumberString((lamports / LAMPORTS_PER_SOL).toString());
  }
}

type SolClients = {
  mainnet: [Connection, Metaplex];
  testnet: [Connection, Metaplex];
};

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
