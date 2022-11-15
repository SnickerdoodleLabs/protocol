import { Metaplex, getAssetsFromJsonMetadata } from "@metaplex-foundation/js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
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
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  clusterApiUrl,
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
} from "@solana/web3.js";
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
  private mainnet_connection = new Connection(clusterApiUrl("mainnet-beta"));
  private mainnet_metaplex = new Metaplex(this.mainnet_connection);

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
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
      .get<
        {
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
        }[]
      >(new URL(url))
      .andThen((balances) => {
        return ResultUtils.combine(
          balances.map((balance) => {
            return ResultUtils.combine([
              this.tokenPriceRepo.getTokenInfo(chainId, balance.tokenAddress),
              this.tokenPriceRepo.getTokenPrice(
                chainId,
                balance.tokenAddress,
                new Date(),
              ),
            ]).andThen(([tokenInfo, tokenPrice]) => {
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
                  BigNumberString(tokenPrice.toString()),
                ),
              );
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
          )
            .andThen((nativeBalance) => {
              return okAsync(
                new TokenBalance(
                  EChainTechnology.Solana,
                  TickerSymbol("SOL"),
                  chainId,
                  null,
                  accountAddress,
                  BigNumberString(nativeBalance.toString()),
                  BigNumberString("0"),
                ),
              );
            })
            .map((nativeBalance) => {
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
      .andThen((nfts) => {
        return okAsync(
          nfts.map((nft) => {
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
          }),
        );
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
    switch (chainId) {
      case ChainId(EChain.Solana):
        return okAsync([this.mainnet_connection, this.mainnet_metaplex]);
      default:
        return errAsync(
          new AccountIndexingError("invalid chain id for solana"),
        );
    }
  }
}
