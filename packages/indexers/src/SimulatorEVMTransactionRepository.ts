import {
  AccountIndexingError,
  AjaxError,
  ChainId,
  EVMAccountAddress,
  EVMTransaction,
  IEVMTransactionRepository,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export class SimulatorEVMTransactionRepository
  implements IEVMTransactionRepository
{
  public getEVMTransactions(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError> {
    throw new Error("Method not implemented.");
  }
}
