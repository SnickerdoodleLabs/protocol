import {
  PersistenceError,
  DataWalletBackup,
  FieldDataUpdate,
  VolatileDataUpdate,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IChunkRenderer {
  checkInterval(): ResultAsync<DataWalletBackup | null, PersistenceError>;
  clear(): ResultAsync<DataWalletBackup | null, PersistenceError>;
  update(
    update: FieldDataUpdate | VolatileDataUpdate,
  ): ResultAsync<DataWalletBackup | null, PersistenceError>;
}
