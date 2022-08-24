import {
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  AESEncryptedString,
  DataWalletAddress,
  EVMAccountAddress,
  EVMPrivateKey,
  PersistenceError,
  Signature,
} from "@snickerdoodlelabs/objects";
import { IStorageUtils, IStorageUtilsType } from "@snickerdoodlelabs/utils";
import { inject, injectable } from "inversify";
import * as Hash from "ipfs-only-hash";
import { compress, decompress } from "lz-string";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IVolatileStorageTable } from "@persistence/volatile/";

export interface IDataWalletBackupHeader {
  hash: string;
  timestamp: number;
  signature: string;
  accountAddress: string; // not sure if we should include this
}

export interface IDataWalletBackup {
  header: IDataWalletBackupHeader;
  blob: AESEncryptedString;
}

export type FieldMap = { [key: string]: [object, number] };
export type TableMap = { [key: string]: { [key: string]: object } };

export class BackupBlob {
  public constructor(public fields: FieldMap, public records: TableMap) {}
}

export class BackupManager {
  private fieldUpdates: FieldMap = {};
  private tableUpdates: TableMap = {};
  private numUpdates = 0;
  private accountAddr: DataWalletAddress;

  private restored: Set<string> = new Set();
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
    this._clear();
  }

  private _clear(): void {
    this.tableUpdates = {};
    this.fieldUpdates = {};
    this.numUpdates = 0;
    this.tableNames.forEach((tableName) => (this.tableUpdates[tableName] = {}));
  }

  public addRecord(
    tableName: string,
    key: string,
    value: object,
  ): ResultAsync<void, PersistenceError> {
    this.tableUpdates[tableName][key] = value;
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
              timestamp: timestamp,
              signature: sig,
              accountAddress: this.accountAddr,
            },
            blob: blob,
          };

          this._clear();
          this.restored.add(backup.header.hash);
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

      if (backup.header.hash in this.restored) {
        return errAsync(new PersistenceError("backup already restored"));
      }

      return this._unpackBlob(backup.blob)
        .andThen((unpacked) => {
          return ResultUtils.combine(
            Object.keys(unpacked.fields).map((fieldName) => {
              const [value, timestamp] = unpacked.fields[fieldName];
              if (timestamp > this.fieldHistory[fieldName]) {
                if (this.fieldUpdates.hasOwnProperty(fieldName)) {
                  if (timestamp > this.fieldUpdates[fieldName][1]) {
                    this.persistent.write(fieldName, value);
                    this.fieldHistory[fieldName] = timestamp;
                    delete this.fieldUpdates[fieldName];
                  }
                } else {
                  this.persistent.write(fieldName, value);
                  this.fieldHistory[fieldName] = timestamp;
                }
              }

              return okAsync(undefined);
            }),
          ).andThen((_) => {
            return ResultUtils.combine(
              Object.keys(unpacked.records).map((tableName) => {
                const table = unpacked.records[tableName];
                return ResultUtils.combine(
                  Object.keys(table).map((key) => {
                    const value = table[key];
                    return this.volatile.putObject(key, value);
                  }),
                );
              }),
            );
          });
        })
        .andThen((_) => {
          this.restored.add(backup.header.hash);
          return okAsync(undefined);
        });
    });
  }

  private _unpackBlob(
    blob: AESEncryptedString,
  ): ResultAsync<BackupBlob, PersistenceError> {
    return this.cryptoUtils
      .deriveAESKeyFromEVMPrivateKey(this.privateKey)
      .andThen((aesKey) => {
        return this.cryptoUtils
          .decryptAESEncryptedString(blob, aesKey)
          .andThen((unencrypted) => {
            const decompressed: string = decompress(unencrypted);
            return okAsync(JSON.parse(decompressed) as BackupBlob);
          });
      });
  }

  private _generateBackupSignature(
    hash: string,
    timestamp: number,
  ): ResultAsync<Signature, PersistenceError> {
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
    const compressed = compress(rawBlob);
    return this.cryptoUtils
      .deriveAESKeyFromEVMPrivateKey(this.privateKey)
      .andThen((aesKey) => {
        return this.cryptoUtils.encryptString(compressed, aesKey);
      });
  }

  private _generateSignatureMessage(hash: string, timestamp: number): string {
    return JSON.stringify({
      hash: hash,
      timestamp: timestamp,
    });
  }

  private _getContentHash(blob): ResultAsync<string, PersistenceError> {
    return ResultAsync.fromPromise(
      Hash.of(blob),
      (e) => new PersistenceError("error hashing blob"),
    );
  }

  private _updateFieldHistory(field: string, timestamp: number): void {
    if (!(field in this.fieldHistory) || this.fieldHistory[field] < timestamp) {
      this.fieldHistory[field] = timestamp;
    }
  }
}
