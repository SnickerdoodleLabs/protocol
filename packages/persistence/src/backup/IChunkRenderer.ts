import {
  PersistenceError,
  DataWalletBackup,
  DataUpdate,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IChunkRenderer {
  clear(): ResultAsync<DataWalletBackup | null, PersistenceError>;
  update(
    update: DataUpdate,
  ): ResultAsync<DataWalletBackup | null, PersistenceError>;
}
