import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  IRequestConfig,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountIndexingError,
  AjaxError,
  BigNumberString,
  EComponentStatus,
  EVMAccountAddress,
  EVMContractAddress,
  EVMNFT,
  EVMTransaction,
  TokenBalance,
  TokenUri,
  MethodSupportError,
  EChain,
  IndexerSupportSummary,
  EDataProvider,
  EExternalApi,
  EContractStandard,
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

const poapContractAddress = EVMContractAddress(
  "0x22c1f6050e56d2876009903609a2cc3fef83b415",
);

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

  protected poapApiKey: string | null = null;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IIndexerContextProviderType)
    protected contextProvider: IIndexerContextProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {}

  public initialize(): ResultAsync<void, never> {
    return this.setHealth();
  }

  public name(): EDataProvider {
    return EDataProvider.Poap;
  }

  public getBalancesForAccount(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    TokenBalance[],
    AjaxError | AccountIndexingError | MethodSupportError
  > {
    return errAsync(
      new MethodSupportError(
        "getTokensForAccount not supported for POAP Indexer",
        400,
      ),
    );
  }

  public getTokensForAccount(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<EVMNFT[], AccountIndexingError> {
    if (this.poapApiKey == null) {
      return okAsync([]);
    }

    const requestConfig = this.generateQueryConfig(
      accountAddress,
      this.poapApiKey,
    );

    return this.contextProvider
      .getContext()
      .andThen((context) => {
        context.privateEvents.onApiAccessed.next(EExternalApi.POAP);
        return this.ajaxUtils.get<IPoapResponse[]>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new URL(requestConfig.url!),
          requestConfig,
        );
      })
      .map((result) => {
        return this.getPages(chain, result);
      })
      .mapErr(
        (e) => new AccountIndexingError("error fetching nfts from nftscan", e),
      );
  }

  public getEVMTransactions(
    chain: EChain,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<
    EVMTransaction[],
    AjaxError | AccountIndexingError | MethodSupportError
  > {
    return errAsync(
      new MethodSupportError(
        "getTokensForAccount not supported for POAP Indexer",
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

  protected setHealth(): ResultAsync<void, never> {
    const url = urlJoinP("https://api.poap.tech", ["health-check"]);
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ]).andThen(([config, context]) => {
      if (config.apiKeys.poapApiKey == null) {
        this.health.set(EChain.Gnosis, EComponentStatus.NoKeyProvided);
        return okAsync(undefined);
      }
      this.poapApiKey = config.apiKeys.poapApiKey;
      const requestConfig: IRequestConfig = {
        headers: {
          accept: "application/json",
          "X-API-Key": config.apiKeys.poapApiKey,
        },
      };

      context.privateEvents.onApiAccessed.next(EExternalApi.POAP);
      return this.ajaxUtils
        .get<IHealthCheck>(new URL(url), requestConfig)
        .map((result) => {
          if (result.status !== undefined) {
            this.health.set(EChain.Gnosis, EComponentStatus.Available);
          } else {
            this.health.set(EChain.Gnosis, EComponentStatus.Error);
          }
        })
        .orElse((e) => {
          this.health.set(EChain.Gnosis, EComponentStatus.Error);
          return okAsync(undefined);
        });
    });
  }

  private getPages(chain: EChain, response: IPoapResponse[]): EVMNFT[] {
    const items: EVMNFT[] = response.map((token) => {
      return new EVMNFT(
        EVMContractAddress(poapContractAddress),
        BigNumberString(token.tokenId),
        EContractStandard.Erc721,
        EVMAccountAddress(token.owner),
        TokenUri(token.event.image_url),
        { raw: JSON.stringify(token.event) },
        token.event.name,
        chain,
        BigNumberString(token.event.supply),
        this.timeUtils.getUnixNow(),
      );
    });
    return items;
  }

  private generateQueryConfig(
    accountAddress: EVMAccountAddress,
    poapApiKey: string,
  ): IRequestConfig {
    const url = urlJoinP("https://api.poap.tech", [
      "actions",
      "scan",
      accountAddress.toString(),
    ]);

    const result: IRequestConfig = {
      method: "get",
      url: url,
      headers: {
        accept: "application/json",
        "X-API-Key": poapApiKey,
      },
    };
    return result;
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
