import {
  DataWalletBackupID,
  VolatileDataUpdate,
  FieldDataUpdate,
  AESEncryptedString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IBackupUtils {
  getBackupHash(
    blob: VolatileDataUpdate[] | FieldDataUpdate | AESEncryptedString,
  ): ResultAsync<DataWalletBackupID, never>;
}

export const IBackupUtilsType = Symbol.for("IBackupUtils");
