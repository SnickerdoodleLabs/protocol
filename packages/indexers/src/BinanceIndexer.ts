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
} from "@snickerdoodlelabs/objects";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  IIndexerConfigProviderType,
  IIndexerConfigProvider,
} from "@indexers/IIndexerConfigProvider.js";

export class BinanceIndexer
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
    return this._getEtherscanApiKey(chainId).andThen((apiKey) => {
      const url = `https://api.gnosisscan.io/api?module=account&action=balance&address=${accountAddress}&tag=latest&apikey=${apiKey}`;
      // https://gnosisscan.io/address/0x633b0e4cc5b72e7196e12b6b8af1d79c7d406c83#tokentxnsErc721
      console.log("Gnosis url: ", url);
      return this.ajaxUtils
        .get<IBinancescanBlockNumberResponse>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new URL(url!),
        )
        .map((balanceResponse) => {
          console.log("Gnosis tokenResponse: ", balanceResponse);
          const tokenBalances: TokenBalance[] = [];
          const chainInfo = getChainInfoByChainId(chainId);
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
    });
  }

  public getEVMTransactions(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError> {
    const apiKey = chainConfig.get(ChainId(chainId));
    const gnosisContractAddress = "0x22c1f6050e56d2876009903609a2cc3fef83b415";
    const url = `https://api.gnosisscan.io/api?module=account&action=tokennfttx&contractaddress=${gnosisContractAddress}&address=${accountAddress}&page=1&offset=100&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
    // https://gnosisscan.io/address/0x633b0e4cc5b72e7196e12b6b8af1d79c7d406c83#tokentxnsErc721
    console.log("Gnosis url: ", url);
    return this.ajaxUtils
      .get<IBinancescanTransactionResponse>(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        new URL(url!),
      )
      .map((tokenResponse) => {
        console.log("Binance tokenResponse: ", tokenResponse);
        return tokenResponse.result.map((tx) => {
          return new EVMTransaction(
            chainId,
            EVMTransactionHash(""),
            UnixTimestamp(100),
            tx.blockHash,
            EVMAccountAddress(tx.to),
            EVMAccountAddress(tx.from),
            tx.value!,
            tx.gasPrice,
            EVMContractAddress(tx.contractAddress),
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
    const apiKey = chainConfig.get(ChainId(chainId));
    const gnosisContractAddress = "0x22c1f6050e56d2876009903609a2cc3fef83b415";
    const url = `https://api.gnosisscan.io/api?module=account&action=tokennfttx&contractaddress=${gnosisContractAddress}&address=${accountAddress}&page=1&offset=100&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
    // https://gnosisscan.io/address/0x633b0e4cc5b72e7196e12b6b8af1d79c7d406c83#tokentxnsErc721
    console.log("Gnosis url: ", url);
    return this.ajaxUtils
      .get<IBinancescanTransactionResponse>(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        new URL(url!),
      )
      .map((tokenResponse) => {
        return tokenResponse.result.map((tx) => {
          return new EVMNFT(
            EVMContractAddress(tx.contractAddress),
            tx.tokenID!,
            "",
            EVMAccountAddress(""),
            undefined,
            undefined,
            BigNumberString(""),
            "",
            chainId,
          );
        });
      });
  }

  protected _getEtherscanApiKey(
    chain: ChainId,
  ): ResultAsync<string, AccountIndexingError> {
    console.log("inside gnosis _getEtherscanApiKey");

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

interface IBinancescanTransactionResponse {
  status: string;
  message: string;
  result: IBinancescanRawTx[];
}

interface IBinancescanRawTx {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: number;
  transactionIndex: string;
  from: string;
  to: string;
  value?: BigNumberString;
  gas: BigNumberString;
  gasPrice: BigNumberString;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  tokenID?: BigNumberString;
}

interface IBinancescanBlockNumberResponse {
  status: string;
  message: string;
  result: BigNumberString;
}
