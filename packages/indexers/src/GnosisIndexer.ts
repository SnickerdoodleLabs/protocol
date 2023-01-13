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
  EChain,
  EChainTechnology,
  BigNumberString,
  TickerSymbol,
  EVMContractAddress,
  getChainInfoByChainId,
  EVMTransactionHash,
  UnixTimestamp,
  getEtherscanBaseURLForChain,
  PolygonTransaction,
  EPolygonTransactionType,
  URLString,
  EVMNFT,
  TokenUri,
} from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import {
  IIndexerConfigProviderType,
  IIndexerConfigProvider,
} from "@indexers/IIndexerConfigProvider.js";

export class GnosisIndexer
  implements IEVMAccountBalanceRepository, IEVMTransactionRepository
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
    console.log("Gnosis chainId: ", chainId);
    console.log("Gnosis accountAddress: ", accountAddress);
    const url = `https://api.gnosisscan.io/api?module=account&action=balance&address=${accountAddress}&tag=latest&apikey=J7G8U27J1Y9F88E1E56CNNG2K3H98GF4XE`;
    return ResultUtils.combine([
      this.ajaxUtils.get<IGnosisscanBlockNumberResponse>(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        new URL(url!),
      ),
    ]).map(([tokenResponse]) => {
      console.log("Gnosis tokenResponse: ", tokenResponse);

      const tokenBalances: TokenBalance[] = [];
      const chainInfo = getChainInfoByChainId(chainId);
      tokenBalances.push(
        new TokenBalance(
          EChainTechnology.EVM,
          TickerSymbol(chainInfo.nativeCurrency.symbol),
          chainId,
          EVMContractAddress("0x6810e776880c02933d47db1b9fc05908e5386b96"),
          accountAddress,
          tokenResponse.result,
          chainInfo.nativeCurrency.decimals,
        ),
      );
      console.log("Gnosis tokenBalances: ", tokenBalances);
      return tokenBalances;
    });
  }

  public getEVMTransactions(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError> {
    return okAsync([]);

    // return ResultUtils.combine([
    //   this._getBlockNumber(chainId, startTime),
    //   this._getBlockNumber(chainId, endTime),
    // ]).andThen(([fromBlock, toBlock]) => {
    //   return ResultUtils.combine([
    //     this._getERC20Transactions(chainId, accountAddress, fromBlock, toBlock),
    //     this._getNFTTransactions(
    //       chainId,
    //       accountAddress,
    //       "tokennfttx",
    //       EPolygonTransactionType.ERC721,
    //       fromBlock,
    //       toBlock,
    //     ),
    //     this._getNFTTransactions(
    //       chainId,
    //       accountAddress,
    //       "token1155tx",
    //       EPolygonTransactionType.ERC1155,
    //       fromBlock,
    //       toBlock,
    //     ),
    //   ]).map(([erc20, erc721, erc1155]) => {
    //     return [...erc20, ...erc721, ...erc1155];
    //   });
    // });
  }


  // private generateQueryConfig(
  //   chainId: ChainId,
  //   accountAddress: EVMAccountAddress,
  //   endpoint: string,
  //   cursor?: string,
  //   contracts?: EVMContractAddress[],
  // ): ResultAsync<IRequestConfig, never> {
  //   return okAsync()
  //   const params = {
  //     format: "decimal",
  //     chain: `0x${chainId.toString(16)}`,
  //   };
  //   if (contracts != undefined) {
  //     params["token_addresses"] = contracts.toString();
  //   }
  //   if (cursor != undefined) {
  //     params["cursor"] = cursor;
  //   }

  //   const url = urlJoinP(
  //     "https://deep-index.moralis.io",
  //     ["api", "v2", accountAddress.toString(), endpoint],
  //     params,
  //   );
  //   console.log("Gnosis URL: ", url);

  //   return this.configProvider.getConfig().map((config) => {
  //     const result: IRequestConfig = {
  //       method: "get",
  //       url: url,
  //       headers: {
  //         accept: "application/json",
  //         "X-API-Key": "J7G8U27J1Y9F88E1E56CNNG2K3H98GF4XE",
  //       },
  //     };
  //     console.log("result: ", result);
  //     return result;
  //   });
  // }

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<EVMNFT[], AccountIndexingError> {
    return okAsync([]);
    // return this.generateQueryConfig(chainId, accountAddress, "nft")
    //   .andThen((requestConfig) => {
    //     return this.ajaxUtils
    //       .get<IMoralisNFTResponse>(
    //         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //         new URL(requestConfig.url!),
    //         requestConfig,
    //       )
    //       .andThen((result) => {
    //         return this.getPages(chainId, accountAddress, result);
    //       });
    //   })
    //   .mapErr(
    //     (e) => new AccountIndexingError("error fetching nfts from moralis", e),
    //   );
  }

  private getPages(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    response: IMoralisNFTResponse,
  ): ResultAsync<EVMNFT[], AjaxError> {
    return okAsync([]);
    // const items: EVMNFT[] = response.result.map((token) => {
    //   return new EVMNFT(
    //     EVMContractAddress(token.token_address),
    //     BigNumberString(token.token_id),
    //     token.contract_type,
    //     EVMAccountAddress(token.owner_of),
    //     TokenUri(token.token_uri),
    //     { raw: token.metadata },
    //     BigNumberString(token.amount),
    //     token.name,
    //     chainId,
    //   );
    // });

    // if (response.cursor == null || response.cursor == "") {
    //   return okAsync(items);
    // }

    // return this.generateQueryConfig(
    //   chainId,
    //   accountAddress,
    //   "nft",
    //   response.cursor,
    // ).andThen((requestConfig) => {
    //   return (
    //     this.ajaxUtils
    //       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //       .get<IMoralisNFTResponse>(new URL(requestConfig.url!), requestConfig)
    //       .andThen((next) => {
    //         return this.getPages(chainId, accountAddress, next).andThen(
    //           (nftArr) => {
    //             return okAsync(nftArr.concat(items));
    //           },
    //         );
    //       })
    //   );
    // });
  }

 

  private _getNFTTransactions(
    chain: ChainId,
    address: EVMAccountAddress,
    action: string,
    type: EPolygonTransactionType,
    fromBlock: number,
    toBlock: number,
  ): ResultAsync<PolygonTransaction[], AccountIndexingError> {
    return okAsync([]);

    console.log("inside gnosis _getNFTTransactions");

    // return ResultUtils.combine([
    //   this.configProvider.getConfig(),
    //   this._getEtherscanApiKey(chain),
    // ])
    //   .andThen(([config, apiKey]) => {
    //     console.log("apiKey: ", apiKey);
    //     const params = {
    //       module: "account",
    //       action: action,
    //       address: address,
    //       startblock: fromBlock + 1, // start is inclusive. this occasionally fails when we are fully caught up but the poller eats the error.
    //       page: 1,
    //       offset: 100,
    //       sort: "asc",
    //       apikey: apiKey,
    //     };

    //     if (toBlock > 0) {
    //       params["endblock"] = toBlock;
    //     }

    //     return this._getTransactions(
    //       chain,
    //       params,
    //       config.etherscanTransactionsBatchSize,
    //     ).map((rawTxs) => {
    //       return rawTxs.map((tx) => {
    //         return new PolygonTransaction(
    //           chain,
    //           EVMTransactionHash(tx.hash),
    //           UnixTimestamp(Number.parseInt(tx.timeStamp)),
    //           tx.blockNumber == "" ? null : Number.parseInt(tx.blockNumber),
    //           tx.to == "" ? null : EVMAccountAddress(tx.to),
    //           tx.from == "" ? null : EVMAccountAddress(tx.from),
    //           // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //           null,
    //           tx.gasPrice == "" ? null : BigNumberString(tx.gasPrice),
    //           tx.contractAddress == ""
    //             ? null
    //             : EVMContractAddress(tx.contractAddress),
    //           // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //           tx.tokenID == "" ? null : tx.tokenID!,
    //           type,
    //         );
    //       });
    //     });
    //   })
    //   .orElse((e) => {
    //     return okAsync([]);
    //   });
  }

  private _getERC20Transactions(
    chain: ChainId,
    address: EVMAccountAddress,
    fromBlock: number,
    toBlock: number,
  ): ResultAsync<PolygonTransaction[], AccountIndexingError> {
    return okAsync([]);

    // console.log("inside gnosis _getERC20Transactions");

    // return ResultUtils.combine([
    //   this.configProvider.getConfig(),
    //   this._getEtherscanApiKey(chain),
    // ]).andThen(([config, apiKey]) => {
    //   const params = {
    //     module: "account",
    //     action: "tokentx",
    //     address: address,
    //     startblock: fromBlock + 1, // start is inclusive. this occasionally fails when we are fully caught up but the poller eats the error.
    //     page: 1,
    //     offset: 100,
    //     sort: "asc",
    //     apikey: apiKey,
    //   };

    //   if (toBlock > 0) {
    //     params["endblock"] = toBlock;
    //   }

    //   return this._getTransactions(
    //     chain,
    //     params,
    //     config.etherscanTransactionsBatchSize,
    //   ).map((rawTxs) => {
    //     return rawTxs.map((tx) => {
    //       return new PolygonTransaction(
    //         chain,
    //         EVMTransactionHash(tx.hash),
    //         UnixTimestamp(Number.parseInt(tx.timeStamp)),
    //         tx.blockNumber == "" ? null : Number.parseInt(tx.blockNumber),
    //         tx.to == "" ? null : EVMAccountAddress(tx.to),
    //         tx.from == "" ? null : EVMAccountAddress(tx.from),
    //         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //         tx.value == "" ? null : BigNumberString(tx.value!),
    //         tx.gasPrice == "" ? null : BigNumberString(tx.gasPrice),
    //         tx.contractAddress == ""
    //           ? null
    //           : EVMContractAddress(tx.contractAddress),
    //         null,
    //         EPolygonTransactionType.ERC20,
    //       );
    //     });
    //   });
    // });
  }

  private _getBlockNumber(
    chain: ChainId,
    timestamp: Date | undefined,
  ): ResultAsync<number, AccountIndexingError> {
    return okAsync(0);
    // console.log("inside gnosis _getBlockNumber");
    // if (timestamp == undefined) {
    //   return okAsync(-1);
    // }

    // console.log("Before combine: ");
    // return ResultUtils.combine([
    //   getEtherscanBaseURLForChain(chain),
    //   this._getEtherscanApiKey(chain),
    // ]).andThen(([baseUrl, apiKey]) => {
    //   console.log("baseUrl: ", baseUrl);
    //   console.log("apiKey: ", apiKey);
    //   const url = new URL(
    //     urlJoinP(baseUrl, ["api"], {
    //       module: "block",
    //       action: "getblocknobytime",
    //       timestamp: (timestamp.getTime() / 1000).toFixed(0),
    //       closest: "before",
    //       apikey: apiKey,
    //     }),
    //   );
    //   console.log("Gnosis Url: ", url);
    //   return this.ajaxUtils
    //     .get<IPolygonBlockNumberResponse>(url)
    //     .andThen((resp) => {
    //       console.log("Gnosis Response: ", resp);
    //       if (resp.status != "1") {
    //         // this is a bit noisy
    //         // this.logUtils.warning(
    //         //   "error fetching block number for timestamp from etherscan",
    //         //   resp.status,
    //         //   resp.message,
    //         // );
    //         return okAsync(0);
    //       }
    //       return okAsync(Number.parseInt(resp.result));
    //     })
    //     .mapErr(
    //       (e) => new AccountIndexingError("error loading block number", e),
    //     );
    // });
  }

  protected _getTransactions<T>(
    chain: ChainId,
    params: IPolygonscanRequestParameters,
    maxRecords: number,
  ): ResultAsync<IPolygonscanRawTx[], AccountIndexingError> {
    return okAsync([]);

    // console.log("inside gnosis _getTransactions");

    // return getEtherscanBaseURLForChain(chain)
    //   .map((baseUrl) => {
    //     console.log("Gnosis base url: ", baseUrl);
    //     const offset = params.offset;
    //     const page = params.page;
    //     console.log("Gnosis offset: ", offset);
    //     console.log("Gnosis page: ", page);

    //     if (offset * page > maxRecords) {
    //       return undefined;
    //     }

    //     return new URL(urlJoinP(baseUrl, ["api"], params));
    //   })
    //   .andThen((url) => {
    //     console.log("Gnosis urlJoinP: ", url);
    //     if (url == undefined) {
    //       return okAsync([]);
    //     }

    //     return this.ajaxUtils
    //       .get<IPolygonscanTransactionResponse>(url)
    //       .andThen((response) => {
    //         console.log(
    //           "Gnosis IPolygonscanTransactionResponse response: ",
    //           response,
    //         );

    //         if (response.status != "1") {
    //           // polygonscan error behavior is super inconsistent
    //           if (
    //             response.result != null ||
    //             response.message == "No transactions found"
    //           ) {
    //             return okAsync([]);
    //           }

    //           return errAsync(
    //             new AccountIndexingError(
    //               "error fetching transactions from etherscan",
    //               response.message,
    //             ),
    //           );
    //         }

    //         params.page += 1;
    //         return this._getTransactions(chain, params, maxRecords).map(
    //           (otherTxs) => {
    //             return [...response.result, ...otherTxs];
    //           },
    //         );
    //       })
    //       .mapErr(
    //         (e) => new AccountIndexingError("error fetching transactions", e),
    //       );
    //   });
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

interface IPolygonscanRequestParameters {
  module: string;
  action: string;
  address: EVMAccountAddress;
  page: number;
  offset: number;
  apikey: string;
}

interface IPolygonscanTransactionResponse {
  status: string;
  message: string;
  result: IPolygonscanRawTx[];
}

interface IPolygonscanRawTx {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value?: string;
  gas: string;
  gasPrice: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  tokenID?: BigNumberString;
}

interface IPolygonBlockNumberResponse {
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
