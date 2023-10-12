import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
  ObjectUtils,
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
  MethodSupportError,
  EDataProvider,
  EExternalApi,
  URLString,
  DecimalString,
  EVMTransactionHash,
  SuiTransactionHash,
  SuiAccountAddress,
  SuiNFT,
  SuiTransaction,
  getChainInfoByChain,
} from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IEVMIndexer,
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
  IIndexerContextProvider,
  IIndexerContextProviderType,
  ISuiIndexer,
} from "@indexers/interfaces/index.js";
import { MasterIndexer } from "@indexers/MasterIndexer.js";

@injectable()
export class BlockvisionIndexer implements ISuiIndexer {
  protected health: Map<EChain, EComponentStatus> = new Map<
    EChain,
    EComponentStatus
  >();
  protected supportedChains = new Map<EChain, IndexerSupportSummary>([
    [EChain.Sui, new IndexerSupportSummary(EChain.Sui, true, true, true)],
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
      if (
        config.apiKeys.blockvisionKey == "" ||
        config.apiKeys.blockvisionKey == null
      ) {
        this.health.set(EChain.Sui, EComponentStatus.NoKeyProvided);
      } else {
        this.health.set(EChain.Sui, EComponentStatus.Available);
      }
    });
  }

  public name(): string {
    return EDataProvider.Blockvision;
  }

  public getBalancesForAccount(
    chain: EChain,
    accountAddress: SuiAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ])
      .andThen(([config, context]) => {
        const url =
          "https://sui-mainnet.blockvision.org/v1/" +
          config.apiKeys.blockvisionKey;

        const requestParams = {
          jsonrpc: "2.0",
          id: 1,
          method: "suix_getBalance",
          params: [
            accountAddress, // "0x316a0693b0d900bb34711438b6974ead2c9a93716fd41f8a8377fa3dc5997abd",
            "0x2::sui::SUI",
          ],
        };
        context.privateEvents.onApiAccessed.next(EExternalApi.Blockvision);
        return this.ajaxUtils.post<IBlockvisionBalancesReponse>(
          new URL(url),
          requestParams,
          {
            headers: {
              "Content-Type": `application/json;`,
            },
          },
        );
      })
      .map((balance) => {
        const nativeBalance = new TokenBalance(
          EChainTechnology.Sui,
          TickerSymbol("SUI"),
          chain,
          MasterIndexer.nativeAddress,
          accountAddress,
          BigNumberString(
            BigNumber.from(balance.result.totalBalance).toString(),
          ),
          getChainInfoByChain(chain).nativeCurrency.decimals,
        );
        return [nativeBalance];
      });
  }

  // TODO: BLOCKVISION ENTERPRISE ACCESS REQUIRED
  public getTokensForAccount(
    chain: EChain,
    accountAddress: SuiAccountAddress,
  ): ResultAsync<SuiNFT[], AccountIndexingError | AjaxError> {
    return okAsync([]);
  }

  // TODO: BLOCKVISION ENTERPRISE ACCESS REQUIRED
  public getSuiTransactions(
    chain: EChain,
    accountAddress: SuiAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<SuiTransaction[], AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
      this.receiveSuiIds(),
    ])
      .andThen(([config, context, digests]) => {
        const url =
          "https://sui-mainnet.blockvision.org/v1/" +
          config.apiKeys.blockvisionKey;

        const requestParams = {
          jsonrpc: "2.0",
          id: 1,
          method: "sui_getEvents",
          params: digests,
        };

        context.privateEvents.onApiAccessed.next(EExternalApi.Blockvision);
        return this.ajaxUtils.post<IBlockvisionTransactionReponse>(
          new URL(url),
          requestParams,
          {
            headers: {
              "Content-Type": `application/json;`,
            },
          },
        );
      })
      .map((response) => {
        return response.result.map((item) => {
          return new SuiTransaction(
            chain,
            SuiTransactionHash(item.id.txDigest),
            UnixTimestamp(item.id.eventSeq),
            null,
            SuiAccountAddress(item.parsedJson.seller),
            SuiAccountAddress(item.parsedJson.buyer),
            BigNumberString(item.parsedJson.price),
            null,
            null,
            item.parsedJson.buyer_kiosk,
            item.type,
            null,
            null,
          );
        });
      });
  }

  private receiveSuiIds(): ResultAsync<string[], never> {
    return okAsync([
      "AHRCgK4P29BboEPoEzLNuQZUXwgPafR9DG4izCkroHUv",
      "965HckqhcQaJukSG9qQsjgBVPcNiBhFU9EsVcgrLAysv",
    ]);
  }

  public healthStatus(): Map<EChain, EComponentStatus> {
    return this.health;
  }

  public getSupportedChains(): Map<EChain, IndexerSupportSummary> {
    return this.supportedChains;
  }
}

interface IBlockvisionBalancesReponse {
  id: number;
  jsonrpc: number;
  result: {
    coinType: string;
    coinObjectCount: number;
    totalBalance: BigNumberString;
    lockedBalance: {};
  };
}

interface IBlockvisionTransactionReponse {
  jsonrpc: string;
  result: IBlockvisionTransaction[];
  id: number;
}

interface IBlockvisionTransaction {
  id: {
    txDigest: string;
    eventSeq: number;
  };
  packageId: string;
  transactionModule: string;
  sender: string;
  type: string;
  parsedJson: {
    buyer: EVMAccountAddress;
    buyer_kiosk: string;
    ft_type: string;
    nft: string;
    nft_type: string;
    orderbook: string;
    price: string;
    seller: string;
    seller_kiosk: string;
    trade_intermediate: null;
  };
  bcs: string;
}
