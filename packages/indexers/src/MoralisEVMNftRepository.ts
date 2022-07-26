import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  IRequestConfig,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountNFTError,
  AjaxError,
  BigNumberString,
  ChainId,
  EVMAccountAddress,
  EVMContractAddress,
  IEVMNFT,
  IEVMNftRepository,
  TickerSymbol,
  TokenId,
  TokenUri,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { urlJoinP } from "url-join-ts";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider";

interface IMoralisNFTResponse {
  total: number;
  page: number;
  page_size: number;
  status: string;
  cursor: string | null;

  result: {
    token_address: string;
    token_id: string;
    owner_of: string;
    block_number: string;
    block_number_minted: string;
    token_hash: string;
    amount: string;
    updated_at: string;
    contract_type: string;
    name: string;
    symbol: string;
    token_uri: string;
    metadata: string;
  }[];

  last_token_uri_sync: string | null;
  last_metadata_sync: string | null;
}

@injectable()
export class MoralisEVMNftRepository implements IEVMNftRepository {
  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {}

  getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<IEVMNFT[], AccountNFTError | AjaxError> {
    return this.generateQueryConfig(chainId, accountAddress).andThen(
      (requestConfig) => {
        return this.ajaxUtils
          .get<IMoralisNFTResponse>(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            new URL(requestConfig.url!),
            requestConfig,
          )
          .andThen((result) => {
            return this.getPages(chainId, accountAddress, result);
          });
      },
    );
  }

  private getPages(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    response: IMoralisNFTResponse,
  ): ResultAsync<IEVMNFT[], AjaxError> {
    const items: IEVMNFT[] = response.result.map((token) => {
      return {
        contract: EVMContractAddress(token.token_address),
        tokenId: TokenId(BigInt(token.token_id)),
        contractType: token.contract_type,
        owner: EVMAccountAddress(token.owner_of),
        tokenUri: TokenUri(token.token_uri),
        metadata: token.metadata,
        amount: BigNumberString(token.amount),
        name: token.name,
        ticker: TickerSymbol(token.symbol),
        chain: ChainId(chainId),
      };
    });

    if (response.cursor == null) {
      return okAsync(items);
    }

    return this.generateQueryConfig(
      chainId,
      accountAddress,
      response.cursor,
    ).andThen((requestConfig) => {
      return (
        this.ajaxUtils
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .get<IMoralisNFTResponse>(new URL(requestConfig.url!), requestConfig)
          .andThen((response) => {
            return this.getPages(chainId, accountAddress, response).andThen(
              (nftArr) => {
                return okAsync(nftArr.concat(items));
              },
            );
          })
      );
    });
  }

  private generateQueryConfig(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    cursor?: string,
    contracts?: EVMContractAddress[],
  ): ResultAsync<IRequestConfig, never> {
    const params = {
      format: "decimal",
      chain: chainId.toString(),
    };
    if (contracts != undefined) {
      params["token_addresses"] = contracts.toString();
    }
    if (cursor != undefined) {
      params["cursor"] = cursor;
    }

    const url = urlJoinP(
      "https://deep-index.moralis.io",
      ["api", "v2", accountAddress.toString(), "nft"],
      params,
    );

    return this.configProvider.getConfig().map((config) => {
      const result: IRequestConfig = {
        method: "get",
        url: url,
        headers: {
          accept: "application/json",
          "X-API-Key": config.moralisApiKey,
        },
      };
      return result;
    });
  }
}
