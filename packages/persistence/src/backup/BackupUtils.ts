import { ObjectUtils } from "@snickerdoodlelabs/common-utils";
import { ICryptoUtils, ICryptoUtilsType } from "@snickerdoodlelabs/node-utils";
import {
  DataWalletBackupID,
  AESEncryptedString,
  VolatileDataUpdate,
  FieldDataUpdate,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IBackupUtils } from "@persistence/backup/IBackupUtils.js";

@injectable()
export class BackupUtils implements IBackupUtils {
  public constructor(
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
  ) {}

  public getBackupHash(
    blob: VolatileDataUpdate[] | FieldDataUpdate | AESEncryptedString,
  ): ResultAsync<DataWalletBackupID, never> {
    return this.cryptoUtils
      .hashStringSHA256(ObjectUtils.serialize(blob))
      .map((hash) => {
        return DataWalletBackupID(
          hash.toString().replace(new RegExp("/", "g"), "-"),
        );
      });
  }
}
