import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
  ObjectUtils,
  ITimeUtils,
  ITimeUtilsType,
  IRequestConfig,
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
export class RaribleIndexer implements IEVMIndexer {
  protected health: Map<EChain, EComponentStatus> = new Map<
    EChain,
    EComponentStatus
  >();
  protected supportedChains = new Map<EChain, IndexerSupportSummary>([
    [EChain.Astar, new IndexerSupportSummary(EChain.Astar, false, false, true)],
  ]);

  protected supportedRaribleChains = new Map<EChain, string>([
    [EChain.EthereumMainnet, "ETHEREUM"],
    [EChain.Polygon, "POLYGON"],
    // [EChain.Flow, "FLOW"],
    // [EChain.Tezos, "TEZOS"],
    [EChain.Solana, "SOLANA"],
    // [EChain.Immutable, "IMMUTABLEX"],
    // [EChain.Mantle, "MANTLE"],
    [EChain.Arbitrum, "ARBITRUM"],
    // [EChain.Chiliz, "CHILIZ"],
    // [EChain.Lightlink, "LIGHTLINK"],
    [EChain.ZkSyncEra, "ZKSYNC"],
    // [EChain.Astar, "ASTAR"],
    // [EChain.Astar, "ZKEVM"],
    [EChain.Base, "BASE"],
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
      this.supportedRaribleChains.forEach((indexerSupportSummary, chain) => {
        if (
          config.apiKeys.raribleApiKey == "" ||
          config.apiKeys.raribleApiKey == undefined
        ) {
          this.health.set(chain, EComponentStatus.NoKeyProvided);
        } else {
          this.health.set(chain, EComponentStatus.Available);
        }
      });
    });
  }

  public name(): EDataProvider {
    return EDataProvider.Rarible;
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
      const nftSupportChain = this.supportedRaribleChains.get(chain);
      if (nftSupportChain == undefined) {
        return okAsync([]);
      }

      const url = new URL(
        "https://api.rarible.org/v0.1/items/byOwner?blockchains=" +
          nftSupportChain +
          "%3A" +
          accountAddress,
      );
      // if (config.apiKeys.raribleApiKey == null) {
      //   return okAsync(undefined);
      // }
      const requestConfig: IRequestConfig = {
        headers: {
          accept: "application/json",
          "X-API-Key": config.apiKeys.raribleApiKey!,
        },
      };

      context.privateEvents.onApiAccessed.next(EExternalApi.Rarible);
      return this.ajaxUtils
        .get<IRaribleNftReponse>(url, requestConfig)
        .map((response) => {
          console.log("response: " + response);
          return response.items.map((item) => {
            return new EVMNFT(
              EVMContractAddress(item.contract),
              BigNumberString(item.tokenId),
              item.tokenId,
              accountAddress,
              TokenUri(item.tokenId),
              { raw: ObjectUtils.serialize(item) },
              BigNumberString("1"),
              item.lazySupply,
              chain,
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

interface IRaribleNftReponse {
  continuation: string;
  items: {
    id: string;
    blockchain: string;
    collection: string;
    contract: string;
    tokenId: string;
    creators: {
      account: string;
      value: number;
    }[];
    lazySupply: string;
    pending: [];
    mintedAt: UnixTimestamp;
    lastUpdatedAt: UnixTimestamp;
    supply: string;
    meta: {
      name: string;
      description: string;
      tags: string[];
      genres: string[];
      originalMetaUri: string;
      attributes: {
        key: string;
        value: string;
        type: string;
        format: string;
      }[];
      content: [
        {
          "@type": string;
          url: string;
          representation: string;
          mimeType: string;
          size: number;
          available: boolean;
          width: number;
          height: number;
        },
      ];
    };
    deleted: boolean;
    originOrders: {
      origin: string;
      bestSellOrder: {
        id: string;
        fill: string;
      }[];
      bestBidOrder: {
        id: string;
        fill: string;
      }[];
    }[];
    ammOrders: {
      ids: string[];
    };
    auctions: {
      id: string;
      contract: string;
    }[];
    totalStock: string;
    sellers: number;
    suspicious: boolean;
  }[];
}
