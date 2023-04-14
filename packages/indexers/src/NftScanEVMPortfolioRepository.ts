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
  ): ResultAsync<EVMNFT[], AccountIndexingError | AjaxError> {
    return this.generateQueryConfig(chainId, accountAddress).andThen(
      (requestConfig) => {
        return this.ajaxUtils
          .get<INftScanResponse>(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            new URL(requestConfig.url!),
            requestConfig,
          )
          .andThen((response) => {
            return this.getPages(chainId, response);
          })
          .mapErr((e) => new AjaxError("error fetching nfts from nftscan", e));
      },
    );
  }

  private getPages(
    chainId: ChainId,
    response: INftScanResponse,
  ): ResultAsync<EVMNFT[], AccountIndexingError> {
    const items: EVMNFT[] = response.data.map((token) => {
      return new EVMNFT(
        EVMContractAddress(token.contract_address),
        BigNumberString(token.assets[0].token_id),
        token.assets[0].erc_type,
        EVMAccountAddress(token.assets[0].owner),
        TokenUri(token.assets[0].token_uri),
        { raw: token.assets[0].metadata_json },
        BigNumberString(token.assets[0].amount),
        token.assets[0].name,
        chainId,
        undefined,
        UnixTimestamp(Number(token.assets[0].own_timestamp)),
      );
    });
    return okAsync(items);
  }

  private generateQueryConfig(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<IRequestConfig, never> {
    const chainInfo = getChainInfoByChain(chainId);
    const url = urlJoinP(`https://${chainInfo.name}api.nftscan.com`, [
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
