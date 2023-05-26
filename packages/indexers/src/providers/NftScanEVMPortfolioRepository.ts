import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  IRequestConfig,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountIndexingError,
  AjaxError,
  BigNumberString,
  BlockNumber,
  ChainId,
  EVMAccountAddress,
  EVMContractAddress,
  EVMNFT,
  EVMTransaction,
  getChainInfoByChain,
  IEVMIndexer,
  TokenBalance,
  TokenUri,
  UnixTimestamp,
  MethodSupportError,
  EComponentStatus,
  EChain,
  IndexerSupportSummary,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import { IIndexerHealthCheck } from "../interfaces/IIndexerHealthCheck";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/interfaces/IIndexerConfigProvider.js";

@injectable()
export class NftScanEVMPortfolioRepository implements IEVMIndexer {
  protected health: EComponentStatus = EComponentStatus.Disabled;
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

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {}
  getHealthCheck(): ResultAsync<EComponentStatus, AjaxError> {
    this.health = EComponentStatus.Available;
    return this.configProvider.getConfig().andThen((config) => {
      console.log("NftScan Keys: " + config.apiKeys.nftScanApiKey);
      return okAsync(this.health);
    });
  }
  healthStatus(): EComponentStatus {
    return this.health;
  }
  getSupportedChains(): Map<EChain, IndexerSupportSummary> {
    return this.indexerSupport;
  }

  getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    TokenBalance[],
    AccountIndexingError | AjaxError | MethodSupportError
  > {
    return errAsync(
      new MethodSupportError(
        "getTokensForAccount not supported for AlchemyIndexer",
        400,
      ),
    );
  }

  getEVMTransactions(
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
        "getTokensForAccount not supported for AlchemyIndexer",
        400,
      ),
    );
  }

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<EVMNFT[], AccountIndexingError> {
    return this.generateQueryConfig(chainId, accountAddress)
      .andThen((requestConfig) => {
        return this.ajaxUtils
          .get<INftScanResponse>(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            new URL(requestConfig.url!),
            requestConfig,
          )
          .andThen((response) => {
            return this.getPages(chainId, response);
          });
      })
      .mapErr(
        (e) => new AccountIndexingError("error fetching nfts from nftscan", e),
      );
  }

  private getPages(
    chainId: ChainId,
    response: INftScanResponse,
  ): ResultAsync<EVMNFT[], AccountIndexingError> {
    const items = response.data.map((token) => {
      const assets = token.assets.map((asset) => {
        return new EVMNFT(
          EVMContractAddress(asset.contract_address),
          BigNumberString(asset.token_id),
          asset.erc_type,
          EVMAccountAddress(asset.owner),
          TokenUri(asset.token_uri),
          { raw: asset.metadata_json },
          BigNumberString(asset.amount),
          asset.name,
          chainId,
          undefined,
          UnixTimestamp(Number(asset.own_timestamp)),
        );
      });
      return assets;
    });
    return okAsync(items.flat(1));
  }

  private generateBaseUrl(chainId: ChainId): string {
    switch (chainId) {
      case ChainId(1):
        return "rest";
      case ChainId(56):
        return "bnb";
      case ChainId(43114):
        return "avax";
      default:
        return getChainInfoByChain(chainId).name;
    }
  }

  private generateQueryConfig(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<IRequestConfig, never> {
    const chainName = this.generateBaseUrl(chainId);
    const url = urlJoinP(`https://${chainName}api.nftscan.com`, [
      "api",
      "v2",
      "account",
      "own",
      "all",
      accountAddress.toString() + "?erc_type=&show_attribute=false",
    ]);
    return this.configProvider.getConfig().map((config) => {
      const result: IRequestConfig = {
        method: "get",
        url: url,
        headers: {
          accept: "application/json",
          "X-API-Key": config.apiKeys.nftScanApiKey,
        },
      };
      return result;
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
        if (result.message == undefined) {
          return okAsync("bad");
        }
        return okAsync(result.message);
      });
  }

  public get supportedChains(): Array<EChain> {
    const supportedChains = [
      EChain.Arbitrum,
      EChain.Binance,
      EChain.EthereumMainnet,
      EChain.Optimism,
      EChain.Polygon,
      EChain.Solana,
    ];
    return supportedChains;
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

interface IHealthCheck {
  status?: string;
  message?: string;
}