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
  BackupBlob,
  EncryptedBackupBlob,
  DataWalletBackupID,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IBackupUtils } from "@persistence/backup/IBackupUtils.js";

@injectable()
export class BackupUtils implements IBackupUtils {
  public constructor(
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
  ) {}

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
    hash: string,
    timestamp: number,
    privateKey: EVMPrivateKey,
  ): ResultAsync<Signature, never> {
    return this.cryptoUtils.signMessage(
      this._generateBackupSignatureMessage(hash, timestamp),
      privateKey,
    );
  }

  public getBackupHash(
    blob: BackupBlob | EncryptedBackupBlob,
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
    hash: string,
    timestamp: number,
  ): string {
    return ObjectUtils.serialize({
      hash: hash,
      timestamp: timestamp,
    });
  }
}
