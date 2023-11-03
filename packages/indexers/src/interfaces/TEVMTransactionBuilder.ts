import {
  ChainId,
  EDataProvider,
  EVMTransaction,
} from "@snickerdoodlelabs/objects";

import { IAnkrTransaction } from "@indexers/providers/AnkrIndexer.js";
import { IEtherscanTransactionResponse } from "@indexers/providers/EtherscanIndexer.js";

export type TEVMTransactionFactory = {
  [K in keyof Omit<
    EVMTransaction,
    | "accountAddresses"
    | "functionSignature"
    | "getVersion"
    | "chain"
    | "measurementDate"
  >]: (value: unknown) => EVMTransaction[K] | null;
} & {
  build(
    indexerResponse: IndexerEvmResponseTypes,
    indexerName: EDataProvider,
    chain: ChainId,
  ): EVMTransaction | null;
};

export type IndexerEvmResponseTypes =
  | IAnkrTransaction
  | IEtherscanTransactionResponse[`result`];

export const TEVMTransactionFactoryType = Symbol.for("TEVMTransactionFactory");
