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
    const apiKey = chainConfig.get(ChainId(chainId));
    const url = `https://api.gnosisscan.io/api?module=account&action=balance&address=${accountAddress}&tag=latest&apikey=${apiKey}`;
    // https://gnosisscan.io/address/0x633b0e4cc5b72e7196e12b6b8af1d79c7d406c83#tokentxnsErc721
    console.log("Gnosis url: ", url);
    return this.ajaxUtils
      .get<IGnosisscanBlockNumberResponse>(
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
      .get<IGnosisscanTransactionResponse>(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        new URL(url!),
      )
      .map((tokenResponse) => {
        console.log("Gnosis tokenResponse: ", tokenResponse);

        const tokenBalances: EVMTransaction[] = [];
        const chainInfo = getChainInfoByChainId(chainId);
        // tx.timeStamp
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
      .get<IGnosisscanTransactionResponse>(
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

interface IGnosisBlockNumberResponse {
  status: string;
  message: string;
  result: BigNumberString;
}

interface IGnosisscanBlockNumberResponse {
  status: string;
  message: string;
  result: BigNumberString;
}

interface IMoralisNFTResponse {
  total: number;
  page: number;
  page_size: number;
  status: string;
  cursor: string | null;

  result: {
    token_address: string;
    token_id: string;
    owner_of: string;
    block_number: string;
    block_number_minted: string;
    token_hash: string;
    amount: string;
    updated_at: string;
    contract_type: string;
    name: string;
    symbol: string;
    token_uri: string;
    metadata: string;
  }[];

  last_token_uri_sync: string | null;
  last_metadata_sync: string | null;
}

type IMoralisBalanceResponse = {
  token_address: EVMContractAddress;
  name: string;
  symbol: TickerSymbol;
  logo: URLString | null;
  thumbnail: URLString | null;
  decimals: number;
  balance: BigNumberString;
}[];

interface IMoralisNativeBalanceResponse {
  balance: BigNumberString;
}
