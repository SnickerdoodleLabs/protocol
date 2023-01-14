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

  private generateQueryConfig(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    endpoint: string,
    cursor?: string,
    contracts?: EVMContractAddress[],
  ): ResultAsync<IRequestConfig, never> {
    const params = {
      format: "decimal",
      chain: `0x${chainId.toString(16)}`,
    };
    if (contracts != undefined) {
      params["token_addresses"] = contracts.toString();
    }
    if (cursor != undefined) {
      params["cursor"] = cursor;
    }

    const apiKey = chainConfig.get(ChainId(chainId));
    const gnosisContractAddress = "0x22c1f6050e56d2876009903609a2cc3fef83b415";
    const url = urlJoinP(
      "https://api.gnosisscan.io/",
      ["api", "v2", accountAddress.toString(), endpoint],
      params,
    );
    const url2 = `https://api.gnosisscan.io/api?module=account&action=balance&address=${accountAddress}&tag=latest&apikey=${apiKey}`;
    const url3 = `https://api.gnosisscan.io/api?module=account&action=tokennfttx&contractaddress=${gnosisContractAddress}&address=${accountAddress}&page=1&offset=100&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
    console.log("url: ", url);
    console.log("url2: ", url2);
    console.log("url3: ", url3);

    return this.configProvider.getConfig().map((config) => {
      const result: IRequestConfig = {
        method: "get",
        url: url,
        headers: {
          accept: "application/json",
          "X-API-Key": config.moralisApiKey,
        },
      };
      return result;
    });
  }

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AjaxError | AccountIndexingError> {
    return this._getEtherscanApiKey(chainId)
      .andThen((apiKey) => {
        // returns ERC-721 tokens
        const url1 = `https://api.gnosisscan.io/api?module=account&action=balance&address=${accountAddress}&tag=latest&apikey=${apiKey}`;
        // returns Gnosis Balance
        const url2 = `https://api.gnosisscan.io/api?module=account&action=balance&address=${accountAddress}&tag=latest&apikey=${apiKey}`;
        return ResultUtils.combine([
          this.ajaxUtils.get<IGnosisscanTransactionResponse>(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            new URL(url1!),
          ),
          this.ajaxUtils.get<IGnosisscanBlockNumberResponse>(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            new URL(url2!),
          ),
        ]);
      })
      .map(([tokenResponse, balanceResponse]) => {
        console.log("Gnosis tokenResponse: ", balanceResponse);
        const chainInfo = getChainInfoByChainId(chainId);
        const tokenBalances = tokenResponse.result.map((item) => {
          return new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol(chainInfo.nativeCurrency.symbol),
            chainId,
            item.contractAddress,
            accountAddress,
            BigNumberString(item.value || "0"),
            getChainInfoByChainId(chainId).nativeCurrency.decimals,
          );
        });
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
    const apiKey = "J7G8U27J1Y9F88E1E56CNNG2K3H98GF4XE";
    const gnosisContractAddress = "0x22c1f6050e56d2876009903609a2cc3fef83b415";
    const url = `https://api.gnosisscan.io/api?module=account&action=tokennfttx&contractaddress=${gnosisContractAddress}&address=${accountAddress}&page=1&offset=100&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
    // https://gnosisscan.io/address/0x633b0e4cc5b72e7196e12b6b8af1d79c7d406c83#tokentxnsErc721
    return this.ajaxUtils
      .get<IGnosisscanTransactionResponse>(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        new URL(url!),
      )
      .map((tokenResponse) => {
        console.log("Gnosis tokenResponse: ", tokenResponse);
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
    const apiKey = "J7G8U27J1Y9F88E1E56CNNG2K3H98GF4XE";
    const gnosisContractAddress = "0x22c1f6050e56d2876009903609a2cc3fef83b415";
    const url = `https://api.gnosisscan.io/api?module=account&action=tokennfttx&contractaddress=${gnosisContractAddress}&address=${accountAddress}&page=1&offset=100&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
    // https://gnosisscan.io/address/0x633b0e4cc5b72e7196e12b6b8af1d79c7d406c83#tokentxnsErc721
    console.log("Gnosis url: ", url);
    return this.ajaxUtils
      .get<IGnosisscanTransactionResponse>(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        new URL(url!),
      )
      .map((tokenResponse) => {
        return tokenResponse.result.map((tx) => {
          console.log("tx: ", tx);
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

interface IGnosisscanBlockNumberResponse {
  status: string;
  message: string;
  result: BigNumberString;
}
