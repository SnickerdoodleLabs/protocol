import {
  AccountIndexingError,
  BlockNumber,
  EVMAccountAddress,
  EVMTransaction,
  IAvalancheEVMTransactionRepository,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

@injectable()
export class EtherscanAvalancheEVMTransactionRepository
  implements IAvalancheEVMTransactionRepository
{
  public constructor() {}

  public getEthereumTransactions(
    accountAddress: EVMAccountAddress,
    firstBlock: BlockNumber,
    lastBlock?: BlockNumber | undefined,
  ): ResultAsync<EVMTransaction[], AccountIndexingError> {
    throw new Error("Method not implemented.");
  }
}
