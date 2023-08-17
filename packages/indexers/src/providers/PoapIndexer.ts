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
  MethodSupportError,
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
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
  IIndexerContextProvider,
  IIndexerContextProviderType,
} from "@indexers/interfaces/index.js";

const poapContractAddress = "0x22c1f6050e56d2876009903609a2cc3fef83b415";

@injectable()
export class PoapRepository implements IEVMIndexer {
  protected health: Map<EChain, EComponentStatus> = new Map<
    EChain,
    EComponentStatus
  >();

  protected indexerSupport = new Map<EChain, IndexerSupportSummary>([
    [
      EChain.Gnosis,
      new IndexerSupportSummary(EChain.Gnosis, false, false, true),
    ],
  ]);

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IIndexerContextProviderType)
    protected contextProvider: IIndexerContextProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {}

  public initialize(): ResultAsync<void, never> {
    return okAsync(undefined);
  }

  public name(): string {
    return EDataProvider.Poap;
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

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<EVMNFT[], AccountIndexingError> {
    return ResultUtils.combine([
      this.generateQueryConfig(accountAddress),
      this.contextProvider.getContext(),
    ])
      .andThen(([requestConfig, context]) => {
        context.privateEvents.onApiAccessed.next(EExternalApi.POAP);
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

  public getHealthCheck(): ResultAsync<Map<EChain, EComponentStatus>, never> {
    const url = urlJoinP("https://api.poap.tech", ["health-check"]);
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ]).andThen(([config, context]) => {
      if (config.apiKeys.poapApiKey == "") {
        this.health.set(EChain.Gnosis, EComponentStatus.NoKeyProvided);
        return okAsync(this.health);
      }
      const result: IRequestConfig = {
        method: "get",
        url: url,
        headers: {
          accept: "application/json",
          "X-API-Key": config.apiKeys.poapApiKey,
        },
      };

      context.privateEvents.onApiAccessed.next(EExternalApi.POAP);
      return this.ajaxUtils
        .get<IHealthCheck>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new URL(result.url!),
          result,
        )
        .map((result) => {
          if (result.status !== undefined) {
            this.health.set(EChain.Gnosis, EComponentStatus.Available);
            return this.health;
          }
          this.health.set(EChain.Gnosis, EComponentStatus.Error);
          return this.health;
        })
        .orElse((e) => {
          this.health.set(EChain.Gnosis, EComponentStatus.Error);
          return okAsync(this.health);
        });
    });
  }

  public healthStatus(): Map<EChain, EComponentStatus> {
    return this.health;
  }

  public getSupportedChains(): Map<EChain, IndexerSupportSummary> {
    return this.indexerSupport;
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
