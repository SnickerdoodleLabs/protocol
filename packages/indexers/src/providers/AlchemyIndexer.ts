import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  EChainTechnology,
  TickerSymbol,
  AccountIndexingError,
  AjaxError,
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
  MethodSupportError,
  getChainInfoByChain,
  EExternalApi,
  EComponentStatus,
  IndexerSupportSummary,
  EDataProvider,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/interfaces/IIndexerConfigProvider.js";
import {
  IEVMIndexer,
  IIndexerContext,
  IIndexerContextProvider,
  IIndexerContextProviderType,
} from "@indexers/interfaces/index.js";
import { MasterIndexer } from "@indexers/MasterIndexer.js";

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
    [EChain.Amoy, new IndexerSupportSummary(EChain.Amoy, true, false, false)],
    [
      EChain.Base,
      new IndexerSupportSummary(EChain.Base, false, false, false),
      // alchemy supports balances and nfts for base. We will keep them false until we have the valid api keys.
      // To Do: Also and we need to make necassary changes in getTokensForAccount to get alchemy supported NFTs
    ],
  ]);

  protected chainToApiMap = new Map<EChain, EExternalApi>([
    [EChain.Arbitrum, EExternalApi.AlchemyArbitrum],
    [EChain.Astar, EExternalApi.AlchemyAstar],
    [EChain.Amoy, EExternalApi.AlchemyAmoy],
    [EChain.Optimism, EExternalApi.AlchemyOptimism],
    [EChain.Solana, EExternalApi.AlchemySolana],
    [EChain.Polygon, EExternalApi.AlchemyPolygon],
    [EChain.Base, EExternalApi.AlchemyBase],
  ]);

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(IIndexerContextProviderType)
    protected contextProvider: IIndexerContextProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    this._alchemyNonNativeSupport = new Map([
      [EChain.Astar, false],
      [EChain.Amoy, false],
      [EChain.Arbitrum, true],
      [EChain.Optimism, true],
      [EChain.Solana, true],
      [EChain.Polygon, true],
      [EChain.Base, true],
    ]) as Map<EChain, boolean>;
  }

  public initialize(): ResultAsync<void, never> {
    return this.configProvider.getConfig().map((config) => {
      this.indexerSupport.forEach((indexerSupportSummary, chain) => {
        const chainInfo = getChainInfoByChain(chain);
        if (
          config.apiKeys.alchemyApiKeys[chainInfo.name] == "" ||
          config.apiKeys.alchemyApiKeys[chainInfo.name] == null
        ) {
          this.health.set(chain, EComponentStatus.NoKeyProvided);
        } else {
          this.health.set(chain, EComponentStatus.Available);
        }
      });
    });
  }

  public name(): EDataProvider {
    return EDataProvider.Alchemy;
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
    chain: EChain,
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
    chain: EChain,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<
    EVMTransaction[],
    AccountIndexingError | AjaxError | MethodSupportError
  > {
    // return okAsync([]);
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

  private nativeBalanceParams(
    chain: EChain,
    accountAddress: AccountAddress,
  ): [string, TickerSymbol, EChain] {
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
          EChain.EthereumMainnet,
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
          EChain.Polygon,
        ];
      case EChain.Amoy:
        return [
          JSON.stringify({
            id: 1,
            jsonrpc: "2.0",
            params: [accountAddress],
            method: "eth_getBalance",
          }),
          TickerSymbol("MATIC"),
          EChain.Amoy,
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
          EChain.Astar,
        ];
      case EChain.Base:
        return [
          JSON.stringify({
            id: 1,
            jsonrpc: "2.0",
            params: [accountAddress, "latest"],
            method: "eth_getBalance",
          }),
          TickerSymbol("BASE"),
          EChain.Base,
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
          EChain.EthereumMainnet,
        ];
    }
  }

  protected retrieveAlchemyUrl(
    chain: EChain,
  ): ResultAsync<URLString, AccountIndexingError | AjaxError> {
    return this.configProvider.getConfig().andThen((config) => {
      const alchemyApiKey =
        config.apiKeys.alchemyApiKeys[getChainInfoByChain(chain).name];
      if (alchemyApiKey == undefined || alchemyApiKey == "") {
        return errAsync(
          new AccountIndexingError("Alchemy Endpoint is missing"),
        );
      }
      const url = config.alchemyEndpoints.get(chain) + alchemyApiKey;
      return okAsync(url);
    });
  }

  private getNativeBalance(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance, AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this.retrieveAlchemyUrl(chain),
      this.contextProvider.getContext(),
    ]).andThen(([url, context]) => {
      const [requestParams, nativeTickerSymbol, nativeChain] =
        this.nativeBalanceParams(chain, accountAddress);

      this.reportApiUsage(chain, context);
      return this.ajaxUtils
        .post<IAlchemyNativeBalanceResponse>(new URL(url), requestParams, {
          headers: {
            "Content-Type": `application/json;`,
          },
        })
        .andThen((response) => {
          // TODO: Really, really need to replace this with an ethers equivalent
          const weiValue = BigNumberString(BigInt(response.result).toString());
          const balance = new TokenBalance(
            EChainTechnology.EVM,
            nativeTickerSymbol,
            nativeChain,
            MasterIndexer.nativeAddress,
            accountAddress,
            weiValue,
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
    return ResultUtils.combine([
      this.retrieveAlchemyUrl(chain),
      this.contextProvider.getContext(),
    ]).andThen(([url, context]) => {
      // const url = config.alchemyEndpoints[chainInfo.name.toString()];
      this.reportApiUsage(chain, context);
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
              // TODO: Really, really need to replace this with an ethers equivalent
              const weiValue = BigNumberString(
                BigInt(entry.tokenBalance).toString(),
              );
              return this.tokenPriceRepo
                .getTokenInfo(chain, entry.contractAddress)
                .andThen((tokenInfo) => {
                  if (tokenInfo == null) {
                    return okAsync(undefined);
                  }

                  return okAsync(
                    new TokenBalance(
                      EChainTechnology.EVM,
                      tokenInfo.symbol,
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
  protected reportApiUsage(chain: EChain, context: IIndexerContext): void {
    let api = this.chainToApiMap.get(chain);
    if (api == null) {
      api = EExternalApi.Unknown;
    }
    context.privateEvents.onApiAccessed.next(api);
  }
}

interface IAlchemyNativeBalanceResponse {
  status: string;
  message: string;
  result: HexString; // example: "0x7f49b9052e509c", measured in wei
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
