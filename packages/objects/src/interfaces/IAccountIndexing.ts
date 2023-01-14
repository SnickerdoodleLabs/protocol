import { ResultAsync } from "neverthrow";

import {
  IEVMTransactionRepository,
  ISolanaTransactionRepository,
} from "@objects/interfaces/chains";

export interface IAccountIndexing {
  getEVMTransactionRepository(): ResultAsync<IEVMTransactionRepository, never>;
  getEthereumTransactionRepository(): ResultAsync<
    IEVMTransactionRepository,
    never
  >;
  getSimulatorEVMTransactionRepository(): ResultAsync<
    IEVMTransactionRepository,
    never
  >;
  getSolanaTransactionRepository(): ResultAsync<
    ISolanaTransactionRepository,
    never
  >;
  getPolygonTransactionRepository(): ResultAsync<
    IEVMTransactionRepository,
    never
  >;
  getBinanceNFTRepository(): ResultAsync<IEVMTransactionRepository, never>;
}

export const IAccountIndexingType = Symbol.for("IAccountIndexing");
