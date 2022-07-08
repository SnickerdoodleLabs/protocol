import { ResultAsync } from "neverthrow";

import { IEVMTransactionRepository } from "@objects/interfaces/chains";

export interface IAccountIndexing {
  getEVMTransactionRepository(): ResultAsync<IEVMTransactionRepository, never>;
  //getSolanaRepository(): ResultAsync<ISolanaTransactionRepository, never>;
}

export const IAccountIndexingType = Symbol.for("IAccountIndexing");
