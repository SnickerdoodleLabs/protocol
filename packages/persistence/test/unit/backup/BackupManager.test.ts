import "reflect-metadata";
import {
  ICryptoUtils,
  ILogUtils,
  ITimeUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  EVMPrivateKey,
  UnixTimestamp,
  VolatileStorageMetadata,
  ERecordKey,
  VersionedObject,
  VersionedObjectMigrator,
  EBackupPriority,
  EFieldKey,
  EBoolean,
  VolatileDataUpdate,
  EDataUpdateOpCode,
  DataWalletBackup,
  DataWalletBackupHeader,
  DataWalletBackupID,
  Signature,
  FieldDataUpdate,
  RestoredBackup,
  EVMAccountAddress,
  SerializedObject,
} from "@snickerdoodlelabs/objects";
import { IStorageUtils } from "@snickerdoodlelabs/utils";
import { okAsync } from "neverthrow";
import * as td from "testdouble";

import {
  BackupManager,
  IBackupManager,
  IBackupUtils,
  IChunkRenderer,
  IChunkRendererFactory,
} from "@persistence/backup/index.js";
import { FieldIndex, Serializer } from "@persistence/local/index.js";
import {
  IVolatileStorage,
  IVolatileStorageSchemaProvider,
  VolatileTableIndex,
} from "@persistence/volatile/index.js";

const privateKey = EVMPrivateKey("Private Key");
const dataWalletAddress = EVMAccountAddress("Data Wallet Address");
const backupInterval = 10;
const maxChunkSize = 20;
const now = UnixTimestamp(30);
const beforeNow = UnixTimestamp(20);
const recordKey = ERecordKey.ACCOUNT;
const fieldKey = EFieldKey.ACCEPTED_INVITATIONS;
const keyPath = "foo";
const keyValue = "Key Value";
const newFieldValue = Serializer.serialize("New Field Value")._unsafeUnwrap();
const oldFieldValue = "Old Field Value";
const recordBackupId = DataWalletBackupID("Data Wallet Backup ID-Record");
const versionNumber = 1;

class TestVersionedObject extends VersionedObject {
  public static CURRENT_VERSION = 1;

  public constructor(public keyVal: string, public otherVal: number) {
    super();
  }

  public getVersion(): number {
    return TestVersionedObject.CURRENT_VERSION;
  }
}

class TestMigrator extends VersionedObjectMigrator<TestVersionedObject> {
  public getCurrentVersion(): number {
    return TestVersionedObject.CURRENT_VERSION;
  }

