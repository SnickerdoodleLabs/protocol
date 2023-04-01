import { Metaplex } from "@metaplex-foundation/js";
import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountIndexingError,
  AjaxError,
  ChainId,
  EVMAccountAddress,
  EVMTransaction,
  IEVMAccountBalanceRepository,
  IEVMTransactionRepository,
  TokenBalance,
  TickerSymbol,
  BigNumberString,
  EChainTechnology,
  EVMContractAddress,
  ITokenPriceRepositoryType,
  ITokenPriceRepository,
  EVMTransactionHash,
  UnixTimestamp,
  getChainInfoByChainId,
  getEtherscanBaseURLForChain,
  chainConfig,
} from "@snickerdoodlelabs/objects";
import { Connection } from "@solana/web3.js";
import { ethers } from "ethers";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/interfaces/IIndexerConfigProvider.js";

export class ZettablockIndexer implements IEVMAccountBalanceRepository {
  private _connections?: ResultAsync<ZettablockClients, never>;

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
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    // return this.configProvider.getConfig().andThen((config) => {
    //   const chain = chainConfig.get(chainId)!;
    //   // const values = config.zettablockApis.values();
    //   return this.ajaxUtils
    //     .get(config.zettablockApis.ethereum_mainnet.balances.native)
    //     .andThen((balance) => {

    //     });
    // });
    return okAsync([]);
  }
}

interface IEtherscanBlockNumberResponse {
  status: string;
  message: string;
  result: BigNumberString;
}

interface ZettablockClients {
  mainnet: [Connection, Metaplex];
  testnet: [Connection, Metaplex];
}
