import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
  ObjectUtils,
  IRequestConfig,
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
  EChain,
  TokenUri,
  UnixTimestamp,
  EComponentStatus,
  IndexerSupportSummary,
  EDataProvider,
  EExternalApi,
  SuiTransactionDigest,
  SuiAccountAddress,
  SuiNFT,
  SuiTransaction,
  getChainInfoByChain,
  SuiTokenAddress,
  SuiCollection,
  SuiContractAddress,
} from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
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
  nativeSuiAddress = SuiAccountAddress(
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  );

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(IIndexerContextProviderType)
    protected contextProvider: IIndexerContextProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
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

  public name(): EDataProvider {
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
          params: [accountAddress, "0x2::sui::SUI"],
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

  public getTokensForAccount(
    chain: EChain,
    accountAddress: SuiAccountAddress,
  ): ResultAsync<SuiNFT[], AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ])
      .andThen(([config, context]) => {
        const url =
          "https://api.blockvision.org/v2/sui/nft/accountCollection?owner=" +
          accountAddress +
          "&pageIndex=1&pageSize=20";

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
        return this.ajaxUtils.get<IBlockvisionNftReponse>(
          new URL(url),
          requestParams,
        );
      })
      .map((response) => {
        if (response.result == null) {
          return [];
        }
        return response.result.data.map((item) => {
          if (item == null) {
            return null;
          }
          return new SuiNFT(
            SuiTokenAddress(item.package),
            BigNumberString("1"),
            SuiTokenAddress(item.package),
            accountAddress,
            TokenUri(item.imageURL),
            { raw: ObjectUtils.serialize(item) },
            BigNumberString(item.quantity.toString()),
            item.name,
            EChain.Sui,
            this.timeUtils.getUnixNow(),
            undefined,
            undefined,
          );
        });
      })
      .map((balances) => {
        return balances.filter((obj) => obj != null) as SuiNFT[];
      });
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
        if (response.result.data == null) {
          return [];
        }
        return this.parseBalances(response, accountAddress)
          .concat(this.parseNfts(response, accountAddress))
          .concat(this.parseAddresses(response, accountAddress));
      })
      .mapErr((e) => {
        console.log(e);
        return e;
      });
  }

  private parseBalances(
    digestResponse: IBlockvisionDigestReponse,
    accountAddress: SuiAccountAddress,
  ): SuiTransaction[] {
    return digestResponse.result.data
      .map((digest) => {
        if (digest.coinChanges == null) {
          return [];
        }
        const balances = digest.coinChanges.map((balanceChange) => {
          let to = accountAddress;
          let from = accountAddress;
          let gasFee = digest.gasFee;
          if (digest.type.toLowerCase() == "receive") {
            to = accountAddress;
            from = SuiAccountAddress(digest.sender);
          }
          if (digest.type.toLowerCase() == "take") {
            to = SuiAccountAddress(digest.sender);
            from = accountAddress;
          }
          if (gasFee < 0) {
            gasFee = gasFee * -1;
          }
          return new SuiTransaction(
            EChain.Sui,
            SuiTransactionDigest(digest.digest),
            UnixTimestamp(digest.timestampMs),
            to,
            from,
            BigNumberString(balanceChange.amount),
            BigNumberString(gasFee.toString()),
            SuiContractAddress(balanceChange.coinAddress),
            null,
            null,
            null,
            null,
            this.timeUtils.getUnixNow(),
          );
        });
        return balances;
      })
      .flat();
  }

  private parseNfts(
    digestResponse: IBlockvisionDigestReponse,
    accountAddress: SuiAccountAddress,
  ): SuiTransaction[] {
    return digestResponse.result.data
      .map((digest) => {
        if (digest.nftChanges == null) {
          return [];
        }
        const nfts = digest.nftChanges.map((nftChange) => {
          let to = accountAddress;
          let from = accountAddress;
          let gasFee = digest.gasFee;
          if (digest.type.toLowerCase() == "receive") {
            to = accountAddress;
            from = SuiAccountAddress(digest.sender);
          }
          if (digest.type.toLowerCase() == "take") {
            to = SuiAccountAddress(digest.sender);
            from = accountAddress;
          }
          if (gasFee < 0) {
            gasFee = gasFee * -1;
          }
          return new SuiTransaction(
            EChain.Sui,
            SuiTransactionDigest(digest.digest),
            UnixTimestamp(digest.timestampMs),
            to,
            from,
            BigNumberString(nftChange.amount),
            BigNumberString(gasFee.toString()),
            SuiContractAddress(nftChange.packageId),
            null,
            null,
            null,
            null,
            this.timeUtils.getUnixNow(),
          );
        });
        return nfts;
      })
      .flat();
  }

  private parseAddresses(
    digestResponse: IBlockvisionDigestReponse,
    accountAddress: SuiAccountAddress,
  ): SuiTransaction[] {
    return digestResponse.result.data
      .map((digest) => {
        if (digest.interactAddresses == null) {
          return [];
        }
        const balances = digest.interactAddresses.map((addressChange) => {
          let to = accountAddress;
          let from = accountAddress;
          let gasFee = digest.gasFee;
          if (digest.type.toLowerCase() == "receive") {
            to = accountAddress;
            from = SuiAccountAddress(digest.sender);
          }
          if (digest.type.toLowerCase() == "take") {
            to = SuiAccountAddress(digest.sender);
            from = accountAddress;
          }
          if (gasFee < 0) {
            gasFee = gasFee * -1;
          }
          return new SuiTransaction(
            EChain.Sui,
            SuiTransactionDigest(digest.digest),
            UnixTimestamp(digest.timestampMs),
            to,
            from,
            null,
            BigNumberString(gasFee.toString()),
            SuiContractAddress(addressChange.address),
            null,
            null,
            null,
            null,
            this.timeUtils.getUnixNow(),
          );
        });
        return balances;
      })
      .flat();
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
  amount: number;
}

interface IBlockvisionChanges {
  digest: string;
  objectChanges: IObjectChanges[];
  balanceChanges: IBalanceChanges[];
  timestampMs: string;
  checkpoint: string;
}

interface IBlockvisionDigestReponse {
  code: number;
  message: string;
  result: {
    data: IBlockvisionDigest[];
  };
  nextPageCursor: number;
}

interface IBlockvisionNftReponse {
  code: number;
  message: string;
  result: {
    data: {
      objectType: string;
      package: string;
      name: string;
      imageURL: string;
      projectURL: string;
      description: string;
      standard: string;
      quantity: number;
    }[];
  };
  nextPageCursor: number;
}

interface IBlockvisionDigest {
  digest: string;
  timestampMs: number;
  type: string;
  coinChanges:
    | {
        amount: string;
        coinAddress: string;
        symbol: string;
        decimal: string;
        logo: string;
      }[]
    | null;
  nftChanges:
    | {
        objectId: string;
        objectType: string;
        marketPlace: string;
        imageURL: string;
        name: string;
        packageId: string;
        amount: string;
        price: string;
      }[]
    | null;
  interactAddresses:
    | {
        address: string;
        type: string;
        name: string;
        logo: string;
      }[]
    | null;
  gasFee: number;
  status: string;
  sender: string;
}
