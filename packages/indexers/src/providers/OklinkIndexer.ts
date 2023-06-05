import { Metaplex } from "@metaplex-foundation/js";
import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  EChainTechnology,
  TickerSymbol,
  getChainInfoByChainId,
  AccountIndexingError,
  AjaxError,
  ChainId,
  TokenBalance,
  BigNumberString,
  ITokenPriceRepositoryType,
  ITokenPriceRepository,
  EVMAccountAddress,
  EVMContractAddress,
  EChain,
  IEVMIndexer,
  EVMNFT,
  EVMTransaction,
  MethodSupportError,
  EComponentStatus,
  IndexerSupportSummary,
  EDataProvider,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";
import Web3 from "web3";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/interfaces/IIndexerConfigProvider.js";

@injectable()
export class OklinkIndexer implements IEVMIndexer {
  protected health: Map<EChain, EComponentStatus> = new Map<
    EChain,
    EComponentStatus
  >();
  protected indexerSupport = new Map<EChain, IndexerSupportSummary>([
    [
      EChain.EthereumMainnet,
      new IndexerSupportSummary(EChain.EthereumMainnet, true, false, false),
    ],
    [
      EChain.Moonbeam,
      new IndexerSupportSummary(EChain.Moonbeam, true, false, false),
    ],
    [
      EChain.Binance,
      new IndexerSupportSummary(EChain.Binance, true, false, false),
    ],
    [
      EChain.Gnosis,
      new IndexerSupportSummary(EChain.Gnosis, true, false, false),
    ],
  ]);

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public name(): string {
    return EDataProvider.Oklink;
  }

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this._getOKXConfig(chainId),
      this.configProvider.getConfig(),
    ])
      .andThen(([okxSettings, config]) => {
        const chainInfo = this.getChainShortName(chainId);
        const url = urlJoinP(
          "https://www.oklink.com/api/v5/explorer/address/",
          ["address-balance-fills"],
          {
            chainShortName: chainInfo.toString(),
            address: accountAddress,
            protocolType: "token_20",
          },
        );

        return this.ajaxUtils.get<IOKXNativeBalanceResponse>(new URL(url), {
          headers: {
            "Ok-Access-Key": config.apiKeys.oklinkApiKey,
          },
        });
      })
      .andThen((response) => {
        if (response.code != "0") {
          return errAsync(
            new AccountIndexingError("Bad url response from Oklink"),
          );
        }
        const balances = response.data[0].tokenList.map((token) => {
          return new TokenBalance(
            EChainTechnology.EVM,
            token.token,
            chainId,
            token.tokenContractAddress,
            accountAddress,
            BigNumberString(Web3.utils.toWei(token.holdingAmount).toString()),
            18,
          );
        });
        return okAsync(balances);
      });
  }

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    EVMNFT[],
    AccountIndexingError | AjaxError | MethodSupportError
  > {
    return errAsync(
      new MethodSupportError(
        "getTokensForAccount not supported for OklinkIndexer",
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
    AccountIndexingError | AjaxError | MethodSupportError
  > {
    return errAsync(
      new MethodSupportError(
        "getEVMTransactions not supported for OklinkIndexer",
        400,
      ),
    );
  }

  public getHealthCheck(): ResultAsync<
    Map<EChain, EComponentStatus>,
    AjaxError
  > {
    return this.configProvider.getConfig().andThen((config) => {
      this.indexerSupport.forEach(
        (value: IndexerSupportSummary, key: EChain) => {
          if (config.apiKeys.oklinkApiKey == "") {
            this.health.set(key, EComponentStatus.NoKeyProvided);
          } else {
            this.health.set(key, EComponentStatus.Available);
          }
        },
      );
      return okAsync(this.health);
    });
  }

  public healthStatus(): Map<EChain, EComponentStatus> {
    return this.health;
  }

  public getSupportedChains(): Map<EChain, IndexerSupportSummary> {
    return this.indexerSupport;
  }

  private _getOKXConfig(
    chain: ChainId,
  ): ResultAsync<oklinkAjaxSettings, AccountIndexingError> {
    return this.configProvider.getConfig().andThen((config) => {
      switch (chain) {
        default:
          return okAsync({
            id: 0,
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: ["0x633b0E4cc5b72e7196e12b6B8aF1d79c7D406C83", "latest"],
          });
      }
    });
  }

  private getChainShortName(chainId: ChainId): string {
    switch (getChainInfoByChainId(chainId).chain) {
      case EChain.Avalanche:
        return "avaxc";
      default:
        return getChainInfoByChainId(chainId).name;
    }
  }
}

interface IOKXNativeBalanceResponse {
  code: string;
  msg: string;
  data: typedData[];
}

interface typedData {
  page: string;
  limit: string;
  totalPage: string;
  chainFullName: string;
  chainShortName: string;
  tokenList: tokenData[];
}

interface tokenData {
  token: TickerSymbol;
  tokenId: string;
  holdingAmount: string; // how much native token you own
  totalTokenValue: string;
  change24h: string;
  priceUsd: BigNumberString; // usd value per token
  valueUsd: BigNumberString; // total usd amount you own
  tokenContractAddress: EVMContractAddress;
}

interface oklinkAjaxSettings {
  id: number;
  jsonrpc: string;
  method: string;
  params: string[];
}
