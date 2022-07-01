import {
  AccountIndexingError,
  BlockNumber,
  EVMAccountAddress,
  EVMTransaction,
  IEthereumEVMTransactionRepository,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

@injectable()
export class EtherscanEthereumEVMTransactionRepository
  implements IEthereumEVMTransactionRepository
{
  public constructor() {}

  public getEVMTransactions(
    accountAddress: EVMAccountAddress,
    firstBlock: BlockNumber,
    lastBlock?: BlockNumber | undefined,
  ): ResultAsync<EVMTransaction[], AccountIndexingError> {
    throw new Error("Method not implemented.");
  }
}
