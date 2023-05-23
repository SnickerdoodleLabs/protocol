import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
  IRequestConfig,
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
  AccountAddress,
  URLString,
  TokenUri,
  IEVMTransactionRepository,
  EVMTransaction,
  EVMTransactionHash,
  UnixTimestamp,
  EComponentStatus,
  IEVMIndexer,
  EExternalApi,
} from "@snickerdoodlelabs/objects";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
// import { CoinGeckoTokenInfo } from "packages/objects/src";
import { urlJoinP } from "url-join-ts";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/interfaces/IIndexerConfigProvider.js";
import { IIndexerHealthCheck } from "@indexers/interfaces/IIndexerHealthCheck.js";
import {
  IIndexerContextProvider,
  IIndexerContextProviderType,
} from "@indexers/interfaces/index.js";

export class AnkrIndexer implements IEVMIndexer {
  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(IIndexerContextProviderType)
    protected contextProvider: IIndexerContextProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    const url = "https://rpc.ankr.com/multichain/?ankr_getAccountBalance=";
    const requestParams = {
      jsonrpc: "2.0",
      method: "ankr_getAccountBalance",
      params: {
        walletAddress: "0x633b0E4cc5b72e7196e12b6B8aF1d79c7D406C83",
      },
      id: 1,
    };
    return this.contextProvider
      .getContext()
      .andThen((context) => {
        context.privateEvents.onApiAccessed.next(EExternalApi.Ankr);
        return this.ajaxUtils.post<IAnkrBalancesReponse>(
          new URL(url),
          requestParams,
          {
            headers: {
              "Content-Type": `application/json;`,
            },
          },
        );
      })
      .andThen((response) => {
        return ResultUtils.combine(
          response.result.assets.map((item) => {
            return okAsync(
              new TokenBalance(
                EChainTechnology.EVM,
                item.tokenSymbol,
                chainId,
                null,
                accountAddress,
                BigNumberString(item.balanceUsd),
                item.tokenDecimals,
              ),
            );
          }),
        );
      });
  }

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<EVMNFT[], AccountIndexingError | AjaxError> {
    const url = "https://rpc.ankr.com/multichain/?ankr_getNFTsByOwner=";
    const requestParams = {
      jsonrpc: "2.0",
      method: "ankr_getAccountBalance",
      params: {
        walletAddress: "0x633b0E4cc5b72e7196e12b6B8aF1d79c7D406C83",
      },
      id: 1,
    };
    return this.contextProvider
      .getContext()
      .andThen((context) => {
        context.privateEvents.onApiAccessed.next(EExternalApi.Ankr);
        return this.ajaxUtils.post<IAnkrNftReponse>(
          new URL(url),
          requestParams,
          {
            headers: {
              "Content-Type": `application/json;`,
            },
          },
        );
      })
      .andThen((response) => {
        return ResultUtils.combine(
          response.result.assets.map((item) => {
            return okAsync(
              new EVMNFT(
                item.contractAddress,
                BigNumberString("1"),
                item.contractType,
                accountAddress,
                TokenUri(item.tokenUrl),
                item.traits,
                BigNumberString("1"),
                item.name,
                chainId,
                undefined,
                undefined,
              ),
            );
          }),
        );
      });
  }

  public getEVMTransactions(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError> {
    const url = "https://rpc.ankr.com/multichain/?ankr_getNFTsByOwner=";
    const requestParams = {
      jsonrpc: "2.0",
      method: "ankr_getAccountBalance",
      params: {
        walletAddress: "0x633b0E4cc5b72e7196e12b6B8aF1d79c7D406C83",
      },
      id: 1,
    };
    return this.contextProvider
      .getContext()
      .andThen((context) => {
        context.privateEvents.onApiAccessed.next(EExternalApi.Ankr);
        return this.ajaxUtils.post<IAnkrTransactionReponse>(
          new URL(url),
          requestParams,
          {
            headers: {
              "Content-Type": `application/json;`,
            },
          },
        );
      })
      .andThen((response) => {
        return ResultUtils.combine(
          response.result.transactions.map((item) => {
            return okAsync(
              new EVMTransaction(
                chainId,
                EVMTransactionHash(item.hash),
                UnixTimestamp(0), // item.timestamp
                null,
                EVMAccountAddress(item.to),
                EVMAccountAddress(item.from),
                BigNumberString(item.value),
                BigNumberString(item.gasPrice),
                item.contractAddress,
                item.input,
                null,
                null,
                null,
              ),
            );
          }),
        );
      });
  }

  public healthCheck(): ResultAsync<EComponentStatus, AjaxError> {
    const url = urlJoinP("https://api.poap.tech", ["health-check"]);
    console.log("Poap URL: ", url);

    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ]).andThen(([config, context]) => {
      if (config.apiKeys.ankrApiKey == "") {
        return okAsync(EComponentStatus.NoKeyProvided);
      }
      const result: IRequestConfig = {
        method: "get",
        url: url,
        headers: {
          accept: "application/json",
          "X-API-Key": config.apiKeys.poapApiKey,
        },
      };
      context.privateEvents.onApiAccessed.next(EExternalApi.POAP);
      return this.ajaxUtils
        .get<IHealthCheck>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new URL(result.url!),
          result,
        )
        .andThen((result) => {
          if (result.status !== undefined) {
            return okAsync(EComponentStatus.Available);
          }
          return okAsync(EComponentStatus.Error);
        })
        .andThen((fads) => {
          return okAsync(fads);
        });
    });
  }
}

interface IAnkrBalancesReponse {
  jsonrpc: string;
  id: number;
  result: {
    totalBalanceUsd: string;
    totalCount: number;
    assets: IAnkrBalanceAsset[];
  };
}

interface IAnkrBalanceAsset {
  blockchain: "eth";
  tokenName: "Ethereum";
  tokenSymbol: TickerSymbol;
  tokenDecimals: number;
  tokenType: "NATIVE";
  holderAddress: EVMAccountAddress;
  balance: TokenBalance;
  balanceRawInteger: "627238654657922210";
  balanceUsd: "1132.318127155933293695";
  tokenPrice: "1805.242898771069514074";
  thumbnail: "https://assets.ankr.com/charts/icon-only/eth.svg";
}

interface IAnkrNftReponse {
  jsonrpc: string;
  id: number;
  result: {
    owner: EVMAccountAddress;
    assets: IAnkrNftAsset[];
  };
  nextPageToken: string;
}

interface IAnkrNftAsset {
  blockchain: string;
  name: string;
  tokenId: string;
  tokenUrl: URLString;
  imageUrl: URLString;
  collectionName: string;
  symbol: string;
  contractType: string;
  contractAddress: EVMContractAddress;
  traits: {
    trait_type: string;
    value: string;
  }[];
}

interface IAnkrTransactionReponse {
  jsonrpc: string;
  id: number;
  result: {
    transactions: IAnkrNftAsset[];
  };
  nextPageToken: string;
}

interface IAnkrNftAsset {
  v: string;
  r: string;
  s: string;
  nonce: URLString;
  blockNumber: URLString;
  from: string;
  to: string;
  gas: string;
  gasPrice: string;
  input: string;
  transactionIndex: string;
  blockHash: string;
  value: string;
  type: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  hash: string;
  status: string;
  blockchain: string;
  timestamp: string;
}

interface IHealthCheck {
  status?: string;
  message?: string;
}
