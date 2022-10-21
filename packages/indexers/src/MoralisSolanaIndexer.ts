import { MoralisConfigValues } from "@moralisweb3/core";
import { MoralisSolApi } from "@moralisweb3/sol-api";
import {
  IAxiosAjaxUtilsType,
  IAxiosAjaxUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  ChainId,
  AccountIndexingError,
  ISolanaBalanceRepository,
  ISolanaNFTRepository,
  ISolanaTransactionRepository,
  SolanaAccountAddress,
  TokenBalance,
  SolanaNFT,
  SolanaTransaction,
  EChain,
  EChainTechnology,
  TickerSymbol,
  BigNumberString,
  SolanaNFTMetadata,
  SolanaTokenAddress,
} from "@snickerdoodlelabs/objects";
import { inject } from "inversify";
import pkg from "moralis";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IIndexerConfigProviderType,
  IIndexerConfigProvider,
} from "@indexers/IIndexerConfigProvider.js";

const start = (pkg as any).default.start as (
  providedConfig?: Partial<MoralisConfigValues> | undefined,
) => Promise<void>;
const solanaApi = (pkg as any).default.solanaApi as MoralisSolApi;

export class MoralisSolanaIndexer
  implements
    ISolanaBalanceRepository,
    ISolanaNFTRepository,
    ISolanaTransactionRepository
{
  private _initialized = false;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {}

  public initialize(): ResultAsync<void, AccountIndexingError> {
    if (this._initialized) {
      return okAsync(undefined);
    }

    return this.configProvider.getConfig().andThen((config) => {
      return ResultAsync.fromPromise(
        start({ apiKey: config.moralisApiKey }),
        (e) => new AccountIndexingError("error starting moralis client", e),
      );
    });
  }

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError> {
    return this.getNetworkIdFromChainId(chainId).andThen((networkId) => {
      return ResultUtils.combine([
        ResultAsync.fromPromise(
          solanaApi.account.getBalance({
            network: networkId,
            address: accountAddress,
          }),
          (e) => new AccountIndexingError("unable to fetch native balance", e),
        ).map(
          (response) =>
            new TokenBalance(
              EChainTechnology.Solana,
              TickerSymbol("SOL"),
              chainId,
              null,
              accountAddress,
              BigNumberString(response.raw.solana),
              BigNumberString("0"), //TODO: token pricing
            ),
        ),
        ResultAsync.fromPromise(
          solanaApi.account.getSPL({
            network: networkId,
            address: accountAddress,
          }),
          (e) => new AccountIndexingError("unable to fetch token balance", e),
        ).map((response) => {
          return response.raw.map((item) => {
            return new TokenBalance(
              EChainTechnology.Solana,
              TickerSymbol(item.associatedTokenAddress), // TODO: find a way to get this
              chainId,
              item.associatedTokenAddress,
              accountAddress,
              BigNumberString(item.amount),
              BigNumberString("0"), // TODO: token pricing
            );
          });
        }),
      ]).map(([nativeBalance, tokenBalances]) => [
        nativeBalance,
        ...tokenBalances,
      ]);
    });
  }

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<SolanaNFT[], AccountIndexingError> {
    this.getNetworkIdFromChainId(chainId).andThen((networkId) => {
      return ResultAsync.fromPromise(
        solanaApi.account.getNFTs({
          address: accountAddress,
          network: networkId,
        }),
        (e) => new AccountIndexingError("unable to get sol nfts", e),
      ).andThen((response) => {
        return ResultUtils.combine(
          response.raw.map((item) => {
            return ResultAsync.fromPromise(
              solanaApi.nft.getNFTMetadata({
                address: item.associatedTokenAddress,
                network: networkId,
              }),
              (e) => new AccountIndexingError("unable to get metadata", e),
            ).map((metadata) => {
              return new SolanaNFT(
                chainId,
                accountAddress,
                SolanaTokenAddress(item.associatedTokenAddress),
                item.mint,
                new SolanaNFTMetadata(
                  metadata.raw.mint,
                  metadata.raw.standard,
                  metadata.raw.name,
                  metadata.raw.symbol,
                  metadata.raw.metaplex,
                ),
              );
            });
          }),
        );
      });
    });

    return okAsync([]);
  }

  public getSolanaTransactions(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<SolanaTransaction[], AccountIndexingError> {
    return okAsync([]);
  }

  private getNetworkIdFromChainId(
    chainId: ChainId,
  ): ResultAsync<string, AccountIndexingError> {
    switch (chainId) {
      case EChain.Solana:
        return okAsync("mainnet");
      case EChain.SolanaTestnet:
        return okAsync("devnet");
      default:
        return errAsync(new AccountIndexingError("invalid chainID"));
    }
  }
}
