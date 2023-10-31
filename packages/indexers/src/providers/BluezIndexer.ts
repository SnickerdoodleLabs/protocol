import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
  ObjectUtils,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  EChainTechnology,
  TickerSymbol,
  AccountIndexingError,
  AjaxError,
  TokenBalance,
  BigNumberString,
  EVMAccountAddress,
  EVMContractAddress,
  EChain,
  EVMNFT,
  TokenUri,
  EVMTransaction,
  UnixTimestamp,
  EComponentStatus,
  IndexerSupportSummary,
  getChainInfoByChain,
  MethodSupportError,
  EDataProvider,
  EExternalApi,
  URLString,
  DecimalString,
  EVMTransactionHash,
  ChainId,
  TokenId,
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
import { MasterIndexer } from "@indexers/MasterIndexer.js";

@injectable()
export class BluezIndexer implements IEVMIndexer {
  protected health: Map<EChain, EComponentStatus> = new Map<
    EChain,
    EComponentStatus
  >();
  protected supportedChains = new Map<EChain, IndexerSupportSummary>([
    [EChain.Astar, new IndexerSupportSummary(EChain.Astar, false, false, true)],
  ]);

  protected supportedBluezChains = new Map<EChain, string>([
    [EChain.Astar, "astar"],
  ]);

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(IIndexerContextProviderType)
    protected contextProvider: IIndexerContextProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public initialize(): ResultAsync<void, never> {
    return this.configProvider.getConfig().map((config) => {
      this.supportedBluezChains.forEach((indexerSupportSummary, chain) => {
        if (
          config.apiKeys.bluezApiKey == "" ||
          config.apiKeys.bluezApiKey == undefined
        ) {
          this.health.set(chain, EComponentStatus.NoKeyProvided);
        } else {
          this.health.set(chain, EComponentStatus.Available);
        }
      });
    });
  }

  public name(): string {
    return EDataProvider.Bluez;
  }

  public getBalancesForAccount(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    TokenBalance[],
    AccountIndexingError | AjaxError | MethodSupportError
  > {
    return okAsync([]);
  }

  public getTokensForAccount(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<EVMNFT[], AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ]).andThen(([config, context]) => {
      const url = new URL(
        urlJoinP(
          "https://api.bluez.app/api/nft/v3/" +
            config.apiKeys.bluezApiKey +
            "/getNFTsForOwner",
          [""],
          {
            owner: accountAddress,
            orderBy: "tokenId",
            pageKey: "1",
            pageSize: "100",
          },
        ),
      );

      const nftSupportChain = this.supportedBluezChains.get(chain);
      if (nftSupportChain == undefined) {
        return okAsync([]);
      }

      context.privateEvents.onApiAccessed.next(EExternalApi.Bluez);
      return this.ajaxUtils
        .get<IBluezNftReponse>(new URL(url), {
          headers: {
            Accept: `application/json;`,
          },
        })
        .map((response) => {
          return response.items.map((item) => {
            return new EVMNFT(
              item.contractAddress,
              BigNumberString(item.tokenId),
              item.tokenType,
              accountAddress,
              TokenUri(item.image),
              { raw: ObjectUtils.serialize(item) },
              BigNumberString("1"),
              item.name,
              EChain.Astar,
              undefined,
              undefined,
            );
          });
        })
        .mapErr((error) => {
          return error;
        });
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
    return okAsync([]);
  }

  public healthStatus(): Map<EChain, EComponentStatus> {
    return this.health;
  }

  public getSupportedChains(): Map<EChain, IndexerSupportSummary> {
    return this.supportedChains;
  }
}

interface IBluezNftReponse {
  items: {
    chainId: ChainId;
    tokenId: string;
    tokenType: string;
    contractAddress: EVMContractAddress;
    name: string;
    image: string;
    ownerAddress: EVMAccountAddress;
    description: string;
    totalSupply: number;
    tokenUri: TokenUri;
  }[];
}
