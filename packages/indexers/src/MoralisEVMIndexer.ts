import { MoralisConfigValues } from "@moralisweb3/core";
import { MoralisEvmApi } from "@moralisweb3/evm-api";
import { EvmAddress } from "@moralisweb3/evm-utils";
import {
  IAxiosAjaxUtilsType,
  IAxiosAjaxUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountBalanceError,
  AjaxError,
  ChainId,
  EVMAccountAddress,
  EVMBalance,
  AccountNFTError,
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
  ) {
    console.log(pkg);
  }

  public initialize<E>(): ResultAsync<void, E> {
    if (this._initialized) {
      return okAsync(undefined);
    }

    return this.configProvider.getConfig().andThen((config) => {
      return ResultAsync.fromPromise(
        start({ apiKey: config.moralisApiKey }),
        (e) => e as E,
      );
    });
  }

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<EVMBalance[], AjaxError | AccountBalanceError> {
    console.log(chainId, accountAddress);
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.initialize<AccountBalanceError>(),
    ]).andThen(([config]) => {
      return ResultAsync.fromPromise(
        evmApi.balance.getNativeBalance({
          chain: `0x${chainId.toString(16)}`,
          address: accountAddress,
        }),
        (e) => e as AccountBalanceError,
      ).andThen((response) => {
        // response.result.balance
        if (!config.chainInformation.has(chainId)) {
          return errAsync(new AccountBalanceError("unsupported chain"));
        }

        const ticker =
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          config.chainInformation.get(chainId)!.nativeCurrency.symbol;
        const nativeBalance = new EVMBalance(
          TickerSymbol(ticker),
          chainId,
          accountAddress,
          BigNumberString(response.result.balance.ether),
          EVMContractAddress("Ether"),
          BigNumberString(response.result.balance.value.toString()),
        );

        return ResultAsync.fromPromise(
          evmApi.token.getWalletTokenBalances({
            chain: `0x${chainId.toString(16)}`,
            address: accountAddress,
          }),
          (e) => e as AccountBalanceError,
        ).andThen((response) => {
          return okAsync(
            response.result.map((item) => {
              const contract_addr: EvmAddress = item.token
                ? item.token.contractAddress
                : EvmAddress.ZERO_ADDRESS;

              return new EVMBalance(
                TickerSymbol(item.token ? item.token.symbol : "NULL"),
                chainId,
                accountAddress,
                BigNumberString(item.amount.toString()),
                EVMContractAddress(contract_addr.lowercase),
                BigNumberString(item.value),
              );
            }),
          );
        });
      });
    });
  }

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<EVMNFT[], AjaxError | AccountNFTError> {
    return this.initialize<AccountNFTError>().andThen(() => {
      return ResultAsync.fromPromise(
        evmApi.nft.getWalletNFTs({
          chain: `0x${chainId.toString(16)}`,
          address: accountAddress,
        }),
        (e) => e as AccountNFTError,
      ).andThen((response) => {
        return okAsync(
          response.toJSON().map((item) => {
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
          }),
        );
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
      this.initialize<AccountIndexingError>(),
    ]).andThen(() => {
      return ResultAsync.fromPromise(
        evmApi.transaction.getWalletTransactions({
          chain: `0x${chainId.toString(16)}`,
          address: accountAddress,
        }),
        (e) => e as AccountIndexingError,
      ).andThen((response) => {
        return okAsync(
          response.toJSON().map((item) => {
            return new EVMTransaction(
              chainId,
              EVMTransactionHash(item.hash),
              UnixTimestamp(Number(item.blockTimestamp)),
              EVMAccountAddress(item.to ?? "NULL"),
              EVMAccountAddress(item.from ?? "NULL"),
              BigNumberString(item.value ?? "NULL"),
              BigNumberString(item.gasPrice ?? "NULL"),
              BigNumberString(item.gas ?? "NULL"),
              BigNumberString(item.gasUsed ?? "NULL"),
              null,
              null,
            );
          }),
        );
      });
    });
  }
}
