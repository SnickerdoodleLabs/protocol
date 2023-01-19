import {
  IAxiosAjaxUtilsType,
  IAxiosAjaxUtils,
  ILogUtilsType,
  ILogUtils,
  IRequestConfig,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountIndexingError,
  AjaxError,
  ChainId,
  EVMAccountAddress,
  EVMTransaction,
  IEVMAccountBalanceRepository,
  IEVMTransactionRepository,
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
  TokenBalance,
  EChainTechnology,
  BigNumberString,
  TickerSymbol,
  EVMContractAddress,
  getChainInfoByChainId,
  EVMTransactionHash,
  UnixTimestamp,
  URLString,
  EVMNFT,
  IEVMNftRepository,
  chainConfig,
  TokenUri,
} from "@snickerdoodlelabs/objects";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import {
  IIndexerConfigProviderType,
  IIndexerConfigProvider,
} from "@indexers/IIndexerConfigProvider.js";

const poapAddress = "0x22c1f6050e56d2876009903609a2cc3fef83b415";

export class GnosisIndexer
  implements
    IEVMAccountBalanceRepository,
    IEVMTransactionRepository,
    IEVMNftRepository
{
  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AjaxError | AccountIndexingError> {
    return this._getEtherscanApiKey(chainId)
      .andThen((apiKey) => {
        return ResultUtils.combine([
          this.generateUrl(accountAddress, apiKey, "tokentx"),
          this.generateUrl(accountAddress, apiKey, "balance"),
        ]);
      })
      .andThen(([transactionUrl, blockNumberUrl]) => {
        return ResultUtils.combine([
          this.ajaxUtils.get<IGnosisscanTransactionResponse>(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            new URL(transactionUrl!),
          ),
          this.ajaxUtils.get<IGnosisscanBalanceResponse>(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            new URL(blockNumberUrl),
          ),
        ]);
      })
      .map(([tokenResponse, balanceResponse]) => {
        const chainInfo = getChainInfoByChainId(chainId);
        const tokenBalances: TokenBalance[] = [];
        tokenBalances.push(
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol(chainInfo.nativeCurrency.symbol),
            chainId,
            null,
            accountAddress,
            balanceResponse.result,
            chainInfo.nativeCurrency.decimals,
          ),
        );
        return tokenBalances;
      });
  }

  public getEVMTransactions(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError> {
    return this._getEtherscanApiKey(chainId)
      .andThen((apiKey) => {
        return this.generateUrl(accountAddress, apiKey, "tokennfttx");
      })
      .andThen((transactionsUrl) => {
        return this.ajaxUtils.get<IGnosisscanTransactionResponse>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new URL(transactionsUrl!),
        );
      })
      .map((tokenResponse) => {
        return tokenResponse.result.map((tx) => {
          return new EVMTransaction(
            chainId,
            EVMTransactionHash(tx.hash),
            UnixTimestamp(Number.parseInt(tx.timeStamp)),
            tx.blockNumber == "" ? null : Number.parseInt(tx.blockNumber),
            tx.to == "" ? null : EVMAccountAddress(tx.to),
            tx.from == "" ? null : EVMAccountAddress(tx.from),
            tx.value == "" ? null : BigNumberString(tx.value),
            tx.gasPrice == "" ? null : BigNumberString(tx.gasPrice),
            tx.contractAddress == ""
              ? null
              : EVMContractAddress(tx.contractAddress),
            null,
            null,
            null,
            null,
          );
        });
      });
  }

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<EVMNFT[], AccountIndexingError | AjaxError> {
    return this._getEtherscanApiKey(chainId)
      .andThen((apiKey) => {
        return this.generateUrl(accountAddress, apiKey, "tokennfttx");
      })
      .andThen((url) => {
        return this.ajaxUtils.get<IGnosisscanTransactionResponse>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new URL(url!),
        );
      })
      .map((tokenResponse) => {
        return tokenResponse.result.map((tx) => {
          return new EVMNFT(
            EVMContractAddress(tx.contractAddress),
            BigNumberString(tx.tokenID || "0"),
            "ERC721",
            EVMAccountAddress(accountAddress),
            TokenUri(tx.hash),
            tx,
            BigNumberString(tx.value),
            tx.confirmations,
            chainId,
          );
        });
      });
  }

  protected _getEtherscanApiKey(
    chain: ChainId,
  ): ResultAsync<string, AccountIndexingError> {
    return this.configProvider.getConfig().andThen((config) => {
      if (!config.etherscanApiKeys.has(chain)) {
        console.log("Error inside _getEtherscanApiKey");
        return errAsync(
          new AccountIndexingError("no etherscan api key for chain", chain),
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return okAsync(config.etherscanApiKeys.get(chain)!);
    });
  }

  protected generateUrl(
    accountAddress: EVMAccountAddress,
    apiKey: string,
    action: string,
  ): ResultAsync<URLString, AccountIndexingError> {
    const url = `https://api.gnosisscan.io/api?module=account&action=${action}&address=${accountAddress}&tag=latest&apikey=${apiKey}`;
    if (action == "tokennfttx") {
      const url = `https://api.gnosisscan.io/api?module=account&action=${action}&contractaddress=${poapAddress}&address=${accountAddress}&page=1&offset=100&sort=asc&apikey=${apiKey}`;
    }
    return okAsync(URLString(url));
  }
}

interface IGnosisscanTransactionResponse {
  status: string;
  message: string;
  result: IGnosisscanRawTx[];
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
