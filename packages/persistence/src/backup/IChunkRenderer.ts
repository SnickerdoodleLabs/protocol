import {
  PersistenceError,
  IDataWalletBackup,
  DataUpdate,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IChunkRenderer {
  clear(): ResultAsync<IDataWalletBackup | null, never>;
  update(
    update: DataUpdate,
  ): ResultAsync<IDataWalletBackup | null, PersistenceError>;
}
