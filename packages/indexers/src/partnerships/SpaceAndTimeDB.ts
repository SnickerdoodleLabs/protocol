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
  isAccountValidForChain,
  chainConfig,
} from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";
import { inject } from "inversify";
import mysql, { Connection } from "mysql2";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

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
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.getConnection(),
    ])
      .map(async ([config, connection]) => {
        return ResultUtils.combine([
          this.getNonNativeBalances(
            config,
            connection,
            chainId,
            accountAddress,
          ),
          this.getNativeBalance(config, connection, chainId, accountAddress),
        ]).map(([nonNativeBalances, nativeBalance]) => {
          return [nativeBalance, ...nonNativeBalances];
        });
      })
      .andThen((balances) => {
        return balances;
      });
  }

  protected getNativeBalance(
    config: IIndexerConfig,
    connection: mysql.Connection,
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance, AccountIndexingError | AjaxError> {
    // return ResultUtils.combine([
    //   this.configProvider.getConfig(),
    //   this.getConnection(),
    // ]).map(async ([config, connection]) => {
    //   const chain = chainConfig.get(chainId)!;
    //   // const connect = connection.connect.bind(connection);
    //   // await connect();

    //   // const balance = await new Promise((resolve, reject) => {
    //   //   connection.query(
    //   //     `SELECT SUM(VALUE) FROM ${chain.name}.ERC20_APPROVAL WHERE CONTRACT_ADDRESS = ${accountAddress}`,
    //   //     // (err, res) => {
    //   //     //   if (err != null) {
    //   //     //     reject(err);
    //   //     //   }
    //   //     //   resolve(res);
    //   //     // },
    //   //   );
    //   // });
    //   const balance = "1";

    //   const nativeBalance = new TokenBalance(
    //     EChainTechnology.EVM,
    //     TickerSymbol("SOL"),
    //     chainId,
    //     null,
    //     accountAddress,
    //     BigNumberString(BigNumber.from(balance).toString()),
    //     getChainInfoByChainId(chainId).nativeCurrency.decimals,
    //   );
    //   return okAsync(nativeBalance);
    // });

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
    // const chain = chainConfig.get(chainId)!;
    // const connect = connection.connect.bind(connection);
    // // await connect();
    // /* TODO */
    // const balance = await new Promise((resolve, reject) => {
    //   connection.query(
    //     `SELECT SUM(VALUE) FROM ${chain.name}.ERC20_APPROVAL WHERE CONTRACT_ADDRESS = ${accountAddress}`,
    //     (err, res) => {
    //       if (err != null) {
    //         reject(err);
    //       }
    //       resolve(res);
    //     },
    //   );
    // });

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
