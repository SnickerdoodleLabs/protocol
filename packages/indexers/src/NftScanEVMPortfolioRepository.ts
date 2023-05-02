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
  getChainInfoByChain,
  IEVMNftRepository,
  TokenUri,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";

@injectable()
export class NftScanEVMPortfolioRepository implements IEVMNftRepository {
  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {}

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
          "X-API-Key": config.nftScanApiKey,
        },
      };
      return result;
    });
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
