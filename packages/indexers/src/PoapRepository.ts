import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  IRequestConfig,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountIndexingError,
  AjaxError,
  BigNumberString,
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

import { IIndexerHealthCheck } from "./IIndexerHealthCheck";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";

const poapContractAddress = "0x22c1f6050e56d2876009903609a2cc3fef83b415";

@injectable()
export class PoapRepository implements IEVMNftRepository, IIndexerHealthCheck {
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
        return this.ajaxUtils.get<IPoapResponse[]>(
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

  private getPages(chainId: ChainId, response: IPoapResponse[]): EVMNFT[] {
    const items: EVMNFT[] = response.map((token) => {
      return new EVMNFT(
        EVMContractAddress(poapContractAddress),
        BigNumberString(token.tokenId),
        "erc-721",
        EVMAccountAddress(token.owner),
        TokenUri(token.event.image_url),
        { raw: JSON.stringify(token.event) },
        BigNumberString(token.event.supply),
        token.event.name,
        chainId,
      );
    });
    return items;
  }

  private generateQueryConfig(
    accountAddress: EVMAccountAddress,
  ): ResultAsync<IRequestConfig, never> {
    const url = urlJoinP("https://api.poap.tech", [
      "actions",
      "scan",
      accountAddress.toString(),
    ]);
    return this.configProvider.getConfig().map((config) => {
      const result: IRequestConfig = {
        method: "get",
        url: url,
        headers: {
          accept: "application/json",
          "X-API-Key": config.apiKeys.poapApiKey,
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
        /* If status: healthy , its message is undefined */
        if (result.status !== undefined) {
          return okAsync("good");
        }
        return okAsync("bad");
      });
  }
}

interface IHealthCheck {
  status?: string;
  message?: string;
}

interface IPoapResponse {
  event: {
    id: string;
    fancy_id: string;
    name: string;
    event_url: string;
    image_url: string;
    country: string;
    city: string;
    description: string;
    year: string;
    start_date: string;
    end_date: string;
    expiry_date: string;
    supply: string;
  };
  tokenId: string;
  owner: EVMAccountAddress;
  chain: string;
  created: string;
}
