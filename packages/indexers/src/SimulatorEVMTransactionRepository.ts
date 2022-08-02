import {
  AccountBalanceError,
  AccountIndexingError,
  AccountNFTError,
  AjaxError,
  ChainId,
  EVMAccountAddress,
  EVMTransaction,
  IEVMAccountBalanceRepository,
  IEVMBalance,
  IEVMNFT,
  IEVMNftRepository,
  IEVMTransactionRepository,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export class SimulatorEVMTransactionRepository
  implements
    IEVMTransactionRepository,
    IEVMAccountBalanceRepository,
    IEVMNftRepository
{
  getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<IEVMNFT[], AjaxError | AccountNFTError> {
    throw new Error("Method not implemented.");
  }
  getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<IEVMBalance[], AjaxError | AccountBalanceError> {
    throw new Error("Method not implemented.");
  }
  public getEVMTransactions(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError> {
    throw new Error("Method not implemented.");
  }
}
