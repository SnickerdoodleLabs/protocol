import {
  EChain,
  EDataProvider,
  EVMTransaction,
} from "@snickerdoodlelabs/objects";

export interface IEVMTransactionValidator {
  validate(
    transaction: EVMTransaction,
    indexerName: EDataProvider,
    chain: EChain,
  ): boolean;
}

export const IEVMTransactionValidatorType = Symbol.for(
  "IEVMTransactionValidator",
);
