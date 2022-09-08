import { ICryptoUtils } from "@snickerdoodlelabs/common-utils";
import {
  AESEncryptedString,
  BackupBlob,
  DataWalletAddress,
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

import { IVolatileStorageTable } from "@persistence/volatile/index.js";

export class BackupManager {
  private fieldUpdates: FieldMap = {};
  private tableUpdates: TableMap = {};
  private numUpdates = 0;
  private accountAddr: DataWalletAddress;

  private fieldHistory: Map<string, number> = new Map();

  public constructor(
    public privateKey: EVMPrivateKey,
    protected tableNames: string[],
    protected volatile: IVolatileStorageTable,
    protected cryptoUtils: ICryptoUtils,
    protected persistent: IStorageUtils,
  ) {
    this.accountAddr = DataWalletAddress(
      cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey),
    );
    this.clear();
  }

  public clear(): void {
    this.tableUpdates = {};
    this.fieldUpdates = {};
    this.numUpdates = 0;
    this.tableNames.forEach((tableName) => (this.tableUpdates[tableName] = []));
  }

  public addRecord(
    tableName: string,
    value: object,
  ): ResultAsync<void, PersistenceError> {
    this.tableUpdates[tableName].push(value);
    this.numUpdates += 1;
    return this.volatile.putObject(tableName, value);
  }

  public updateField(
    key: string,
    value: object,
  ): ResultAsync<void, PersistenceError> {
    const timestamp = new Date().getTime();
    this.fieldUpdates[key] = [value, timestamp];
    this.numUpdates += 1;
    this._updateFieldHistory(key, timestamp);
    return this.persistent.write(key, value);
  }

  public getNumUpdates(): ResultAsync<number, never> {
    return okAsync(this.numUpdates);
  }

  public dump(): ResultAsync<IDataWalletBackup, PersistenceError> {
    return this._generateBlob().andThen((blob) => {
      return this._getContentHash(blob).andThen((hash) => {
        const timestamp = new Date().getTime();
        return this._generateBackupSignature(hash, timestamp).andThen((sig) => {
          const backup: IDataWalletBackup = {
            header: {
              hash: hash,
              timestamp: UnixTimestamp(timestamp),
              signature: sig,
              accountAddress: this.accountAddr,
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
                    return this.persistent.write(fieldName, value);
                  }
                } else {
                  this.fieldHistory[fieldName] = timestamp;
                  return this.persistent.write(fieldName, value);
                }
              }

              return okAsync(undefined);
            }),
          ).andThen((_) => {
            return ResultUtils.combine(
              Object.keys(unpacked.records).map((tableName) => {
                const table = unpacked.records[tableName];
                return ResultUtils.combine(
                  table.map((value) => {
                    // TODO: figure out how to dedup records from chunk here
                    return this.volatile.putObject(tableName, value);
                  }),
                );
              }),
            );
          });
        })
        .map((_) => undefined);
    });
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
    return this.cryptoUtils
      .verifySignature(
        this._generateSignatureMessage(
          backup.header.hash,
          backup.header.timestamp,
        ),
        Signature(backup.header.signature),
      )
      .andThen((addr) =>
        okAsync(
          EVMAccountAddress(backup.header.accountAddress) == addr &&
            addr == EVMAccountAddress(this.accountAddr),
        ),
      );
  }

  private _generateBlob(): ResultAsync<AESEncryptedString, PersistenceError> {
    const rawBlob = JSON.stringify(
      new BackupBlob(this.fieldUpdates, this.tableUpdates),
    );

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
    return this.cryptoUtils.hashStringArgon2(JSON.stringify(blob));
  }

  private _updateFieldHistory(field: string, timestamp: number): void {
    if (!(field in this.fieldHistory) || this.fieldHistory[field] < timestamp) {
      this.fieldHistory[field] = timestamp;
    }
  }
}
