import { Metaplex } from "@metaplex-foundation/js";
import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  EVMTransaction,
  IEVMTransactionRepository,
  EChainTechnology,
  TickerSymbol,
  getChainInfoByChainId,
  EVMTransactionHash,
  UnixTimestamp,
  getEtherscanBaseURLForChain,
  PolygonTransaction,
  EPolygonTransactionType,
  AccountIndexingError,
  AjaxError,
  ChainId,
  TokenBalance,
  URLString,
  SolanaTokenAddress,
  BigNumberString,
  ITokenPriceRepositoryType,
  ITokenPriceRepository,
  getChainInfoByChain,
  EVMAccountAddress,
  IEVMAccountBalanceRepository,
  EVMContractAddress,
  EChain,
  HexString,
} from "@snickerdoodlelabs/objects";
import { Connection } from "@solana/web3.js";
import { Network, Alchemy, TokenMetadataResponse } from "alchemy-sdk";
import { BigNumber } from "ethers";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/interfaces/IIndexerConfigProvider.js";

export class OklinkExplorer implements IEVMAccountBalanceRepository {
  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  protected _getEtherscanApiKey(
    chain: ChainId,
  ): ResultAsync<string, AccountIndexingError> {
    return this.configProvider.getConfig().andThen((config) => {
      if (!config.etherscanApiKeys.has(chain)) {
        return errAsync(
          new AccountIndexingError("no etherscan api key for chain: ", chain),
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return okAsync(config.etherscanApiKeys.get(chain)!);
    });
  }

  private _getOKXConfig(
    chain: ChainId,
  ): ResultAsync<alchemyAjaxSettings, AccountIndexingError> {
    return this.configProvider.getConfig().andThen((config) => {
      console.log("Inside getAlchemyclient chain: ", chain);
      switch (chain) {
        default:
        return okAsync({
            id: 0,
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: ["0x633b0E4cc5b72e7196e12b6B8aF1d79c7D406C83", "latest"],
            });
      }
    });
  }

  private getNativeBalance(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance, AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this._getOKXConfig(chainId),
      this.configProvider.getConfig(),
    ]).andThen(([alchemySettings, config]) => {
      const chainInfo = getChainInfoByChainId(chainId);
      const url = config.alchemyEndpoints[chainInfo.name.toString()];
      return this.ajaxUtils
        .post<IOKXNativeBalanceResponse>(
          new URL(url),
          JSON.stringify(alchemySettings),
          {
            headers: {
              "Content-Type": `application/json;`,
            },
          },
        )
        .andThen((response) => {
          const weiValue = parseInt(response.result, 16);
          return okAsync(
            new TokenBalance(
              EChainTechnology.EVM,
              TickerSymbol("ETH"),
              chainId,
              null,
              accountAddress,
              BigNumberString(BigNumber.from(weiValue).toString()),
              18,
            ),
          );
        });
    });
  }

  private getNonNativeBalance(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    return okAsync([]);
  }

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this.getNonNativeBalance(chainId, accountAddress),
      this.getNativeBalance(chainId, accountAddress),
    ]).map(([nonNativeBalance, nativeBalance]) => {
      return [nativeBalance, ...nonNativeBalance];
    });
  }
}

interface IOKXNativeBalanceResponse {
  status: string;
  message: string;
  result: HexString;
}

interface alchemyAjaxSettings {
  id: number;
  jsonrpc: string;
  method: string;
  params: string[];
}