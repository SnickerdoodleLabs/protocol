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
  EVMContractAddress,
  EChain,
  HexString,
  EVMNFT,
  AccountAddress,
  URLString,
  EVMTransaction,
  IEVMIndexer,
  MethodSupportError,
  getChainInfoByChain,
  EComponentStatus,
  IIndexer,
  IndexerSupportSummary,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";
import Web3 from "web3";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/interfaces/IIndexerConfigProvider.js";

@injectable()
export class AlchemyIndexer implements IEVMIndexer {
  protected _alchemyNonNativeSupport = new Map<EChain, boolean>();
  protected health: Map<EChain, EComponentStatus> = new Map<
    EChain,
    EComponentStatus
  >();

  protected indexerSupport = new Map<EChain, IndexerSupportSummary>([
    [
      EChain.Arbitrum,
      new IndexerSupportSummary(EChain.Arbitrum, true, false, false),
    ],
    [
      EChain.Optimism,
      new IndexerSupportSummary(EChain.Optimism, true, false, false),
    ],
    [
      EChain.Polygon,
      new IndexerSupportSummary(EChain.Polygon, true, false, false),
    ],
    [EChain.Astar, new IndexerSupportSummary(EChain.Astar, true, false, false)],
    [
      EChain.Mumbai,
      new IndexerSupportSummary(EChain.Mumbai, true, false, false),
    ],
  ]);

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    this._alchemyNonNativeSupport = new Map([
      [EChain.Astar, false],
      [EChain.Mumbai, false],
      [EChain.Arbitrum, true],
      [EChain.Optimism, true],
      [EChain.Solana, true],
      [EChain.Polygon, true],
    ]) as Map<EChain, boolean>;
  }

  public getBalancesForAccount(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
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
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    EVMNFT[],
    AccountIndexingError | AjaxError | MethodSupportError
  > {
    return errAsync(
      new MethodSupportError(
        "getTokensForAccount not supported for AlchemyIndexer",
        400,
      ),
    );
  }

  public getEVMTransactions(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<
    EVMTransaction[],
    AccountIndexingError | AjaxError | MethodSupportError
  > {
    return errAsync(
      new MethodSupportError(
        "getEVMTransactions not supported for AlchemyIndexer",
        400,
      ),
    );
  }

  public healthStatus(): Map<EChain, EComponentStatus> {
    return this.health;
  }

  public getSupportedChains(): Map<EChain, IndexerSupportSummary> {
    return this.indexerSupport;
  }

  public getHealthCheck(): ResultAsync<
    Map<EChain, EComponentStatus>,
    AjaxError
  > {
    return this.configProvider.getConfig().andThen((config) => {
      console.log(
        "Alchemy Keys: " + JSON.stringify(config.apiKeys.alchemyApiKeys),
      );

      const keys = this.indexerSupport.keys();
      this.indexerSupport.forEach(
        (value: IndexerSupportSummary, key: EChain) => {
          if (config.apiKeys.alchemyApiKeys[key] == undefined) {
            this.health.set(key, EComponentStatus.NoKeyProvided);
          }
          this.health.set(key, EComponentStatus.Available);
        },
      );
      return okAsync(this.health);
    });
  }

  protected _getEtherscanApiKey(
    chain: ChainId,
  ): ResultAsync<string, AccountIndexingError> {
    return this.configProvider.getConfig().andThen((config) => {
      const chainName = getChainInfoByChainId(chain).name;
      console.log("chainName: " + chainName);
      const apiKey = config.apiKeys.etherscanApiKeys[chainName];
      if (apiKey == null) {
        return errAsync(
          new AccountIndexingError("no etherscan api key for chain: ", chain),
        );
      }

      return okAsync(apiKey);
    });
  }

  private nativeBalanceParams(
    chain: EChain,
    accountAddress: AccountAddress,
  ): [string, TickerSymbol, ChainId] {
    switch (chain) {
      case EChain.EthereumMainnet:
        return [
          JSON.stringify({
            id: 1,
            jsonrpc: "2.0",
            params: [accountAddress, "latest"],
            method: "eth_getBalance",
          }),
          TickerSymbol("ETH"),
          ChainId(1),
        ];
      case EChain.Polygon:
        return [
          JSON.stringify({
            id: 1,
            jsonrpc: "2.0",
            params: [accountAddress],
            method: "eth_getBalance",
          }),
          TickerSymbol("MATIC"),
          ChainId(137),
        ];
      case EChain.Mumbai:
        return [
          JSON.stringify({
            id: 1,
            jsonrpc: "2.0",
            params: [accountAddress],
            method: "eth_getBalance",
          }),
          TickerSymbol("MATIC"),
          ChainId(80001),
        ];
      case EChain.Astar:
        return [
          JSON.stringify({
            id: 1,
            jsonrpc: "2.0",
            params: [accountAddress, "latest"],
            method: "eth_getBalance",
          }),
          TickerSymbol("ASTR"),
          ChainId(592),
        ];
      default:
        return [
          JSON.stringify({
            id: 1,
            jsonrpc: "2.0",
            params: [accountAddress],
            method: "eth_getBalance",
          }),
          TickerSymbol("ETH"),
          ChainId(1),
        ];
    }
  }

  protected retrieveAlchemyUrl(
    chain: EChain,
  ): ResultAsync<URLString, AccountIndexingError | AjaxError> {
    return this.configProvider.getConfig().andThen((config) => {
      const alchemyApiKey = config.apiKeys.alchemyApiKeys[chain];
      if (alchemyApiKey == undefined) {
        return errAsync(
          new AccountIndexingError("Alchemy Endpoint is missing"),
        );
      }
      const url = config.alchemyEndpoints.get(chain) + alchemyApiKey;
      console.log("Alchemy Url: " + url);
      return okAsync(url);
    });
  }

  private getNativeBalance(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance, AccountIndexingError | AjaxError> {
    return this.retrieveAlchemyUrl(chain).andThen((url) => {
      const [requestParams, nativeTickerSymbol, nativeChain] =
        this.nativeBalanceParams(chain, accountAddress);
      return this.ajaxUtils
        .post<IAlchemyNativeBalanceResponse>(new URL(url), requestParams, {
          headers: {
            "Content-Type": `application/json;`,
          },
        })
        .andThen((response) => {
          const weiValue = Web3.utils.hexToNumberString(response.result);
          const balance = new TokenBalance(
            EChainTechnology.EVM,
            nativeTickerSymbol,
            nativeChain,
            null,
            accountAddress,
            BigNumberString(weiValue),
            getChainInfoByChain(chain).nativeCurrency.decimals,
          );
          return okAsync(balance);
        });
    });
  }

  private getNonNativeBalance(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    if (!this._alchemyNonNativeSupport.get(chain)) {
      return okAsync([]);
    }
    return this.retrieveAlchemyUrl(chain).andThen((url) => {
      return this.ajaxUtils
        .post<IAlchemyNonNativeReponse>(
          new URL(url),
          JSON.stringify({
            id: 0,
            jsonrpc: "2.0",
            method: "alchemy_getTokenBalances",
            params: [accountAddress, "erc20"],
          }),
          {
            headers: {
              "Content-Type": `application/json`,
            },
          },
        )
        .andThen((response) => {
          return ResultUtils.combine(
            response.result.tokenBalances.map((entry) => {
              const weiValue = Web3.utils.hexToNumberString(entry.tokenBalance);
              return this.tokenPriceRepo
                .getTokenInfo(
                  getChainInfoByChain(chain).chainId,
                  entry.contractAddress,
                )
                .andThen((tokenInfo) => {
                  if (tokenInfo == null) {
                    return okAsync(undefined);
                  }

                  return okAsync(
                    new TokenBalance(
                      EChainTechnology.EVM,
                      TickerSymbol(tokenInfo.symbol),
                      getChainInfoByChain(chain).chainId,
                      entry.contractAddress,
                      accountAddress,
                      BigNumberString(weiValue),
                      getChainInfoByChain(chain).nativeCurrency.decimals,
                    ),
                  );
                });
            }),
          ).andThen((balances) => {
            return okAsync(
              balances.filter((x) => x != undefined) as TokenBalance[],
            );
          });
        });
    });
  }

  public healthCheck(): ResultAsync<string, AjaxError> {
    const url = urlJoinP("https://api.poap.tech", ["health-check"]);
    console.log("Poap URL: ", url);
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        const result: IRequestConfig = {
          method: "get",
          url: url,
          headers: {
            accept: "application/json",
            "X-API-Key": config.apiKeys.poapApiKey,
          },
        };
        return okAsync(result);
      })
      .andThen((requestConfig) => {
        return this.ajaxUtils.get<IHealthCheck>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new URL(requestConfig.url!),
          requestConfig,
        );
      })
      .andThen((result) => {
        /* If status: healthy , its message is undefined */
        if (result.status !== undefined) {
          return okAsync("good");
        }
        return okAsync("bad");
      });
  }

  public get supportedChains(): Array<EChain> {
    const supportedChains = [
      EChain.Arbitrum,
      EChain.EthereumMainnet,
      EChain.Mumbai,
      EChain.Optimism,
      EChain.Polygon,
      EChain.Solana,
    ];
    return supportedChains;
  }
}

