import { MoralisConfigValues } from "@moralisweb3/core";
import { MoralisEvmApi } from "@moralisweb3/evm-api";
import { EvmAddress } from "@moralisweb3/evm-utils";
import {
  IAxiosAjaxUtilsType,
  IAxiosAjaxUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  AjaxError,
  ChainId,
  EVMAccountAddress,
  EVMNFT,
  AccountIndexingError,
  EVMTransaction,
  IEVMAccountBalanceRepository,
  IEVMNftRepository,
  IEVMTransactionRepository,
  TickerSymbol,
  BigNumberString,
  EVMContractAddress,
  TokenUri,
  UnixTimestamp,
  EVMTransactionHash,
  TokenBalance,
  EChainTechnology,
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
const evmApi = (pkg as any).default.EvmApi as MoralisEvmApi;

export class MoralisEVMIndexer
  implements
    IEVMAccountBalanceRepository,
    IEVMNftRepository,
    IEVMTransactionRepository
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
      ).map(() => {
        this._initialized = true;
        return undefined;
      });
    });
  }

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.initialize(),
    ]).andThen(([config]) => {
      if (!config.chainInformation.has(chainId)) {
        return errAsync(new AccountIndexingError("unsupported chain"));
      }

      return ResultUtils.combine([
        ResultAsync.fromPromise(
          evmApi.balance.getNativeBalance({
            chain: `0x${chainId.toString(16)}`,
            address: accountAddress,
          }),
          (e) => new AccountIndexingError("error getting native balance", e),
        ).andThen((response) => {
          // response.result.balance
          if (!config.chainInformation.has(chainId)) {
            return errAsync(new AccountIndexingError("unsupported chain"));
          }

          const ticker =
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            config.chainInformation.get(chainId)!.nativeCurrency.symbol;
          return okAsync(
            new TokenBalance(
              EChainTechnology.EVM,
              TickerSymbol(ticker),
              chainId,
              null,
              accountAddress,
              BigNumberString(response.result.balance.ether),
              BigNumberString(response.result.balance.value.toString()), // unsure about this
            ),
          );
        }),
        ResultAsync.fromPromise(
          evmApi.token.getWalletTokenBalances({
            chain: this._getChainStr(chainId),
            address: accountAddress,
          }),
          (e) => new AccountIndexingError("error getting token balances", e),
        ).andThen((response) => {
          return okAsync(
            response.result.map((item) => {
              const contract_addr: EvmAddress = item.token
                ? item.token.contractAddress
                : EvmAddress.ZERO_ADDRESS;

              return new TokenBalance(
                EChainTechnology.EVM,
                TickerSymbol(item.token ? item.token.symbol : "NULL"),
                chainId,
                EVMContractAddress(contract_addr.lowercase),
                accountAddress,
                BigNumberString(item.amount.toString()),
                BigNumberString(item.value), // unsure about this
              );
            }),
          );
        }),
      ]).map(([nativeBalance, tokenBalances]) => [
        nativeBalance,
        ...tokenBalances,
      ]);
    });
  }

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<EVMNFT[], AccountIndexingError> {
    return this.initialize().andThen(() => {
      return ResultAsync.fromPromise(
        evmApi.nft.getWalletNFTs({
          chain: this._getChainStr(chainId),
          address: accountAddress,
        }),
        (e) => new AccountIndexingError("error getting wallet nfts", e),
      ).map((response) => {
        return response.toJSON().map((item) => {
          return new EVMNFT(
            EVMContractAddress(item.tokenAddress),
            BigNumberString(item.tokenId.toString()),
            item.contractType ?? "NULL",
            EVMAccountAddress(item.ownerOf ?? "NULL"),
            TokenUri(item.tokenUri ?? "NULL"),
            JSON.stringify(item.metadata),
            BigNumberString(item.amount?.toString() ?? "-1"),
            item.name ?? "NULL",
            TickerSymbol(item.symbol ?? "NULL"),
            chainId,
          );
        });
      });
    });
  }

  public getEVMTransactions(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.initialize(),
    ]).andThen(() => {
      return ResultAsync.fromPromise(
        evmApi.transaction.getWalletTransactions({
          chain: this._getChainStr(chainId),
          address: accountAddress,
          toDate: endTime?.toUTCString(),
          fromDate: startTime?.toUTCString(),
        }),
        (e) => new AccountIndexingError("error getting transactions", e),
      ).andThen((response) => {
        console.log(response.raw);
        return okAsync(
          response.result.map((item) => {
            return new EVMTransaction(
              chainId,
              EVMTransactionHash(item.hash),
              UnixTimestamp(Number(item.blockTimestamp)),
              EVMAccountAddress(item.to?.lowercase ?? "NULL"),
              EVMAccountAddress(item.from.lowercase),
              BigNumberString(item.value?.ether ?? "0"),
              BigNumberString(item.gasPrice.toString() ?? "-1"),
              BigNumberString(item.gas?.toString() ?? "-1"),
              BigNumberString(item.gasUsed.toString() ?? "-1"),
              null,
              0,
            );
          }),
        );
      });
    });
  }

  // public getTokenTransfers(chainId: ChainId, acc):

  private _getChainStr(chainId: ChainId): string {
    return `0x${chainId.toString(16)}`;
  }
}
