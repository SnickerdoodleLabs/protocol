import "reflect-metadata";
import { ICryptoUtils, ObjectUtils } from "@snickerdoodlelabs/common-utils";
import {
  EVMPrivateKey,
  UnixTimestamp,
  ERecordKey,
  EBackupPriority,
  VolatileDataUpdate,
  EDataUpdateOpCode,
  DataWalletBackup,
  DataWalletBackupHeader,
  DataWalletBackupID,
  Signature,
  AESKey,
  AESEncryptedString,
  InitializationVector,
  EncryptedString,
  SHA256Hash,
  EVMAccountAddress,
} from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";
import * as td from "testdouble";

import { BackupUtils, IBackupUtils } from "@persistence/backup/index.js";
import { TestVersionedObject } from "@persistence-test/mocks/index.js";

const accountAddress = EVMAccountAddress("Account Address");
const accountAddress2 = EVMAccountAddress("Account Address 2");
const recordKey = ERecordKey.ACCOUNT;
const privateKey = EVMPrivateKey("Private Key");
const aesKey = AESKey("AES Key");
const keyValue = "Key Value";
const now = UnixTimestamp(30);
const dataWalletBackupId = DataWalletBackupID("SHA256-Hash");
const blobHash = SHA256Hash("SHA256/Hash");
const dataWalletBackupSignature = Signature("Data Wallet Backup Signature");
const signatureMessage = ObjectUtils.serialize({
  hash: dataWalletBackupId,
  timestamp: now,
});
const encryptedBlobString = new AESEncryptedString(
  EncryptedString("Encrypted Blob String"),
  InitializationVector("Initialization Vector"),
);

const testRecord = new TestVersionedObject(keyValue, 1);

const volatileDataUpdate = new VolatileDataUpdate(
  EDataUpdateOpCode.UPDATE,
  keyValue,
  now,
  testRecord,
  TestVersionedObject.CURRENT_VERSION,
);

const volatileDataUpdates = [volatileDataUpdate];

const dataWalletBackup = new DataWalletBackup(
  new DataWalletBackupHeader(
    dataWalletBackupId,
    now,
    dataWalletBackupSignature,
    EBackupPriority.NORMAL,
    recordKey,
    false,
  ),
  volatileDataUpdates,
);

class BackupUtilsMocks {
  public cryptoUtils: ICryptoUtils;

  public constructor() {
    this.cryptoUtils = td.object<ICryptoUtils>();

    // CryptoUtils -----------------------------------------------------------
    td.when(
      this.cryptoUtils.deriveAESKeyFromEVMPrivateKey(privateKey),
    ).thenReturn(okAsync(aesKey));

    td.when(
      this.cryptoUtils.encryptString(
        ObjectUtils.serialize(volatileDataUpdates),
        aesKey,
      ),
    ).thenReturn(okAsync(encryptedBlobString));

    td.when(
      this.cryptoUtils.hashStringSHA256(
        ObjectUtils.serialize(volatileDataUpdates),
      ),
    ).thenReturn(okAsync(blobHash));

    td.when(
      this.cryptoUtils.signMessage(
        ObjectUtils.serialize({
          hash: dataWalletBackupId,
          timestamp: now,
        }),
        privateKey,
      ),
    ).thenReturn(okAsync(dataWalletBackupSignature));

    td.when(
      this.cryptoUtils.verifyEVMSignature(
        signatureMessage,
        dataWalletBackupSignature,
      ),
    ).thenReturn(okAsync(accountAddress));
  }

  public factory(): IBackupUtils {
    return new BackupUtils(this.cryptoUtils);
  }
}

describe("BackupUtils Tests", () => {
  test("encryptBlob() returns the input if no encryption key is provided", async () => {
    // Arrange
    const mocks = new BackupUtilsMocks();

    const backupUtils = mocks.factory();

    // Act
    const result = await backupUtils.encryptBlob(volatileDataUpdates, null);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const encryptedBlob = result._unsafeUnwrap();
    expect(encryptedBlob).toBe(volatileDataUpdates);
  });

  test("encryptBlob() returns the AES encrypted value if encryption key is provided", async () => {
    // Arrange
    const mocks = new BackupUtilsMocks();

    const backupUtils = mocks.factory();

    // Act
    const result = await backupUtils.encryptBlob(
      volatileDataUpdates,
      privateKey,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const encryptedBlob = result._unsafeUnwrap();
    expect(encryptedBlob).toBe(encryptedBlobString);
  });

  test("getBackupHash() works", async () => {
    // Arrange
    const mocks = new BackupUtilsMocks();

    const backupUtils = mocks.factory();

    // Act
    const result = await backupUtils.getBackupHash(volatileDataUpdates);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const dataWalletBackupId = result._unsafeUnwrap();
    expect(dataWalletBackupId).toBe(dataWalletBackupId);
  });

  test("generateBackupSignature() works", async () => {
    // Arrange
    const mocks = new BackupUtilsMocks();

    const backupUtils = mocks.factory();

    // Act
    const result = await backupUtils.generateBackupSignature(
      dataWalletBackupId,
      now,
      privateKey,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const signature = result._unsafeUnwrap();
    expect(signature).toBe(dataWalletBackupSignature);
  });

  test("verifyBackupSignature() verifies with matching account", async () => {
    // Arrange
    const mocks = new BackupUtilsMocks();

    const backupUtils = mocks.factory();

    // Act
    const result = await backupUtils.verifyBackupSignature(
      dataWalletBackup,
      accountAddress,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const verified = result._unsafeUnwrap();
    expect(verified).toBeTruthy();
  });

  test("verifyBackupSignature() does not verify with mismatching account", async () => {
    // Arrange
    const mocks = new BackupUtilsMocks();

    const backupUtils = mocks.factory();

    // Act
    const result = await backupUtils.verifyBackupSignature(
      dataWalletBackup,
      accountAddress2,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const verified = result._unsafeUnwrap();
    expect(verified).toBeFalsy();
  });
});
