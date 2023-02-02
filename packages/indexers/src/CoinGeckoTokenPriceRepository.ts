import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountIndexingError,
  chainConfig,
  ChainId,
  EChain,
  ECurrencyCode,
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
import {
  ELocalStorageKey,
  IVolatileStorage,
  IVolatileStorageType,
} from "@snickerdoodlelabs/persistence";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import {
  IIndexerConfigProviderType,
  IIndexerConfigProvider,
} from "@indexers/IIndexerConfigProvider.js";

@injectable()
export class CoinGeckoTokenPriceRepository implements ITokenPriceRepository {
  private _assetPlatforms?: ResultAsync<
    AssetPlatformMapping,
    AccountIndexingError
  >;

  private _initialized?: ResultAsync<void, AccountIndexingError>;
  private _nativeIds: Map<ChainId, string>;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(IVolatileStorageType)
    protected volatileStorage: IVolatileStorage,
  ) {
    this._nativeIds = new Map();
    chainConfig.forEach((value) => {
      if (value.nativeCurrency.coinGeckoId) {
        this._nativeIds.set(value.chainId, value.nativeCurrency.coinGeckoId);
      }
    });
  }

  public getMarketDataForTokens(
    tokens: { chain: ChainId; address: TokenAddress | null }[],
  ): ResultAsync<
    Map<`${ChainId}-${TokenAddress}`, TokenMarketData>,
    AccountIndexingError
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
          const key = ids.get(data.id)!;
          returnVal.set(key, data);
        });
        return returnVal;
      });
    });
  }

  public addTokenInfo(info: TokenInfo): ResultAsync<void, PersistenceError> {
    return this.volatileStorage.putObject(ELocalStorageKey.COIN_INFO, info);
  }

  public getTokenMarketData(
    ids: string[],
  ): ResultAsync<TokenMarketData[], AccountIndexingError> {
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        const url = urlJoinP(
          "https://api.coingecko.com/api/v3/coins/",
          ["markets"],
          {
            vs_currency: config.quoteCurrency,
            ids: ids.join(","),
            order: "market_cap_desc",
            per_page: 100,
            sparkline: false,
          },
        );

        return this.ajaxUtils
          .get<IMarketDataResponse>(new URL(url))
          .map((response) => {
            return response.map((item) => {
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
          });
      })
      .mapErr(
        (e) => new AccountIndexingError("error fetching token market data", e),
      );
  }

  public getTokenInfo(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
  ): ResultAsync<TokenInfo | null, AccountIndexingError> {
    // look for null contract addresses since we can't null indexed values in indexeddb
    if (contractAddress == null) {
      if (!this._nativeIds.has(chainId)) {
        return okAsync(null);
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const id = this._nativeIds.get(chainId)!;
      const chainInfo = getChainInfoByChainId(chainId);
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

    return this._getTokens()
      .andThen(() => {
        return this.volatileStorage.getObject<TokenInfo>(
          ELocalStorageKey.COIN_INFO,
          [chainId, contractAddress],
        );
      })
      .mapErr((e) => new AccountIndexingError("error fetching token info", e));
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
    ])
      .andThen(([platforms, config]) => {
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

    this._initialized = this._getAssetPlatforms()
      .andThen((platforms) => {
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
                      addr,
                    );

                    results.push(
                      this.volatileStorage.putObject(
                        ELocalStorageKey.COIN_INFO,
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

    this._assetPlatforms = this.configProvider.getConfig().andThen((config) => {
      return this.ajaxUtils
        .get<
          {
            id: string;
            chain_identifier: number | null;
            name: string;
            shortname: string;
          }[]
        >(new URL("https://api.coingecko.com/api/v3/asset_platforms"))
        .andThen((items) => {
          const mapping: AssetPlatformMapping = {
            forward: {},
            backward: {},
          };
          items.forEach((item) => {
            if (
              item.chain_identifier &&
              config.supportedChains.includes(ChainId(item.chain_identifier))
            ) {
              mapping.forward[item.id] = ChainId(item.chain_identifier);
              mapping.backward[ChainId(item.chain_identifier)] = item.id;
            }
          });

          config.supportedChains.forEach((chainId) => {
            const info = getChainInfoByChainId(chainId);
            if (info.coinGeckoSlug) {
              mapping.forward[info.coinGeckoSlug] = info.chainId;
              mapping.backward[info.chainId] = info.coinGeckoSlug;
            }
          });

          return okAsync(mapping);
        })
        .mapErr(
          (e) => new AccountIndexingError("error fetching asset platforms", e),
        );
    });

    return this._assetPlatforms;
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