  protected factory(data: Record<string, unknown>): TestVersionedObject {
    return new TestVersionedObject(
      data["keyVal"] as string,
      data["otherVal"] as number,
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}

const testVolatileTableIndex = new VolatileTableIndex<VersionedObject>(
  recordKey,
  keyPath, // keyPath
  false, // autoincrement
  new TestMigrator(),
  EBackupPriority.NORMAL,
  backupInterval,
  maxChunkSize,
  [["foo", false]],
);
const volatileTableIndexes = [testVolatileTableIndex];

const testFieldIndex = new FieldIndex(
  fieldKey,
  EBackupPriority.NORMAL,
  backupInterval,
);
const fieldIndexes = [testFieldIndex];
const testRecord = new TestVersionedObject(keyValue, 1);

const recordBackup = new DataWalletBackup(
  new DataWalletBackupHeader(
    recordBackupId,
    now,
    Signature("signature"),
    EBackupPriority.NORMAL,
    recordKey,
    false,
  ),
  [
    new VolatileDataUpdate(
      EDataUpdateOpCode.UPDATE,
      keyValue,
      beforeNow,
      testRecord,
      0,
    ),
  ],
);

const restoredBackup = new RestoredBackup(recordBackupId, recordKey);

class BackupManagerMocks {
  public cryptoUtils: ICryptoUtils;
  public volatileStorage: IVolatileStorage;
  public storageUtils: IStorageUtils;
  public timeUtils: ITimeUtils;
  public backupUtils: IBackupUtils;
  public chunkRendererFactory: IChunkRendererFactory;
  public recordChunkRenderer: IChunkRenderer;
  public fieldChunkRenderer: IChunkRenderer;
  public schemaProvider: IVolatileStorageSchemaProvider;
  public logUtils: ILogUtils;

  public constructor(
    protected existingObject = true,
    protected enableEncryption = false,
  ) {
    this.cryptoUtils = td.object<ICryptoUtils>();
    this.volatileStorage = td.object<IVolatileStorage>();
    this.storageUtils = td.object<IStorageUtils>();
    this.timeUtils = td.object<ITimeUtils>();
    this.backupUtils = td.object<IBackupUtils>();
    this.chunkRendererFactory = td.object<IChunkRendererFactory>();
    this.recordChunkRenderer = td.object<IChunkRenderer>();
    this.fieldChunkRenderer = td.object<IChunkRenderer>();
    this.schemaProvider = td.object<IVolatileStorageSchemaProvider>();
    this.logUtils = td.object<ILogUtils>();

    // TimeUtils ---------------------------------------------------
    td.when(this.timeUtils.getUnixNow()).thenReturn(now as never); // Seriously, I don't know why the as never is needed; some strange typing issue in testdouble dealing with ts-brand

    // VolatileStorage ---------------------------------------------------
    td.when(this.volatileStorage.getKey(recordKey, testRecord)).thenReturn(
      okAsync(keyValue),
    );

    if (existingObject) {
      td.when(
        this.volatileStorage.getObject<TestVersionedObject>(
          recordKey,
          keyValue,
          true,
        ),
      ).thenReturn(
        okAsync(
          new VolatileStorageMetadata(
            new TestVersionedObject(keyValue, 0),

            UnixTimestamp(0),
            EBoolean.FALSE,
          ),
        ),
      );
    } else {
      td.when(
        this.volatileStorage.getObject<TestVersionedObject>(
          recordKey,
          keyValue,
          true,
        ),
      ).thenReturn(okAsync(null));
    }
    td.when(
      this.volatileStorage.putObject(
        recordKey,
        td.matchers.contains({
          lastUpdate: now,
          deleted: EBoolean.TRUE,
        }),
      ),
    ).thenReturn(okAsync(undefined));

    td.when(
      this.volatileStorage.putObject(
        recordKey,
        td.matchers.contains({
          lastUpdate: now,
          deleted: EBoolean.FALSE,
        }),
      ),
    ).thenReturn(okAsync(undefined));

    td.when(
      this.volatileStorage.putObject(
        recordKey,
        td.matchers.contains({
          lastUpdate: beforeNow,
          deleted: EBoolean.FALSE,
        }),
      ),
    ).thenReturn(okAsync(undefined));

    td.when(
      this.volatileStorage.getObject<RestoredBackup>(
        ERecordKey.RESTORED_BACKUPS,
        recordBackupId,
      ),
    ).thenReturn(okAsync(null));

    td.when(
      this.volatileStorage.putObject(
        ERecordKey.RESTORED_BACKUPS,
        td.matchers.contains(
          new VolatileStorageMetadata(
            new RestoredBackup(recordBackupId, recordKey),

            now,
            EBoolean.FALSE,
          ),
        ),
      ),
    ).thenReturn(okAsync(undefined));

    // ChunkRendererFactory ---------------------------------------------------
    td.when(
      this.chunkRendererFactory.createChunkRenderer(
        testVolatileTableIndex,
        enableEncryption,
        privateKey,
      ),
    ).thenReturn(this.recordChunkRenderer);

    td.when(
      this.chunkRendererFactory.createChunkRenderer(
        testFieldIndex,
        enableEncryption,
        privateKey,
      ),
    ).thenReturn(this.fieldChunkRenderer);

    // RecordChunkRenderer ---------------------------------------------------
    // By default, we don't render a backup
    td.when(
      this.recordChunkRenderer.update(
        td.matchers.contains({
          operation: EDataUpdateOpCode.UPDATE,
          key: keyValue,
          timestamp: now,
          value: td.matchers.isA(TestVersionedObject),
          version: 1,
        }),
      ),
    ).thenReturn(okAsync(null));

    td.when(
      this.recordChunkRenderer.update(
        td.matchers.contains({
          operation: EDataUpdateOpCode.REMOVE,
          key: keyValue,
          timestamp: now,
          value: td.matchers.isA(TestVersionedObject),
          version: 1,
        }),
      ),
    ).thenReturn(okAsync(null));

    td.when(this.recordChunkRenderer.checkInterval()).thenReturn(okAsync(null));

    td.when(
      this.fieldChunkRenderer.update(
        new FieldDataUpdate(fieldKey, td.matchers.contains(newFieldValue), now),
      ),
    ).thenReturn(okAsync(null));

    td.when(this.fieldChunkRenderer.checkInterval()).thenReturn(okAsync(null));

    // StorageUtils ---------------------------------------------------------
    td.when(
      this.storageUtils.write<SerializedObject>(
        fieldKey,
        td.matchers.contains({ type: "string", data: newFieldValue }),
      ),
    ).thenReturn(okAsync(undefined));
    td.when(this.storageUtils.read<SerializedObject>(fieldKey)).thenReturn(
      okAsync(new SerializedObject("string", oldFieldValue)),
    );

    // BackupUtils -----------------------------------------------------------
    // Backup verifies by default
    td.when(
      this.backupUtils.verifyBackupSignature(
        recordBackup,
        EVMAccountAddress(dataWalletAddress),
      ),
    ).thenReturn(okAsync(true));

    // CryptoUtils -----------------------------------------------------------
    td.when(
      this.cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey),
    ).thenReturn(dataWalletAddress as never);

    // SchemaProvider
    td.when(
      this.schemaProvider.getCurrentVersionForTable(recordKey),
    ).thenReturn(okAsync(versionNumber));
  }

  public factory(): IBackupManager {
    return new BackupManager(
      privateKey,
      volatileTableIndexes,
      fieldIndexes,
      this.cryptoUtils,
      this.volatileStorage,
      this.storageUtils,
      this.enableEncryption,
      this.timeUtils,
      this.backupUtils,
      this.chunkRendererFactory,
      this.schemaProvider,
      this.logUtils,
    );
  }
}

describe("BackupManager Tests", () => {
  test("addRecord() works and does not render a backup", async () => {
    // Arrange
    const mocks = new BackupManagerMocks();

    const backupManager = mocks.factory();

    // Act
    const result = await backupManager
      .addRecord(recordKey, new VolatileStorageMetadata(testRecord, now)) // Have to provide the timestamp manually, otherwise it defaults to Date.now(), which is very hard to mock correctly
      .andThen(() => {
        return backupManager.getRendered();
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const backups = result._unsafeUnwrap();
    expect(backups.length).toBe(0);
  });

  test("addRecord() renders a backup", async () => {
    // Arrange
    const mocks = new BackupManagerMocks();

    td.when(
      mocks.recordChunkRenderer.update(
        td.matchers.contains({
          operation: EDataUpdateOpCode.UPDATE,
          key: keyValue,
          timestamp: now,
          value: td.matchers.isA(TestVersionedObject),
          version: 1,
        }),
      ),
    ).thenReturn(okAsync(recordBackup));

    const backupManager = mocks.factory();

    // Act
    const result = await backupManager
      .addRecord(recordKey, new VolatileStorageMetadata(testRecord, now)) // Have to provide the timestamp manually, otherwise it defaults to Date.now(), which is very hard to mock correctly
      .andThen(() => {
        return backupManager.getRendered();
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const backups = result._unsafeUnwrap();
    expect(backups.length).toBe(1);
    expect(backups[0]).toBe(recordBackup);
  });

  // test("addRecord() works if no key is found", async () => {
  //   // Arrange
  //   const mocks = new BackupManagerMocks();

  //   td.when(mocks.volatileStorage.getKey(recordKey, testRecord)).thenReturn(
  //     okAsync(null),
  //   );

  //   td.when(
  //     mocks.recordChunkRenderer.update(
  //       td.matchers.contains({
  //         operation: EDataUpdateOpCode.UPDATE,
  //         key: null,
  //         timestamp: now,
  //         value: td.matchers.isA(TestVersionedObject),
  //         version: 1,
  //       }),
  //     ),
  //   ).thenReturn(okAsync(null));

  //   const backupManager = mocks.factory();

  //   // Act
  //   const result = await backupManager
  //     .addRecord(recordKey, new VolatileStorageMetadata(testRecord, now)) // Have to provide the timestamp manually, otherwise it defaults to Date.now(), which is very hard to mock correctly
  //     .andThen(() => {
  //       return backupManager.getRendered();
  //     });

  //   // Assert
  //   expect(result).toBeDefined();
  //   expect(result.isErr()).toBeFalsy();
  //   const backups = result._unsafeUnwrap();
  //   expect(backups.length).toBe(0);
  // });

  test("addRecord() works when data is not available even though the key exists", async () => {
    // Arrange
    const mocks = new BackupManagerMocks(false);

    const backupManager = mocks.factory();

    // Act
    const result = await backupManager
      .addRecord(recordKey, new VolatileStorageMetadata(testRecord, now)) // Have to provide the timestamp manually, otherwise it defaults to Date.now(), which is very hard to mock correctly
      .andThen(() => {
        return backupManager.getRendered();
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const backups = result._unsafeUnwrap();
    expect(backups.length).toBe(0);
  });

  test("deleteRecord() works and does not render a backup", async () => {
    // Arrange
    const mocks = new BackupManagerMocks();

    const backupManager = mocks.factory();

    // Act
    const result = await backupManager
      .deleteRecord(recordKey, keyValue)
      .andThen(() => {
        return backupManager.getRendered();
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const backups = result._unsafeUnwrap();
    expect(backups.length).toBe(0);
  });

  test("deleteRecord() renders a backup", async () => {
    // Arrange
    const mocks = new BackupManagerMocks();

    td.when(
      mocks.recordChunkRenderer.update(
        td.matchers.contains({
          operation: EDataUpdateOpCode.REMOVE,
          key: keyValue,
          timestamp: now,
          value: td.matchers.isA(TestVersionedObject),
          version: 1,
        }),
      ),
    ).thenReturn(okAsync(recordBackup));

    const backupManager = mocks.factory();

    // Act
    const result = await backupManager
      .deleteRecord(recordKey, keyValue)
      .andThen(() => {
        return backupManager.getRendered();
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const backups = result._unsafeUnwrap();
    expect(backups.length).toBe(1);
    expect(backups[0]).toBe(recordBackup);
  });

  test("deleteRecord() works when data is not available even though the key exists", async () => {
    // Arrange
    const mocks = new BackupManagerMocks(false);

    const backupManager = mocks.factory();

    // Act
    const result = await backupManager
      .deleteRecord(recordKey, keyValue)
      .andThen(() => {
        return backupManager.getRendered();
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const backups = result._unsafeUnwrap();
    expect(backups.length).toBe(0);
  });

  test("updateField() works and does not render a backup", async () => {
    // Arrange
    const mocks = new BackupManagerMocks();

    const backupManager = mocks.factory();

    // Act
    const result = await backupManager
      .updateField(fieldKey, newFieldValue)
      .andThen(() => {
        return backupManager.getRendered();
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const backups = result._unsafeUnwrap();
    expect(backups.length).toBe(0);
  });

  test("restore() restores backup", async () => {
    // Arrange
    const mocks = new BackupManagerMocks();

    const backupManager = mocks.factory();

    // Act
    const result = await backupManager.restore(recordBackup);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
  });

  test("restore() does nothing if backup was already restored", async () => {
    // Arrange
    const mocks = new BackupManagerMocks();

    td.when(
      mocks.volatileStorage.getObject<RestoredBackup>(
        ERecordKey.RESTORED_BACKUPS,
        recordBackupId,
      ),
    ).thenReturn(
      okAsync(
        new VolatileStorageMetadata(
          restoredBackup,

          now,
          EBoolean.FALSE,
        ),
      ),
    );

    const backupManager = mocks.factory();

    // Act
    const result = await backupManager.restore(recordBackup);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
  });

  test("popRendered() works", async () => {
    // Arrange
    const mocks = new BackupManagerMocks();

    td.when(
      mocks.recordChunkRenderer.update(
        td.matchers.contains({
          operation: EDataUpdateOpCode.UPDATE,
          key: keyValue,
          timestamp: now,
          value: td.matchers.isA(TestVersionedObject),
          version: 1,
        }),
      ),
    ).thenReturn(okAsync(recordBackup));

    const backupManager = mocks.factory();

    // Act
    const result = await backupManager
      .addRecord(recordKey, new VolatileStorageMetadata(testRecord, now)) // Have to provide the timestamp manually, otherwise it defaults to Date.now(), which is very hard to mock correctly
      .andThen(() => {
        return backupManager.popRendered(recordBackupId);
      })
      .andThen(() => {
        return backupManager.getRendered();
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const backups = result._unsafeUnwrap();
    expect(backups.length).toBe(0);
  });

  test("getRestored() works", async () => {
    // Arrange
    const mocks = new BackupManagerMocks();

    const restoredBackup = new RestoredBackup(recordBackupId, fieldKey);

    td.when(
      mocks.volatileStorage.getAll<RestoredBackup>(ERecordKey.RESTORED_BACKUPS),
    ).thenReturn(
      okAsync([
        // Multiples to makes sure the set works
        new VolatileStorageMetadata(restoredBackup, now, EBoolean.FALSE),
        new VolatileStorageMetadata(restoredBackup, now, EBoolean.FALSE),
      ]),
    );

    const backupManager = mocks.factory();

    // Act
    const result = await backupManager.getRestored();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const restored = result._unsafeUnwrap();
    expect(restored.length).toBe(1);
    expect(Array.from(restored.values())[0]).toBe(recordBackupId);
  });
});
