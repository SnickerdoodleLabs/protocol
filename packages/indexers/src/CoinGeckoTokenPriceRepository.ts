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

interface AssetPlatformMapping {
  forward: { [key: string]: ChainId };
  backward: { [key: ChainId]: string };
}

@injectable()
export class CoinGeckoTokenPriceRepository implements ITokenPriceRepository {
  private _assetPlatforms?: ResultAsync<
    AssetPlatformMapping,
    AccountIndexingError
  >;

  private _initialized?: ResultAsync<void, AccountIndexingError>;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(IVolatileStorageType)
    protected volatileStorage: IVolatileStorage,
  ) {}

  public getTokenInfo(
    chainId: ChainId,
    contractAddress: TokenAddress,
  ): ResultAsync<TokenInfo | null, AccountIndexingError> {
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
    date: Date,
  ): ResultAsync<number, AccountIndexingError> {
    const dateString = this.formatDate(date);
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

          // Non EVM has to be mapped manually
          mapping.forward["solana"] = ChainId(EChain.Solana);
          mapping.backward[ChainId(EChain.Solana)] = "solana";

          return okAsync(mapping);
        })
        .mapErr(
          (e) => new AccountIndexingError("error fetching asset platforms", e),
        );
    });

    return this._assetPlatforms;
  }
}
