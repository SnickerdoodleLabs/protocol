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
  TokenBalance,
  ITokenPriceRepositoryType,
  ITokenPriceRepository,
  IEVMAccountBalanceRepository,
  EVMAccountAddress,
  EChainTechnology,
  TickerSymbol,
  BigNumberString,
  getChainInfoByChainId,
} from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";
import { inject } from "inversify";
import mysql from "mysql2";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { IIndexerConfig } from "@indexers/interfaces/IIndexerConfig";
import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/interfaces/IIndexerConfigProvider.js";

export class SpaceAndTimeDB implements IEVMAccountBalanceRepository {
  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  protected getConnection(): ResultAsync<mysql.Connection, never> {
    return this.configProvider.getConfig().andThen((config) => {
      console.log("connection parameters: ", {
        host: "localhost",
        user: "andrewstrimatis",
        database: "mysql",
        password: config.sxtEndpoint,
      });
      const connection = mysql.createConnection({
        host: "localhost",
        user: "andrewstrimatis",
        database: "mysql",
        password: "XSR7MtiRo10HxB5WT0eTcYdydoSchyPmp3FKMnIO/c0=",
      });
      this.logUtils.info("connection established: ", connection);
      const connect = connection.connect.bind(connection);
      console.log("connection connect: ", connect);
      connection.execute = connection.query.bind(connection);
      console.log("connection execute: ", connection);
      return okAsync(connection);
    });
  }

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    return okAsync([]);
  }

  protected getNativeBalance(
    config: IIndexerConfig,
    connection: mysql.Connection,
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance, AccountIndexingError | AjaxError> {
    const balance = "1";
    const nativeBalance = new TokenBalance(
      EChainTechnology.EVM,
      TickerSymbol("SOL"),
      chainId,
      null,
      accountAddress,
      BigNumberString(BigNumber.from(balance).toString()),
      getChainInfoByChainId(chainId).nativeCurrency.decimals,
    );
    return okAsync(nativeBalance);
  }

  protected getNonNativeBalances(
    config: IIndexerConfig,
    connection: mysql.Connection,
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    const balance = "1";
    const nativeBalance = new TokenBalance(
      EChainTechnology.EVM,
      TickerSymbol("SOL"),
      chainId,
      null,
      accountAddress,
      BigNumberString(BigNumber.from(balance).toString()),
      getChainInfoByChainId(chainId).nativeCurrency.decimals,
    );
    return okAsync([nativeBalance]);
  }
}
