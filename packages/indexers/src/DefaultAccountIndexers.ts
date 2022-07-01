import {
  IAccountIndexing,
  IAvalancheEVMTransactionRepository,
  IEthereumEVMTransactionRepository,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { EtherscanAvalancheEVMTransactionRepository } from "@indexers/EtherscanAvalancheEVMTransactionRepository";
import { EtherscanEthereumEVMTransactionRepository } from "@indexers/EtherscanEthereumEVMTransactionRepository";

@injectable()
export class DefaultAccountIndexers implements IAccountIndexing {
  protected avalanche: IAvalancheEVMTransactionRepository;
  protected ethereum: IEthereumEVMTransactionRepository;

  public constructor() {
    this.avalanche = new EtherscanAvalancheEVMTransactionRepository();
    this.ethereum = new EtherscanEthereumEVMTransactionRepository();
  }

  public getAvalancheEVMTransactionRepository(): ResultAsync<
    IAvalancheEVMTransactionRepository,
    never
  > {
    throw new Error("Method not implemented.");
  }

  public getEthereumEVMTransactionRepository(): ResultAsync<
    IEthereumEVMTransactionRepository,
    never
  > {
    throw new Error("Method not implemented.");
  }
}
