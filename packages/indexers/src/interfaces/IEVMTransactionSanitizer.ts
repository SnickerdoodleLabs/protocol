import {
  EChain,
  EDataProvider,
  EVMTransaction,
} from "@snickerdoodlelabs/objects";

export interface IEVMTransactionSanitizer {
  sanitize(
    transaction: EVMTransaction,
    indexerName: EDataProvider,
    chain: EChain,
  ): EVMTransaction | null;
}

export const IEVMTransactionSanitizerType = Symbol.for(
  "IEVMTransactionSanitizer",
);
