import { ICryptoUtils } from "@snickerdoodlelabs/common-utils";
import {
  AESEncryptedString,
  BackupBlob,
  DataWalletAddress,
  DataWalletBackupID,
  EVMAccountAddress,
  EVMPrivateKey,
  FieldMap,
  IDataWalletBackup,
  PersistenceError,
  Signature,
  TableMap,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { IStorageUtils } from "@snickerdoodlelabs/utils";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IBackupManager } from "@persistence/backup/IBackupManager.js";
import { IVolatileStorage } from "@persistence/volatile/index.js";

export class BackupManager implements IBackupManager {
  private fieldUpdates: FieldMap = {};
  private tableUpdates: TableMap = {};
  private numUpdates = 0;
  private accountAddr: DataWalletAddress;

  private fieldHistory: Map<string, number> = new Map();
  private chunkQueue: Array<IDataWalletBackup> = [];

  private restored: Set<DataWalletBackupID> = new Set();

  public constructor(
    protected privateKey: EVMPrivateKey,
    protected tableNames: string[],
    protected volatileStorage: IVolatileStorage,
    protected cryptoUtils: ICryptoUtils,
    protected storageUtils: IStorageUtils,
    public maxChunkSize: number,
  ) {
    this.accountAddr = DataWalletAddress(
      cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey),
    );
    this.clear();
  }

  public getRestored(): ResultAsync<Set<DataWalletBackupID>, PersistenceError> {
    return okAsync(this.restored);
  }

  public clear(): ResultAsync<void, never> {
    this.tableUpdates = {};
    this.fieldUpdates = {};
    this.numUpdates = 0;
    this.tableNames.forEach((tableName) => (this.tableUpdates[tableName] = []));
    return okAsync(undefined);
  }

  public popBackup(): ResultAsync<
    IDataWalletBackup | undefined,
    PersistenceError
  > {
    // console.log("pop", this.numUpdates, this.tableUpdates, this.fieldUpdates);

    if (this.chunkQueue.length == 0) {
      if (this.numUpdates == 0) {
        return okAsync(undefined);
      }

      return this.dump().andThen((backup) => {
        this.restored.add(DataWalletBackupID(backup.header.hash));
        return this.clear().map(() => backup);
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const backup = this.chunkQueue.pop()!;
    this.restored.add(DataWalletBackupID(backup.header.hash));
    return okAsync(backup);
  }

  public addRecord(
    tableName: string,
    value: object,
  ): ResultAsync<void, PersistenceError> {
    // this allows us to bypass transactions
    if (!this.tableUpdates.hasOwnProperty(tableName)) {
      return this.volatileStorage.putObject(tableName, value);
    }

    this.tableUpdates[tableName].push(value);
    this.numUpdates += 1;
    return this.volatileStorage
      .putObject(tableName, value)
      .andThen(() => this._checkSize());
  }

  public updateField(
    key: string,
    value: object,
  ): ResultAsync<void, PersistenceError> {
    if (!(key in this.fieldUpdates)) {
      this.numUpdates += 1;
    }

    const timestamp = new Date().getTime();
    this.fieldUpdates[key] = [value, timestamp];
    this._updateFieldHistory(key, timestamp);
    return this.storageUtils.write(key, value).andThen(() => this._checkSize());
  }

  private dump(): ResultAsync<IDataWalletBackup, PersistenceError> {
    return this._generateBlob().andThen((blob) => {
      return this._getContentHash(blob).andThen((hash) => {
        const timestamp = new Date().getTime();
        return this._generateBackupSignature(hash, timestamp).andThen((sig) => {
          const backup: IDataWalletBackup = {
            header: {
              hash: hash,
              timestamp: UnixTimestamp(timestamp),
              signature: sig,
            },
            blob: blob,
          };

          return okAsync(backup);
        });
      });
    });
  }

  public restore(
    backup: IDataWalletBackup,
  ): ResultAsync<void, PersistenceError> {
    return this._verifyBackupSignature(backup).andThen((valid) => {
      if (!valid) {
        return errAsync(new PersistenceError("invalid backup signature"));
      }

      return this._unpackBlob(backup.blob)
        .andThen((unpacked) => {
          return ResultUtils.combine(
            Object.keys(unpacked.fields).map((fieldName) => {
              const [value, timestamp] = unpacked.fields[fieldName];
              if (
                !(fieldName in this.fieldHistory) ||
                timestamp > this.fieldHistory[fieldName]
              ) {
                if (this.fieldUpdates.hasOwnProperty(fieldName)) {
                  if (timestamp > this.fieldUpdates[fieldName][1]) {
                    this.fieldHistory[fieldName] = timestamp;
                    delete this.fieldUpdates[fieldName];
                    return this.storageUtils.write(fieldName, value);
                  }
                } else {
                  this.fieldHistory[fieldName] = timestamp;
                  return this.storageUtils.write(fieldName, value);
                }
              }

              return okAsync(undefined);
            }),
          ).andThen(() => {
            return ResultUtils.combine(
              Object.keys(unpacked.records).map((tableName) => {
                const table = unpacked.records[tableName];
                return ResultUtils.combine(
                  table.map((value) => {
                    return this.volatileStorage.putObject(tableName, value);
                  }),
                );
              }),
            );
          });
        })
        .map(() => {
          this.restored.add(DataWalletBackupID(backup.header.hash));
        });
    });
  }

  private _checkSize(): ResultAsync<void, PersistenceError> {
    if (this.numUpdates >= this.maxChunkSize) {
      return this.dump().andThen((backup) => {
        this.chunkQueue.push(backup);
        return this.clear();
      });
    }

    return okAsync(undefined);
  }

  private _unpackBlob(
    blob: AESEncryptedString,
  ): ResultAsync<BackupBlob, PersistenceError> {
    return this.cryptoUtils
      .deriveAESKeyFromEVMPrivateKey(this.privateKey)
      .andThen((aesKey) => {
        return this.cryptoUtils.decryptAESEncryptedString(blob, aesKey);
      })
      .map((unencrypted) => {
        return JSON.parse(unencrypted) as BackupBlob;
      });
  }

  private _generateBackupSignature(
    hash: string,
    timestamp: number,
  ): ResultAsync<Signature, never> {
    return this.cryptoUtils.signMessage(
      this._generateSignatureMessage(hash, timestamp),
      this.privateKey,
    );
  }

  private _verifyBackupSignature(
    backup: IDataWalletBackup,
  ): ResultAsync<boolean, PersistenceError> {
    return this._getContentHash(backup.blob).andThen((hash) => {
      return this.cryptoUtils
        .verifyEVMSignature(
          this._generateSignatureMessage(hash, backup.header.timestamp),
          Signature(backup.header.signature),
        )
        .andThen((addr) =>
          okAsync(addr == EVMAccountAddress(this.accountAddr)),
        );
    });
  }

  private _generateBlob(): ResultAsync<AESEncryptedString, PersistenceError> {
    const rawBlob = JSON.stringify(
      new BackupBlob(this.fieldUpdates, this.tableUpdates),
    );

    console.log("rawBlob: ", rawBlob);

    return this.cryptoUtils
      .deriveAESKeyFromEVMPrivateKey(this.privateKey)
      .andThen((aesKey) => {
        return this.cryptoUtils.encryptString(rawBlob, aesKey);
      });
  }

  private _generateSignatureMessage(hash: string, timestamp: number): string {
    return JSON.stringify({
      hash: hash,
      timestamp: timestamp,
    });
  }

  private _getContentHash(
    blob: AESEncryptedString,
  ): ResultAsync<string, PersistenceError> {
    return this.cryptoUtils
      .hashStringSHA256(JSON.stringify(blob))
      .map((hash) => {
        return hash.replace("/", "-");
      });
  }

  private _updateFieldHistory(field: string, timestamp: number): void {
    if (!(field in this.fieldHistory) || this.fieldHistory[field] < timestamp) {
      this.fieldHistory[field] = timestamp;
    }
  }
}
