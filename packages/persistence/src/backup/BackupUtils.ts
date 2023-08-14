import {
  ICryptoUtils,
  ICryptoUtilsType,
  ObjectUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  DataWalletBackup,
  EVMAccountAddress,
  Signature,
  EVMPrivateKey,
  DataWalletBackupID,
  AESEncryptedString,
  VolatileDataUpdate,
  FieldDataUpdate,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IBackupUtils } from "@persistence/backup/IBackupUtils.js";

@injectable()
export class BackupUtils implements IBackupUtils {
  public constructor(
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
  ) {}

  public encryptBlob(
    blob: VolatileDataUpdate[] | FieldDataUpdate,
    privateKey: EVMPrivateKey | null,
  ): ResultAsync<
    VolatileDataUpdate[] | FieldDataUpdate | AESEncryptedString,
    never
  > {
    if (privateKey == null) {
      return okAsync(blob);
    }

    return this.cryptoUtils
      .deriveAESKeyFromEVMPrivateKey(privateKey)
      .andThen((aesKey) => {
        return this.cryptoUtils.encryptString(
          ObjectUtils.serialize(blob),
          aesKey,
        );
      });
  }

  public verifyBackupSignature(
    backup: DataWalletBackup,
    accountAddr: EVMAccountAddress,
  ): ResultAsync<boolean, never> {
    return this.getBackupHash(backup.blob).andThen((hash) => {
      return this.cryptoUtils
        .verifyEVMSignature(
          this._generateBackupSignatureMessage(hash, backup.header.timestamp),
          Signature(backup.header.signature),
        )
        .map((addr) => {
          return addr == EVMAccountAddress(accountAddr);
        });
    });
  }

  public generateBackupSignature(
    hash: DataWalletBackupID,
    timestamp: number,
    privateKey: EVMPrivateKey,
  ): ResultAsync<Signature, never> {
    return this.cryptoUtils.signMessage(
      this._generateBackupSignatureMessage(hash, timestamp),
      privateKey,
    );
  }

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

  private _generateBackupSignatureMessage(
    hash: DataWalletBackupID,
    timestamp: number,
  ): string {
    return ObjectUtils.serialize({
      hash: hash,
      timestamp: timestamp,
    });
  }
}
