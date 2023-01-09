import {
    ISolanaBalanceRepository,
    ISolanaTransactionRepository,
    ISolanaNFTRepository,
    AjaxError,
    ChainId,
    SolanaAccountAddress,
    SolanaNFT,
    AccountIndexingError,
    SolanaTransaction,
    TokenBalance,
    IEVMAccountBalanceRepository,
    IEVMNftRepository,
    IEVMTransactionRepository,
    EVMAccountAddress,
    EVMNFT,
    EVMTransaction,
  } from "@snickerdoodlelabs/objects";
  import { okAsync, ResultAsync } from "neverthrow";
  
  export class DummyMoonbeamIndexer implements IEVMAccountBalanceRepository, IEVMNftRepository, IEVMTransactionRepository {
    
    public constructor() {}

    public getBalancesForAccount(
      chainId: ChainId,
      accountAddress: EVMAccountAddress,
    ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
      return okAsync([]);
    }
    public getTokensForAccount(
      chainId: ChainId,
      accountAddress: EVMAccountAddress,
    ): ResultAsync<EVMNFT[],  AccountIndexingError | AjaxError> {
      return okAsync([]);
    }
    public getEVMTransactions(
      chainId: ChainId,
      accountAddress: EVMAccountAddress,
      startTime: Date,
      endTime?: Date | undefined,
    ): ResultAsync<EVMTransaction[], AjaxError | AccountIndexingError> {
      return okAsync([]);
    }
  }
  