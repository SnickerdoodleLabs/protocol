import {
  IAccountIndexing,
  IAvalancheEVMTransactionRepository,
  IEthereumEVMTransactionRepository,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

import { CovalentEthereumEVMTransactionRepository } from "@browser-extension/CovalentEthereumEVMTransactionRepository";

@injectable()
export class DefaultAccountIndexers implements IAccountIndexing {
  protected avalanche: IAvalancheEVMTransactionRepository;
  protected ethereum: IEthereumEVMTransactionRepository;

  public constructor() {
    this.avalanche = new CovalentAvalancheEVMTransactionRepository();
    this.ethereum = new CovalentAvalancheEVMTransactionRepository(); // as long as chainId is 43114, this will scrape c chain events
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
