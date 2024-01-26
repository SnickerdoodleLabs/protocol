import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  IRequestConfig,
  ITimeUtils,
  ITimeUtilsType,
  ValidationUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountIndexingError,
  AjaxError,
  BigNumberString,
  EVMAccountAddress,
  EVMContractAddress,
  EVMNFT,
  EVMTransaction,
  getChainInfoByChain,
  TokenBalance,
  TokenUri,
  UnixTimestamp,
  MethodSupportError,
  EComponentStatus,
  EChain,
  IndexerSupportSummary,
  EDataProvider,
  EExternalApi,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import {
  IEVMIndexer,
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
  IIndexerContextProvider,
  IIndexerContextProviderType,
} from "@indexers/interfaces/index.js";

@injectable()
export class NftScanEVMPortfolioRepository implements IEVMIndexer {
  protected health: Map<EChain, EComponentStatus> = new Map<
    EChain,
    EComponentStatus
  >();
  protected indexerSupport = new Map<EChain, IndexerSupportSummary>([
    [
      EChain.EthereumMainnet,
      new IndexerSupportSummary(EChain.EthereumMainnet, false, false, true),
    ],
    [
      EChain.Moonbeam,
      new IndexerSupportSummary(EChain.Moonbeam, false, false, true),
    ],
    [
      EChain.Binance,
      new IndexerSupportSummary(EChain.Binance, false, false, true),
    ],
    [
      EChain.Gnosis,
      new IndexerSupportSummary(EChain.Gnosis, false, false, true),
    ],
    [
      EChain.Avalanche,
      new IndexerSupportSummary(EChain.Avalanche, false, false, true),
    ],
  ]);

  protected nftScanApiKey: string | null = null;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IIndexerContextProviderType)
    protected contextProvider: IIndexerContextProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {}

  public initialize(): ResultAsync<void, never> {
    return this.configProvider.getConfig().map((config) => {
      this.indexerSupport.forEach(
        (value: IndexerSupportSummary, key: EChain) => {
          if (
            config.apiKeys.nftScanApiKey == null ||
            config.apiKeys.nftScanApiKey == ""
          ) {
            this.health.set(key, EComponentStatus.NoKeyProvided);
          } else {
            this.health.set(key, EComponentStatus.Available);
            this.nftScanApiKey = config.apiKeys.nftScanApiKey;
          }
        },
      );
    });
  }

  public name(): EDataProvider {
    return EDataProvider.NftScan;
  }

  public getBalancesForAccount(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    TokenBalance[],
    AccountIndexingError | AjaxError | MethodSupportError
  > {
    return errAsync(
      new MethodSupportError(
        "getBalancesForAccount not supported for NftScan",
        400,
      ),
    );
  }

  public getTokensForAccount(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<EVMNFT[], AccountIndexingError> {
    if (this.nftScanApiKey == null) {
      return okAsync([]);
    }
    const requestConfig = this.generateQueryConfig(
      chain,
      accountAddress,
      this.nftScanApiKey,
    );
    return this.contextProvider
      .getContext()
      .andThen((context) => {
        context.privateEvents.onApiAccessed.next(EExternalApi.NftScan);
        return this.ajaxUtils
          .get<INftScanResponse>(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            new URL(requestConfig.url!),
            requestConfig,
          )
          .mapErr(
            (e) =>
              new AccountIndexingError("error fetching nfts from nftscan", e),
          );
      })
      .andThen((response) => {
        if (response.code !== 200) {
          return errAsync(
            new AccountIndexingError(
              "NftScan server error 2 was located!",
              500,
            ),
          );
        }
        return this.getPages(chain, response);
      });
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
    return errAsync(
      new MethodSupportError(
        "getTokensForAccount not supported for NFTScan Indexer",
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

  private getPages(
    chain: EChain,
    response: INftScanResponse,
  ): ResultAsync<EVMNFT[], AccountIndexingError> {
    if (response.code >= 500) {
      return errAsync(
        new AccountIndexingError("NftScan server error was located!", 500),
      );
    }
    const items = response.data.map((token) => {
      const assets = token.assets.map((asset) => {
        const tokenStandard = ValidationUtils.stringToTokenStandard(
          asset.erc_type,
        );
        return new EVMNFT(
          EVMContractAddress(asset.contract_address),
          BigNumberString(asset.token_id),
          tokenStandard,
          EVMAccountAddress(asset.owner),
          TokenUri(asset.token_uri),
          { raw: asset.metadata_json },
          asset.name,
          chain,
          BigNumberString(asset.amount),
          this.timeUtils.getUnixNow(),
          undefined,
          UnixTimestamp(Number(asset.own_timestamp)),
        );
      });
      return assets;
    });
    return okAsync(items.flat(1));
  }

  private generateBaseUrl(chain: EChain): string {
    switch (chain) {
      case EChain.EthereumMainnet:
        return "rest";
      case EChain.Binance:
        return "bnb";
      case EChain.Avalanche:
        return "avax";
      default:
        return getChainInfoByChain(chain).name;
    }
  }

  private generateQueryConfig(
    chain: EChain,
    accountAddress: EVMAccountAddress,
    nftScanApiKey: string,
  ): IRequestConfig {
    const chainName = this.generateBaseUrl(chain);
    const url = urlJoinP(`https://${chainName}api.nftscan.com`, [
      "api",
      "v2",
      "account",
      "own",
      "all",
      accountAddress.toString() + "?erc_type=&show_attribute=false",
    ]);

    const result: IRequestConfig = {
      method: "get",
      url: url,
      headers: {
        accept: "application/json",
        "X-API-Key": nftScanApiKey,
      },
    };
    return result;
  }
}

interface INftScanResponse {
  code: number;
  data: INftScanDataObject[];
  msg: number;
}

interface INftScanDataObject {
  contract_address: string;
  contract_name: string;
  logo_url: null;
  owns_total: number;
  items_total: number;
  symbol: string;
  description: string | null;
  floor_price: string | null;
  assets: INftScanAssetData[];
}

interface INftScanAssetData {
  contract_address: string;
  contract_name: string;
  contract_token_id: string;
  token_id: string;
  erc_type: string;
  amount: string;
  minter: string;
  owner: string;
  own_timestamp: string;
  mint_timestamp: UnixTimestamp;
  mint_transaction_hash: string;
  mint_price: string;
  token_uri: string;
  metadata_json: string;
  name: string;
  content_type: string;
  content_uri: string;
  description: string;
  image_uri: string;
  external_link: string;
  latest_trade_price: string | null;
  latest_trade_symbol: string | null;
  latest_trade_timestamp: UnixTimestamp | null;
  nftscan_id: string | null;
  nftscan_uri: string | null;
  small_nftscan_uri: string | null;
  attributes: string[];
  rarity_rank: string | null;
  rarity_score: string | null;
}
