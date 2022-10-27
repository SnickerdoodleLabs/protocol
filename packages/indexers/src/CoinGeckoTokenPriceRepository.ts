import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountIndexingError,
  ChainId,
  EChain,
  ECurrencyCode,
  ITokenPriceRepository,
  PersistenceError,
  TickerSymbol,
  TokenAddress,
  TokenInfo,
} from "@snickerdoodlelabs/objects";
import {
  IVolatileStorageFactory,
  IVolatileStorageFactoryType,
  IVolatileStorageTable,
} from "@snickerdoodlelabs/persistence";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoin, urlJoinP } from "url-join-ts";

import {
  IIndexerConfigProviderType,
  IIndexerConfigProvider,
} from "@indexers/IIndexerConfigProvider.js";

const TABLE_NAME = "coins";

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

interface BiMap<K, V> {
  forward: Map<K, V>;
  backward: Map<V, K>;
}

@injectable()
export class CoinGeckoTokenPriceRepository implements ITokenPriceRepository {
  private _assetPlatforms?: ResultAsync<
    BiMap<string, ChainId>,
    AccountIndexingError
  >;

  private _tokenInfoStore?: ResultAsync<
    IVolatileStorageTable,
    PersistenceError
  >;

  private _initialized?: ResultAsync<
    IVolatileStorageTable,
    AccountIndexingError
  >;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(IVolatileStorageFactoryType)
    protected volatileStorageFactory: IVolatileStorageFactory,
  ) {}

  public getTokenInfo(
    chainId: ChainId,
    contractAddress: TokenAddress,
  ): ResultAsync<TokenInfo, AccountIndexingError> {
    return this._getTokens().andThen((tokenStore) => {
      return tokenStore.getObject<TokenInfo>([chainId, contractAddress]);
    });
  }

  public getTokenPrice(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
    date: Date,
  ): ResultAsync<number, AccountIndexingError> {
    const dateString = this.formatDate(date);
    return ResultUtils.combine([
      this._getAssetPlatforms(),
      this.configProvider.getConfig(),
    ])
      .andThen(([platforms, config]) => {
        if (!platforms.backward.has(chainId)) {
          return errAsync(new AccountIndexingError("invalid chain id"));
        }

        const platform = platforms.backward.get(chainId)!;
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

  private _getTokens(): ResultAsync<
    IVolatileStorageTable,
    AccountIndexingError
  > {
    if (this._initialized) {
      return this._initialized;
    }

    this._initialized = ResultUtils.combine([
      this._getAssetPlatforms(),
      this._getTokenInfoStore(),
    ])
      .andThen(([platforms, store]) => {
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
                    platforms.forward.has(platform)
                  ) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const chainId = platforms.forward.get(platform)!;
                    const tokenInfo = new TokenInfo(
                      coin.id,
                      TickerSymbol(coin.symbol),
                      coin.name,
                      ChainId(chainId),
                      addr,
                    );
                    results.push(store.putObject(TABLE_NAME, tokenInfo));
                  }
                }
                return ResultUtils.combine(results);
              }),
            ).map(() => store);
          });
      })
      .mapErr((e) => new AccountIndexingError("error storing token info", e));
    return this._initialized;
  }

  private _getTokenInfoStore(): ResultAsync<
    IVolatileStorageTable,
    PersistenceError
  > {
    if (this._tokenInfoStore) {
      return this._tokenInfoStore;
    }

    this._tokenInfoStore = this.volatileStorageFactory.getStore({
      name: "tokenInfo",
      schema: [
        {
          name: TABLE_NAME,
          keyPath: ["chain", "address"],
          autoIncrement: false,
        },
      ],
    });
    return this._tokenInfoStore;
  }

  private _getAssetPlatforms(): ResultAsync<
    BiMap<string, ChainId>,
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
          const idToChain = new Map<string, ChainId>();
          const chainToId = new Map<ChainId, string>();
          items.forEach((item) => {
            if (
              item.chain_identifier &&
              item.chain_identifier in config.supportedChains
            ) {
              idToChain[item.id] = item.chain_identifier;
              chainToId[item.chain_identifier] = item.id;
            }
          });

          // Non EVM has to be mapped manually
          idToChain["solana"] = ChainId(EChain.Solana);
          chainToId[ChainId(EChain.Solana)] = "solana";

          return okAsync({ forward: idToChain, backward: chainToId });
        })
        .mapErr(
          (e) => new AccountIndexingError("error fetching asset platforms", e),
        );
    });

    return this._assetPlatforms;
  }
}