interface IAlchemyNativeBalanceResponse {
  status: string;
  message: string;
  result: HexString;
}

interface IAlchemyNonNativeReponse {
  jsonrpc: number;
  id: number;
  result: {
    address: EVMAccountAddress;
    tokenBalances: ITokenBalance[];
  };
}

interface ITokenBalance {
  contractAddress: EVMContractAddress;
  tokenBalance: HexString;
}

interface IAlchemyNftResponse {
  blockHash: number;
  ownedNfts: IAlchemyNft[];
  totalCount: number;
}

interface IAlchemyNft {
  balance: string;
  contract: {
    address: EVMContractAddress;
  };
  contractMetadata: {
    contractDeployer: string;
    deployedBlockNumber: number;
    name: string;
    symbol: string;
    tokenType: string;
    totalSupply: string;
  };
  description: string;
  id: {
    tokenId: string;
    tokenMetadata: {
      tokenType: string;
    };
  };
  media: IAlchemyMediaObject[];
  metadata: {
    attributes: string;
    description: string;
    external_url: string;
    image: string;
    name: string;
  };
  timeLastUpdated: string;
  title: string;
  tokenUri: {
    gateway: string;
    raw: string;
  };
}

interface IAlchemyRequestConfig {
  id: number;
  jsonrpc: string;
  method: string;
  params: string[];
}

interface IAlchemyMediaObject {
  bytes: number;
  format: string;
  gateway: string;
  raw: string;
  thumbnail: string;
}

export interface CoinGeckoTokenInfo {
  id: string;
  symbol: string;
  name: string;
  protocols: string[];
}

interface IHealthCheck {
  status?: string;
  message?: string;
}
