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
  EComponentStatus,
  EVMAccountAddress,
  EVMContractAddress,
  EVMNFT,
  EVMTransaction,
  IEVMIndexer,
  TokenBalance,
  TokenUri,
  UnixTimestamp,
  MethodSupportError,
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

const poapContractAddress = "0x22c1f6050e56d2876009903609a2cc3fef83b415";

@injectable()
export class PoapRepository implements IEVMIndexer {
  protected health: EComponentStatus = EComponentStatus.Disabled;
  protected indexerSupport = new Map<EChain, IndexerSupportSummary>([
    [
      EChain.Gnosis,
      new IndexerSupportSummary(EChain.Gnosis, false, false, true),
    ],
  ]);

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {}
  healthStatus(): EComponentStatus {
    return this.health;
  }
  getSupportedChains(): Map<EChain, IndexerSupportSummary> {
    return this.indexerSupport;
  }
  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    TokenBalance[],
    AjaxError | AccountIndexingError | MethodSupportError
  > {
    return errAsync(
      new MethodSupportError(
        "getTokensForAccount not supported for AlchemyIndexer",
        400,
      ),
    );
  }
  public getEVMTransactions(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<
    EVMTransaction[],
    AjaxError | AccountIndexingError | MethodSupportError
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

  public getHealthCheck(): ResultAsync<EComponentStatus, AjaxError> {
    const url = urlJoinP("https://api.poap.tech", ["health-check"]);
    console.log("Poap URL: ", url);
    return this.configProvider.getConfig().andThen((config) => {
      console.log("Poap Keys: " + config.apiKeys.poapApiKey);
      if (config.apiKeys.poapApiKey == "") {
        return okAsync(EComponentStatus.NoKeyProvided);
      }
      const result: IRequestConfig = {
        method: "get",
        url: url,
        headers: {
          accept: "application/json",
          "X-API-Key": config.apiKeys.poapApiKey,
        },
      };
      return this.ajaxUtils
        .get<IHealthCheck>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new URL(result.url!),
          result,
        )
        .andThen((result) => {
          if (result.status !== undefined) {
            return okAsync(EComponentStatus.Available);
          }
          return okAsync(EComponentStatus.Error);
        })
        .andThen((fads) => {
          return okAsync(fads);
        });
    });
  }

  public get supportedChains(): Array<EChain> {
    const supportedChains = [
      EChain.Arbitrum,
      EChain.EthereumMainnet,
      EChain.Mumbai,
      EChain.Optimism,
      EChain.Polygon,
      EChain.Solana,
    ];
    return supportedChains;
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