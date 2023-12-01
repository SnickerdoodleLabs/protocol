import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
  ObjectUtils,
  IRequestConfig,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountIndexingError,
  AjaxError,
  TokenBalance,
  BigNumberString,
  EVMAccountAddress,
  EVMContractAddress,
  EChain,
  EVMNFT,
  EVMTransaction,
  UnixTimestamp,
  EComponentStatus,
  IndexerSupportSummary,
  MethodSupportError,
  EDataProvider,
  EExternalApi,
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

@injectable()
export class RaribleIndexer implements IEVMIndexer {
  protected health: Map<EChain, EComponentStatus> = new Map<
    EChain,
    EComponentStatus
  >();
  protected supportedChains = new Map<EChain, IndexerSupportSummary>([
    [
      EChain.EthereumMainnet,
      new IndexerSupportSummary(EChain.EthereumMainnet, false, false, true),
    ],
    [
      EChain.Polygon,
      new IndexerSupportSummary(EChain.Polygon, false, false, true),
    ],
    [
      EChain.Arbitrum,
      new IndexerSupportSummary(EChain.Arbitrum, false, false, true),
    ],
    // TODO: will support functionality once we have balances/nfts to test
    // [
    //   EChain.ZkSyncEra,
    //   new IndexerSupportSummary(EChain.ZkSyncEra, false, false, true),
    // ],
    // [EChain.Base, new IndexerSupportSummary(EChain.Base, false, false, true)],
    // [
    //   EChain.Solana,
    //   new IndexerSupportSummary(EChain.Solana, false, false, true),
    // ],
  ]);

  protected supportedRaribleChains = new Map<EChain, string>([
    [EChain.EthereumMainnet, "ETHEREUM"],
    [EChain.Polygon, "POLYGON"],
    [EChain.Arbitrum, "ARBITRUM"],
    // TODO: will support functionality once we have balances/nfts to test
    // [EChain.ZkSyncEra, "ZKSYNC"],
    // [EChain.Base, "BASE"],
    // [EChain.Solana, "SOLANA"],
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
      if (
        nftSupportChain == undefined ||
        config.apiKeys.raribleApiKey == null
      ) {
        return okAsync([]);
      }
      const url = new URL(
        `https://api.rarible.org/v0.1/items/byOwner?blockchains=${nftSupportChain}&owner=ETHEREUM%3A${accountAddress}`,
      );

      const requestConfig: IRequestConfig = {
        headers: {
          "X-API-Key": config.apiKeys.raribleApiKey,
          accept: "application/json",
        },
      };

      context.privateEvents.onApiAccessed.next(EExternalApi.Rarible);
      return this.ajaxUtils
        .get<IRaribleNftReponse>(url, requestConfig)
        .map((response) => {
          if (response == undefined) {
            return [];
          }
          return response.items.map((item) => {
            let name = "";
            if (item.meta != undefined) {
              name = item.meta.name;
            }
            let contractType = "ERC721";
            if (item.supply !== "1") {
              contractType = "ERC1155";
            }
            return new EVMNFT(
              EVMContractAddress(item.contract.split(":")[1]),
              BigNumberString(item.tokenId),
              contractType,
              accountAddress,
              undefined,
              { raw: ObjectUtils.serialize(item.meta) },
              BigNumberString(item.supply),
              name,
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
      attributes:
        | {
            key: string;
            value: string;
            type: string;
            format: string;
          }[]
        | undefined;
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
    lastSale: {
      date: UnixTimestamp;
      seller: string;
      buyer: string;
      value: string;
      currency: {
        "@type": string;
        blockchain: string;
      };
    } | null;
    suspicious: boolean;
  }[];
}
