import { ResultAsync } from "neverthrow";

import { IBackupManager } from "@persistence/backup/IBackupManager.js";

export interface IBackupManagerProvider {
  getBackupManager(): ResultAsync<IBackupManager, never>;
}

export const IBackupManagerProviderType = Symbol.for("IBackupManagerProvider");
