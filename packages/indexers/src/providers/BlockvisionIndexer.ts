import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
  ObjectUtils,
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

  public getSuiTransactions(
    chain: EChain,
    accountAddress: SuiAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<SuiTransaction[], AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
      this.getTxDigests(accountAddress),
    ])
      .andThen(([config, context, digests]) => {
        const url =
          "https://sui-mainnet.blockvision.org/v1/" +
          config.apiKeys.blockvisionKey;

        digests = digests.filter(
          (item, index) => digests.indexOf(item) === index,
        );
        const requestParams = {
          jsonrpc: "2.0",
          id: 1,
          method: "sui_multiGetTransactionBlocks",
          params: [
            digests,
            {
              showInput: false,
              showRawInput: false,
              showEffects: false,
              showEvents: false,
              showObjectChanges: true,
              showBalanceChanges: true,
            },
          ],
        };

        context.privateEvents.onApiAccessed.next(EExternalApi.Blockvision);
        return this.ajaxUtils.post<IBlockvisionEventsResponse>(
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
        return response.result
          .map((value) => {
            const balanceUpdates = this.retrieveBalanceChanges(
              value.digest,
              value.balanceChanges,
            );
            const objectUpdates = this.retrieveObjectChanges(
              value.objectChanges,
            );
            const updates = [...balanceUpdates, ...objectUpdates];
            return updates;
          })
          .flat();
      })
      .mapErr((e) => {
        console.log(e);
        return e;
      });
  }

  private retrieveBalanceChanges(
    digest: string,
    param: IBalanceChanges[],
  ): SuiTransaction[] {
    return param.map((item) => {
      return new SuiTransaction(
        EChain.Sui,
        SuiTransactionHash(digest),
        UnixTimestamp(0),
        null,
        null,
        null,
        BigNumberString(item.amount),
        null,
        null,
        null,
        null,
        "balance",
        null,
      );
    });
  }

  private retrieveObjectChanges(param: IObjectChanges[]): SuiTransaction[] {
    return param.map((item) => {
      return new SuiTransaction(
        EChain.Sui,
        SuiTransactionHash(item.digest),
        UnixTimestamp(item.version),
        null,
        SuiAccountAddress(item.sender),
        SuiAccountAddress(item.owner.ObjectOwner),
        null,
        null,
        null,
        null,
        null,
        "object",
        null,
      );
    });
  }

  private getTxDigests(
    accountAddress: SuiAccountAddress,
  ): ResultAsync<string[], AjaxError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ])
      .andThen(([config, context]) => {
        const url =
          "https://api.blockvision.org/v2/sui/account/activities?address=" +
          accountAddress;

        let apiKey = config.apiKeys.blockvisionKey;
        if (apiKey == null) {
          apiKey = "";
        }

        const requestParams: IRequestConfig = {
          method: "get",
          url: url,
          headers: {
            accept: "application/json",
            "X-API-Key": apiKey,
          },
        };

        context.privateEvents.onApiAccessed.next(EExternalApi.Blockvision);
        return this.ajaxUtils.get<IBlockvisionDigestReponse>(
          new URL(url),
          requestParams,
        );
      })
      .map((response) => {
        return response.result.data.map((item) => {
          return item.txDigest;
        });
      });
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

interface IBlockvisionEventsResponse {
  jsonrpc: string;
  result: IBlockvisionChanges[];
  id: number;
}

interface IObjectChanges {
  type: string;
  sender: string;
  owner: {
    ObjectOwner: string;
  };
  objectType: string;
  objectId: string;
  version: number;
  previousVersion: string;
  digest: string;
}

interface IBalanceChanges {
  owner: {
    AddressOwner: SuiAccountAddress;
  };
  coinType: string;
  amount: string;
}

interface IBlockvisionChanges {
  digest: string;
  objectChanges: IObjectChanges[];
  balanceChanges: IBalanceChanges[];
  timestampMs: string;
  checkpoint: string;
}

interface IBlockvisionEvent {
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

interface IBlockvisionDigestReponse {
  code: number;
  message: string;
  result: {
    data: IBlockvisionDigest[];
  };
  nextPageCursor: number;
}

interface IBlockvisionDigest {
  txDigest: string;
  package: string;
  timestampMs: number;
  projectName: string;
  icon: string;
  projectURL: string;
  activityType: string;
  moduleName: string;
  functionName: string;
  nftMetadata: string | null;
}
