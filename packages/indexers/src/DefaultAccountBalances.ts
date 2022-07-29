import {
  IAccountBalances,
  IEVMAccountBalanceRepository,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

@injectable()
export class DefaultAccountBalances implements IAccountBalances {
  public getEVMBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  > {
    throw new Error("Method not implemented.");
  }
  public getSimulatorEVMBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  > {
    throw new Error("Method not implemented.");
  }
}
