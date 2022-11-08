import { EVMPrivateKey, PersistenceError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IBackupManager } from "@persistence/backup/IBackupManager.js";

export interface IBackupManagerProvider {
  unlock(derivedKey: EVMPrivateKey): ResultAsync<void, never>;
  getBackupManager(): ResultAsync<IBackupManager, PersistenceError>;
}

export const IBackupManagerProviderType = Symbol.for("IBackupManagerProvider");
