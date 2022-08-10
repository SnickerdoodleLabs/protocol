import { EVMTransaction, IEVMBalance } from "@snickerdoodlelabs/objects";

import { EIndexType, IndexKey, SuperKey, TableInfo } from "./db";

export const TransactionsTableInfo = new TableInfo<EVMTransaction>(
  "transactions",
  new SuperKey(["hash"]),
  [
    new IndexKey("timestamp", EIndexType.ORDERED),
    new IndexKey("associatedAccount", EIndexType.GROUPED),
    new IndexKey("chainId", EIndexType.GROUPED),
    new IndexKey("value", EIndexType.ORDERED),
  ],
);
