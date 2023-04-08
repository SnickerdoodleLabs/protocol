import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  EChainTechnology,
  TickerSymbol,
  getChainInfoByChainId,
  AccountIndexingError,
  AjaxError,
  ChainId,
  TokenBalance,
  BigNumberString,
  ITokenPriceRepositoryType,
  ITokenPriceRepository,
  EVMAccountAddress,
  IEVMAccountBalanceRepository,
  EVMContractAddress,
  EChain,
  HexString,
  EVMNFT,
  IEVMNftRepository,
} from "@snickerdoodlelabs/objects";
import { TokenMetadataResponse } from "alchemy-sdk";
import { BigNumber } from "ethers";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";

export class AlchemyIndexer
  implements IEVMAccountBalanceRepository, IEVMNftRepository
{
  private _metadataCache = new Map<
    `${EVMContractAddress}-${ChainId}`,
    TokenMetadataResponse
  >();

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

  private _getAlchemyConfig(
    chain: ChainId,
  ): ResultAsync<alchemyAjaxSettings, AccountIndexingError> {
    return this.configProvider.getConfig().andThen((config) => {
      console.log("within _getAlchemyConfig: ", chain);
      switch (chain) {
        case ChainId(EChain.Arbitrum):
          return okAsync({
            id: 0,
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: ["0x633b0E4cc5b72e7196e12b6B8aF1d79c7D406C83", "latest"],
          });
        case ChainId(EChain.Optimism):
          return okAsync({
            id: 0,
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: ["0x633b0E4cc5b72e7196e12b6B8aF1d79c7D406C83", "latest"],
          });
        default:
          return errAsync(
            new AccountIndexingError("no alchemy app for chainId", chain),
          );
      }
    });
  }

  private getNativeBalance(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance, AccountIndexingError | AjaxError> {
    const chainInfo = getChainInfoByChainId(chainId);
    return ResultUtils.combine([
      this._getAlchemyConfig(chainId),
      this.configProvider.getConfig(),
    ]).andThen(([alchemySettings, config]) => {
      const url = config.alchemyEndpoints[chainInfo.name.toString()];
      return this.ajaxUtils
        .post<unknown>(new URL(url), JSON.stringify(alchemySettings), {
          headers: {
            "Content-Type": `application/json;`,
          },
        })
        .andThen((response) => {
          console.log("response: ", JSON.stringify(response));
          const resp = response as IAlchemyNativeBalanceResponse;
          const weiValue = parseInt(resp.result, 16).toString();
          // console.log(
          //   "response: ",
          //   JSON.stringify(resp) + " and chainInfo: ",
          //   chainInfo,
          // );
          // console.log(
          //   "chainInfo: ",
          //   chainInfo + " and (BigNumber.from(weiValue)).toString(): ",
          //   BigNumber.from(weiValue).toString(),
          // );

          const balance = new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol(chainInfo.nativeCurrency.symbol),
            chainId,
            null,
            accountAddress,
            BigNumberString(weiValue),
            chainInfo.nativeCurrency.decimals,
          );

          console.log("balance: ", balance);

          return okAsync(balance);
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
      console.log("nativeBalance: ", nativeBalance);
      return [nativeBalance];
      //   return [nativeBalance, ...nonNativeBalance];
    });
  }

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<EVMNFT[], never> {
    return okAsync([]);
  }
}

interface IAlchemyNativeBalanceResponse {
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
