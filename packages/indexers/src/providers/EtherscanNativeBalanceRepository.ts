import {
  IAxiosAjaxUtilsType,
  IAxiosAjaxUtils,
  ILogUtilsType,
  ILogUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountIndexingError,
  AjaxError,
  ChainId,
  EVMAccountAddress,
  EVMTransaction,
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
  TokenBalance,
  EChainTechnology,
  BigNumberString,
  TickerSymbol,
  URLString,
  EVMNFT,
  IEVMIndexer,
  MethodSupportError,
  EChain,
  getChainInfoByChain,
  EComponentStatus,
  IndexerSupportSummary,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { IRequestConfig } from "packages/common-utils/src";
import { urlJoinP } from "url-join-ts";

import {
  IIndexerConfigProviderType,
  IIndexerConfigProvider,
} from "@indexers/interfaces/IIndexerConfigProvider.js";
import { IIndexerHealthCheck } from "@indexers/interfaces/IIndexerHealthCheck.js";

@injectable()
export class EtherscanNativeBalanceRepository implements IEVMIndexer {
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
    [
      EChain.Avalanche,
      new IndexerSupportSummary(EChain.Avalanche, true, false, false),
    ],
    [EChain.Fuji, new IndexerSupportSummary(EChain.Fuji, true, false, false)],
  ]);

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getBalancesForAccount(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AjaxError | AccountIndexingError> {
    return ResultUtils.combine([
      this._getEtherscanApiKey(chain),
      this._getBlockExplorerUrl(chain),
    ]).andThen(([apiKey, explorerUrl]) => {
      const url = `${explorerUrl}api?module=account&action=balance&address=${accountAddress}&tag=latest&apikey=${apiKey}`;

      return this.ajaxUtils
        .get<IGnosisscanBalanceResponse>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new URL(url!),
        )
        .map((balanceResponse) => {
          const tokenBalances: TokenBalance[] = [];
          const chainInfo = getChainInfoByChain(chain);
          tokenBalances.push(
            new TokenBalance(
              EChainTechnology.EVM,
              TickerSymbol(chainInfo.nativeCurrency.symbol),
              chainInfo.chainId,
              null,
              accountAddress,
              balanceResponse.result,
              chainInfo.nativeCurrency.decimals,
            ),
          );
          return tokenBalances;
        });
    });
  }

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    EVMNFT[],
    AccountIndexingError | AjaxError | MethodSupportError
  > {
    // throw new Error("Method not implemented.");
    return errAsync(
      new MethodSupportError(
        "getTokensForAccount not supported for EtherscanNativeBalanceRepository",
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
        "getEVMTransactions not supported for EtherscanNativeBalanceRepository",
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
          console.log(
            "etherscan native key: " +
              getChainInfoByChain(key).name +
              " and balance: " +
              JSON.stringify(value),
          );
          console.log(
            "config.apiKeys.etherscanApiKeys[key]: ",
            config.apiKeys.etherscanApiKeys[getChainInfoByChain(key).name],
          );
          if (config.apiKeys.etherscanApiKeys[key] == "") {
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

  protected _getBlockExplorerUrl(
    chain: EChain,
  ): ResultAsync<URLString, AccountIndexingError> {
    const chainInfo = getChainInfoByChain(chain);
    if (chainInfo == undefined) {
      this.logUtils.error("Error inside _getEtherscanApiKey");
      return errAsync(
        new AccountIndexingError("no etherscan api key for chain", chain),
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const url = chainInfo.etherscanEndpointURL!;
    return okAsync(url);
  }

  protected _getEtherscanApiKey(
    chain: EChain,
  ): ResultAsync<string, AccountIndexingError> {
    return this.configProvider.getConfig().andThen((config) => {
      const key = getChainInfoByChain(chain).name;
      console.log("get etherscan api key: " + key);
      if (
        config.apiKeys.etherscanApiKeys[key] == "" ||
        config.apiKeys.etherscanApiKeys[key] == undefined
      ) {
        this.logUtils.error("Error inside _getEtherscanApiKey");
        return errAsync(
          new AccountIndexingError("no etherscan api key for chain", chain),
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return okAsync(config.apiKeys.etherscanApiKeys[key]!);
    });
  }

  public getSupportedChains(): Map<EChain, IndexerSupportSummary> {
    return this.indexerSupport;
  }
}

enum urlAction {
  balance = "balance",
  tokentx = "tokentx",
  tokennfttx = "tokennfttx",
}

interface IGnosisscanTransactionResponse {
  status: string;
  message: string;
  result: IGnosisscanRawTx[];
}

interface IHealthCheck {
  status?: string;
  message?: string;
}

interface IGnosisscanRawTx {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: number;
  from: string;
  to: string;
  value: string;
  gas: BigNumberString;
  gasPrice: BigNumberString;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  tokenID?: string;
  transactionIndex: string;
  tokenName: string;
  tokenSymbol: string;
}

interface IGnosisscanBalanceResponse {
  status: string;
  message: string;
  result: BigNumberString;
}
