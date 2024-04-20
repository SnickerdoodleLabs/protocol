// import fs from "fs";

import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import { MasterIndexer } from "@snickerdoodlelabs/indexers";
import {
  AccountIndexingError,
  AjaxError,
  chainConfig,
  ChainId,
  EChain,
  ECurrencyCode,
  EExternalApi,
  ERecordKey,
  EVMContractAddress,
  getChainInfoByChain,
  getChainInfoByChainId,
  ITokenPriceRepository,
  PersistenceError,
  TickerSymbol,
  TokenAddress,
  TokenInfo,
  TokenMarketData,
  UnixTimestamp,
  URLString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
} from "@core/interfaces/data/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class CoinGeckoTokenPriceRepository implements ITokenPriceRepository {
  private _assetPlatforms?: ResultAsync<
    AssetPlatformMapping,
    AccountIndexingError
  >;

  private _initialized?: ResultAsync<void, AccountIndexingError>;

  // #region async maps
  private _contractAddressMap?: ResultAsync<
    Map<TokenAddress, CoinGeckoTokenInfo>,
    AccountIndexingError
  >;
  private _coinPricesMap?: ResultAsync<
    Map<string, CoinMarketDataResponse>,
    AccountIndexingError
  >;
  // #endregion

  private _nativeIds: Map<ChainId, string>;

  public constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    this._nativeIds = new Map();
    chainConfig.forEach((value) => {
      if (value.nativeCurrency.coinGeckoId) {
        this._nativeIds.set(value.chainId, value.nativeCurrency.coinGeckoId);
      }
    });
  }

  public getMarketDataForTokens(
    tokens: { chain: ChainId; address: TokenAddress }[],
  ): ResultAsync<
    Map<`${ChainId}-${TokenAddress}`, TokenMarketData>,
    AjaxError | AccountIndexingError
  > {
    const ids = new Map<string, `${ChainId}-${TokenAddress}`>();
    return ResultUtils.combine(
      tokens.map((token) => {
        return this.getTokenInfo(token.chain, token.address).map((info) => {
          if (info != null) {
            ids.set(info.id, `${token.chain}-${token.address}`);
          }
        });
      }),
    ).andThen(() => {
      return this.getTokenMarketData([...ids.keys()]).map((marketData) => {
        const returnVal = new Map<
          `${ChainId}-${TokenAddress}`,
          TokenMarketData
        >();

        marketData.forEach((data) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const key = ids.get(data.id)!;
          returnVal.set(key, data);
        });
        return returnVal;
      });
    });
  }

  public addTokenInfo(info: TokenInfo): ResultAsync<void, PersistenceError> {
    return this.persistence.updateRecord(ERecordKey.COIN_INFO, info);
  }

  public getTokenMarketData(
    ids: string[],
  ): ResultAsync<TokenMarketData[], AccountIndexingError> {
    return this.getTokenPriceFromList(ids)
      .map((marketResponses) => {
        return marketResponses.map((item) => {
          return new TokenMarketData(
            item.id,
            item.symbol,
            item.name,
            item.image,
            item.current_price,
            item.market_cap,
            item.market_cap_rank,
            item.price_change_24h,
            item.price_change_percentage_24h,
            item.circulating_supply,
            item.total_supply,
            item.max_supply,
          );
        });
      })
      .mapErr((error) => {
        return new AccountIndexingError(
          `Cannot parse Coingecko data with error ${error}`,
        );
      });
  }

  public getTokenInfo(
    chainId: ChainId,
    contractAddress: TokenAddress,
  ): ResultAsync<TokenInfo | null, AccountIndexingError> {
    const id = this._nativeIds.get(chainId)!;
    const chainInfo = getChainInfoByChainId(chainId);
    if (contractAddress === MasterIndexer.nativeAddress) {
      return okAsync(
        new TokenInfo(
          id,
          TickerSymbol(chainInfo.nativeCurrency.symbol),
          chainInfo.name,
          chainInfo.chain,
          null,
        ),
      );
    }
    return this.getTokenInfoFromList(contractAddress).map((tokenInfo) => {
      if (tokenInfo == undefined) {
        return null;
      }
      return new TokenInfo(
        tokenInfo.id,
        TickerSymbol(tokenInfo.symbol),
        tokenInfo.name,
        chainInfo.chain,
        contractAddress,
      );
    });
  }

  public getTokenInfoFromList(
    contractAddress: TokenAddress,
  ): ResultAsync<CoinGeckoTokenInfo | undefined, AccountIndexingError> {
    return this.contractAddressMap.map((res) => res.get(contractAddress));
  }

  private getTokenPriceFromList(
    protocols: string[],
  ): ResultAsync<CoinMarketDataResponse[], AjaxError> {
    const url = new URL(
      urlJoinP("https://api.coingecko.com/api/v3/coins", ["markets"], {
        vs_currency: "usd",
        ids: String(protocols),
        order: "market_cap_desc",
        per_page: "100",
        page: "1",
        sparkline: "false",
      }),
    );
    return this.contextProvider
      .getContext()
      .andThen((context) => {
        context.privateEvents.onApiAccessed.next(EExternalApi.CoinGecko);
        return this.ajaxUtils.get<CoinMarketDataResponse[]>(new URL(url));
      })
      .map((coinGeckoApiData) => {
        return coinGeckoApiData;
      })
      .orElse((error) => {
        console.warn(
          `Cannot GET Coingecko data - ${error}. Retrieving Data from Cache`,
        );
        const localJSONData: CoinMarketDataResponse[] = [];
        return this.coinPricesMap
          .map((res) => {
            protocols.forEach((protocol) => {
              const marketData = res.get(protocol);
              if (marketData !== undefined) {
                localJSONData.push(marketData);
              }
            });
            return localJSONData;
          })
          .orElse((_) => {
            return okAsync(localJSONData);
          });
      });
  }

  public getTokenPrice(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
    timestamp: UnixTimestamp,
  ): ResultAsync<number, AccountIndexingError> {
    const dateString = this.formatDate(new Date(timestamp * 1000));
    return ResultUtils.combine([
      this._getAssetPlatforms(),
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ])
      .andThen(([platforms, config, context]) => {
        if (!(chainId in platforms.backward)) {
          return errAsync(new AccountIndexingError("invalid chain id"));
        }

        const platform = platforms.backward[chainId];
        if (contractAddress == null) {
          const url = urlJoinP(
            "https://api.coingecko.com/api/v3/coins/",
            [platform.toString(), "history"],
            { date: dateString, localization: false },
          );
          context.privateEvents.onApiAccessed.next(EExternalApi.CoinGecko);
          return this.ajaxUtils
            .get<ITokenHistoryResponse>(new URL(url))
            .map((resp) => this.getPrice(resp, config.quoteCurrency));
        }

        return this.getTokenInfo(chainId, contractAddress).andThen(
          (tokenInfo) => {
            if (tokenInfo == null) {
              return errAsync(new AccountIndexingError("no token info found"));
            }

            const url = urlJoinP(
              "https://api.coingecko.com/api/v3/coins/",
              [tokenInfo.id, "history"],
              { date: dateString, localization: false },
            );
            context.privateEvents.onApiAccessed.next(EExternalApi.CoinGecko);
            return this.ajaxUtils
              .get<ITokenHistoryResponse>(new URL(url))
              .map((resp) => this.getPrice(resp, config.quoteCurrency));
          },
        );
      })
      .mapErr((e) => new AccountIndexingError("error getting price", e));
  }

  private getPrice(
    resp: ITokenHistoryResponse,
    currency: ECurrencyCode,
  ): number {
    const prices = resp.market_data.current_price;
    const key = currency.toLowerCase();
    if (key in prices) {
      return prices[key];
    }
    return -1;
  }

  private padTo2Digits(num: number): string {
    return num.toString().padStart(2, "0");
  }

  private formatDate(date: Date): string {
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join("-");
  }

  private _getTokens(): ResultAsync<void, AccountIndexingError> {
    if (this._initialized) {
      return this._initialized;
    }

    this._initialized = ResultUtils.combine([
      this._getAssetPlatforms(),
      this.contextProvider.getContext(),
    ])
      .andThen(([platforms, context]) => {
        context.privateEvents.onApiAccessed.next(EExternalApi.CoinGecko);
        return this.ajaxUtils
          .get<
            {
              id: string;
              symbol: string;
              name: string;
              platforms: { [key: string]: string };
            }[]
          >(
            new URL(
              "https://api.coingecko.com/api/v3/coins/list?include_platform=true",
            ),
          )
          .andThen((coins) => {
            return ResultUtils.combine(
              coins.map((coin) => {
                const results: ResultAsync<void, PersistenceError>[] = [];
                for (const platform in coin.platforms) {
                  const addr = coin.platforms[platform];
                  if (
                    platform != "" &&
                    addr != "" &&
                    platform in platforms.forward
                  ) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const chainId = platforms.forward[platform];
                    const tokenInfo = new TokenInfo(
                      coin.id,
                      TickerSymbol(coin.symbol),
                      coin.name,
                      ChainId(chainId),
                      addr ? EVMContractAddress(addr) : null,
                    );

                    results.push(
                      this.persistence.updateRecord(
                        ERecordKey.COIN_INFO,
                        tokenInfo,
                      ),
                    );
                  }
                }

                return ResultUtils.combine(results);
              }),
            ).map(() => undefined);
          });
      })
      .mapErr((e) => new AccountIndexingError("error storing token info", e));
    return this._initialized;
  }

  private _getAssetPlatforms(): ResultAsync<
    AssetPlatformMapping,
    AccountIndexingError
  > {
    if (this._assetPlatforms) {
      return this._assetPlatforms;
    }

    // The supported chains are anything in our chain.config
    const supportedChains = new Array<EChain>();
    chainConfig.forEach((chainInformation) => {
      supportedChains.push(chainInformation.chain);
    });

    this._assetPlatforms = this.contextProvider
      .getContext()
      .andThen((context) => {
        context.privateEvents.onApiAccessed.next(EExternalApi.CoinGecko);
        return this.ajaxUtils
          .get<IAssetPlatformResponseItem[]>(
            new URL("https://api.coingecko.com/api/v3/asset_platforms"),
          )
          .andThen((assetPlatforms) => {
            const mapping: AssetPlatformMapping = {
              forward: {},
              backward: {},
            };
            assetPlatforms.forEach((assetPlatform) => {
              if (
                assetPlatform.chain_identifier &&
                supportedChains.includes(
                  ChainId(assetPlatform.chain_identifier),
                )
              ) {
                const chainId = ChainId(assetPlatform.chain_identifier);
                mapping.forward[assetPlatform.id] = chainId;
                mapping.backward[chainId] = assetPlatform.id;
              }
            });

            supportedChains.forEach((chain) => {
              const info = getChainInfoByChain(chain);
              if (info.coinGeckoSlug) {
                mapping.forward[info.coinGeckoSlug] = info.chainId;
                mapping.backward[info.chainId] = info.coinGeckoSlug;
              }
            });

            return okAsync(mapping);
          })
          .mapErr(
            (e) =>
              new AccountIndexingError("error fetching asset platforms", e),
          );
      });

    return this._assetPlatforms;
  }

  private get contractAddressMap(): ResultAsync<
    Map<TokenAddress, CoinGeckoTokenInfo>,
    AccountIndexingError
  > {
    if (this._contractAddressMap) {
      return this._contractAddressMap;
    }

    this._contractAddressMap = ResultAsync.fromPromise(
      import("./coinList.json", {
        assert: { type: "json" },
      }).then((module) => module.default),
      (error) =>
        new AccountIndexingError(`Error importing coin list: ${error}`),
    ).map((coinList) => {
      return new Map(Object.entries(coinList)) as Map<
        TokenAddress,
        CoinGeckoTokenInfo
      >;
    });
    return this._contractAddressMap;
  }

  private get coinPricesMap(): ResultAsync<
    Map<string, CoinMarketDataResponse>,
    AccountIndexingError
  > {
    if (this._coinPricesMap) {
      return this._coinPricesMap;
    }
    this._coinPricesMap = ResultAsync.fromPromise(
      import("./coinPrices.json", {
        assert: { type: "json" },
      }).then((module) => module.default),
      (error) =>
        new AccountIndexingError(`Error importing coin prices: ${error}`),
    ).map((coinPrices) => {
      return new Map(Object.entries(coinPrices)) as Map<
        string,
        CoinMarketDataResponse
      >;
    });
    return this._coinPricesMap;
  }
}

interface ITokenHistoryResponse {
  id: string;
  symbol: string;
  name: string;
  image: {
    thumb: string;
    small: string;
  };
  market_data: {
    current_price: { [key: string]: number };
  };
}

type IMarketDataResponse = {
  id: string;
  symbol: TickerSymbol;
  name: string;
  image: URLString;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: number;
  roi?: {
    times: number;
    currency: string;
    percentage: number;
  };
  last_updated: string;
}[];

interface AssetPlatformMapping {
  forward: { [key: string]: ChainId };
  backward: { [key: ChainId]: string };
}

interface MarketDataCache {
  timeStamp: UnixTimestamp;
  marketData: IMarketDataResponse;
}

interface CoinGeckoTokenInfo {
  id: string;
  symbol: string;
  name: string;
  protocols: string[];
}

interface CoinMarketDataResponse {
  id: string;
  symbol: TickerSymbol;
  name: string;
  image: URLString;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi?: {
    times: number;
    currency: string;
    percentage: number;
  };
  last_updated: string;
}

interface IAssetPlatformResponseItem {
  id: string;
  chain_identifier: number | null;
  name: string;
  shortname: string;
}
