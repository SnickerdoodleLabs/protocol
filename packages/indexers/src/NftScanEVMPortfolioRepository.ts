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
  IEVMNftRepository,
  TokenUri,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
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
    return this.generateQueryConfig(accountAddress)
      .andThen((requestConfig) => {
        return this.ajaxUtils.get<INftScanResponse>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new URL(requestConfig.url!),
          requestConfig,
        );
      })
      .map((result) => {
        return this.getPages(chainId, result);
      })
      .mapErr(
        (e) => new AccountIndexingError("error fetching nfts from nftscan", e),
      );
  }

  private getPages(chainId: ChainId, response: INftScanResponse): EVMNFT[] {
    const items: EVMNFT[] = response.data.content.map((token) => {
      return new EVMNFT(
        EVMContractAddress(token.contract_address),
        BigNumberString(token.token_id),
        token.erc_type,
        EVMAccountAddress(token.owner),
        TokenUri(token.token_uri),
        { raw: token.metadata_json },
        BigNumberString(token.amount),
        token.name,
        chainId,
        undefined,
        UnixTimestamp(Number(token.own_timestamp))
      );
    });

    return items;
  }

  private generateQueryConfig(
    accountAddress: EVMAccountAddress,
  ): ResultAsync<IRequestConfig, never> {
    const url = urlJoinP("https://moonbeamapi.nftscan.com", [
      "api",
      "v2",
      "account",
      "own",
      accountAddress.toString() + "?erc_type=erc721",
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
  data: {
    content: {
      amount: string;
      attributes: string[];
      content_type: string;
      content_uri: string;
      contract_address: string;
      contract_name: string;
      contract_token_id: string;
      erc_type: string;
      external_link: string;
      image_uri: string;
      latest_trade_price: string;
      latest_trade_symbol: string;
      latest_trade_timestamp: UnixTimestamp;
      metadata_json: string;
      mint_price: string;
      mint_timestamp: UnixTimestamp;
      mint_transaction_hash: string;
      minter: string;
      name: string;
      nftscan_id: string;
      nftscan_uri: string;
      own_timestamp: string;
      owner: string;
      rarity_rank: string;
      rarity_score: string;
      token_id: string;
      token_uri: string;
    }[];
  };
  msg: number;
}
