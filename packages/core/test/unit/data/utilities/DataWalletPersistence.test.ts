import "reflect-metadata";
import { ILogUtils, ITimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  DataWalletBackup,
  DataWalletBackupHeader,
  DataWalletBackupID,
  EBackupPriority,
  EBoolean,
  EDataStorageType,
  EDataUpdateOpCode,
  EFieldKey,
  ERecordKey,
  FieldDataUpdate,
  PersistenceError,
  SerializedObject,
  UnixTimestamp,
  VolatileDataUpdate,
  VolatileStorageMetadata,
} from "@snickerdoodlelabs/objects";
import {
  IBackupManager,
  IBackupManagerProvider,
  ICloudStorage,
  IFieldSchemaProvider,
  IVolatileCursor,
  IVolatileStorage,
  IVolatileStorageSchemaProvider,
  Serializer,
  ICloudStorageManager,
} from "@snickerdoodlelabs/persistence";
import { IStorageUtils } from "@snickerdoodlelabs/utils";
import { errAsync, okAsync } from "neverthrow";
import * as td from "testdouble";

import { DataWalletPersistence } from "@core/implementations/data/index.js";
import { IDataWalletPersistence } from "@core/interfaces/data/utilities/index.js";
import { IConfigProvider } from "@core/interfaces/utilities/index.js";
import { TestVersionedObject } from "@core-tests/mock/mocks/index.js";
import {
  ConfigProviderMock,
  ContextProviderMock,
} from "@core-tests/mock/utilities/index.js";

const now = UnixTimestamp(30);
const beforeNow = UnixTimestamp(20);
const fieldKey = EFieldKey.GENDER;
const recordKey = ERecordKey.QUERY_STATUS;
const fieldValue = { foo: "bar" };
const serializedFieldValue = Serializer.serialize(fieldValue)._unsafeUnwrap();
const fieldBackupId = DataWalletBackupID("FieldBackupId");
const recordBackupId = DataWalletBackupID("RecordBackupId");

const volatileStorageKey = "VolatileStorageKey";

const versionedObject = new TestVersionedObject(volatileStorageKey, 13);

const volatileStorageMetadata = new VolatileStorageMetadata(
  versionedObject,
  now,
  EBoolean.FALSE,
);

const volatileStorageMetadata0 = new VolatileStorageMetadata(
  versionedObject,
  UnixTimestamp(0),
  EBoolean.FALSE,
);

const fieldBackupHeader = new DataWalletBackupHeader(
  fieldBackupId,
  beforeNow,
  EBackupPriority.HIGH,
  fieldKey,
  true,
);
const fieldDataUpdate = new FieldDataUpdate(
  fieldKey,
  serializedFieldValue,
  beforeNow,
);
const fieldBackup = new DataWalletBackup(fieldBackupHeader, fieldDataUpdate);

const recordBackupHeader = new DataWalletBackupHeader(
  recordBackupId,
  beforeNow,
  EBackupPriority.HIGH,
  recordKey,
  false,
);
const recordDataUpdates = [
  new VolatileDataUpdate(
    EDataUpdateOpCode.UPDATE,
    volatileStorageKey,
    beforeNow,
    versionedObject,
    versionedObject.getVersion(),
  ),
];
const recordBackup = new DataWalletBackup(
  recordBackupHeader,
  recordDataUpdates,
);

const indexName = "keyVal";
const query = "query";
const direction: IDBCursorDirection = "next";
const mode: IDBTransactionMode = "readonly";
const cursor = td.object<IVolatileCursor<TestVersionedObject>>();

class DataWalletPersistenceMocks {
  public backupManagerProvider: IBackupManagerProvider;
  public backupManager: IBackupManager;
  public storageUtils: IStorageUtils;
  public volatileStorage: IVolatileStorage;
  public cloudStorage: ICloudStorage;
  public volatileSchemaProvider: IVolatileStorageSchemaProvider;
  public fieldSchemaProvider: IFieldSchemaProvider;
  public configProvider: IConfigProvider;
  public contextProvider: ContextProviderMock;
  public timeUtils: ITimeUtils;
  public logUtils: ILogUtils;
  public cloudStoreManager: ICloudStorageManager;

  public constructor() {
    this.cloudStoreManager = td.object<ICloudStorageManager>();
    this.backupManagerProvider = td.object<IBackupManagerProvider>();
    this.backupManager = td.object<IBackupManager>();
    this.storageUtils = td.object<IStorageUtils>();
    this.volatileStorage = td.object<IVolatileStorage>();
    this.cloudStorage = td.object<ICloudStorage>();
    this.volatileSchemaProvider = td.object<IVolatileStorageSchemaProvider>();
    this.fieldSchemaProvider = td.object<IFieldSchemaProvider>();
    this.configProvider = new ConfigProviderMock();
    this.contextProvider = new ContextProviderMock();
    this.timeUtils = td.object<ITimeUtils>();
    this.logUtils = td.object<ILogUtils>();

    // BackupManagerProvider -------------------------------------------
    td.when(this.backupManagerProvider.getBackupManager()).thenReturn(
      okAsync(this.backupManager),
    );

    // BackupManager ---------------------------------------------------
    td.when(
      this.backupManager.updateField(fieldKey, serializedFieldValue),
    ).thenReturn(okAsync(undefined));

    td.when(
      this.backupManager.addRecord(
        recordKey,
        td.matchers.contains(new VolatileStorageMetadata(versionedObject, now)),
      ),
    ).thenReturn(okAsync(undefined));

    td.when(
      this.backupManager.addRecord(
        ERecordKey.ACCOUNT,
        td.matchers.contains(new VolatileStorageMetadata(versionedObject, now)),
      ),
    ).thenReturn(okAsync(undefined));

    td.when(
      this.backupManager.deleteRecord(recordKey, volatileStorageKey),
    ).thenReturn(okAsync(undefined));

    // No restored backups by default
    td.when(this.backupManager.getRestored()).thenReturn(okAsync([]));

    td.when(this.backupManager.restore(fieldBackup)).thenReturn(
      okAsync(undefined),
    );

    td.when(this.backupManager.restore(recordBackup)).thenReturn(
      okAsync(undefined),
    );

    td.when(this.backupManager.getRendered(true)).thenReturn(
      okAsync([fieldBackup, recordBackup]),
    );

    td.when(
      this.backupManager.markRenderedChunkAsRestored(fieldBackupId),
    ).thenReturn(okAsync(undefined));
    td.when(
      this.backupManager.markRenderedChunkAsRestored(recordBackupId),
    ).thenReturn(okAsync(undefined));

    // StorageUtils ----------------------------------------------------
    td.when(this.storageUtils.read<SerializedObject>(fieldKey)).thenReturn(
      okAsync(serializedFieldValue),
    );

    // VolatileStorage -------------------------------------------------
    td.when(
      this.volatileStorage.getObject(recordKey, volatileStorageKey),
    ).thenReturn(okAsync(volatileStorageMetadata));

    td.when(
      this.volatileStorage.getObject(ERecordKey.ACCOUNT, volatileStorageKey),
    ).thenReturn(okAsync(volatileStorageMetadata));

    td.when(
      this.volatileStorage.getCursor(
        recordKey,
        indexName,
        query,
        direction,
        mode,
      ),
    ).thenReturn(okAsync(cursor));

    td.when(this.volatileStorage.getAll(recordKey, indexName)).thenReturn(
      okAsync([volatileStorageMetadata]),
    );

    td.when(
      this.volatileStorage.getAllByIndex(recordKey, indexName, query),
    ).thenReturn(okAsync([volatileStorageMetadata]));

    td.when(
      this.volatileStorage.putObject(
        ERecordKey.ACCOUNT,
        td.matchers.contains(
          new VolatileStorageMetadata(versionedObject, UnixTimestamp(0)),
        ),
      ),
    ).thenReturn(okAsync(undefined));

    td.when(
      this.volatileStorage.getKey(ERecordKey.ACCOUNT, versionedObject),
    ).thenReturn(okAsync(volatileStorageKey));

    // Cloud Storage ---------------------------------------------------
    td.when(this.cloudStorage.getLatestBackup(fieldKey)).thenReturn(
      okAsync(null),
    );

    // No backups to restore by default
    td.when(
      this.cloudStorage.pollByStorageType(
        td.matchers.argThat((set) => {
          return set.size === 0;
        }),
        recordKey,
      ),
    ).thenReturn(okAsync([]));

    td.when(
      this.cloudStorage.pollByStorageType(
        td.matchers.argThat((set) => {
          return set.size === 0;
        }),
        ERecordKey.ACCOUNT,
      ),
    ).thenReturn(okAsync([]));

    td.when(
      this.cloudStorage.pollBackups(
        td.matchers.argThat((set) => {
          return set.size === 0;
        }),
      ),
    ).thenReturn(okAsync([fieldBackup, recordBackup]));

    td.when(this.cloudStorage.putBackup(fieldBackup)).thenReturn(
      okAsync(fieldBackupId),
    );
    td.when(this.cloudStorage.putBackup(recordBackup)).thenReturn(
      okAsync(recordBackupId),
    );

    // TimeUtils -------------------------------------------------------
    td.when(this.timeUtils.getUnixNow()).thenReturn(now as never);
  }

  public factory(): IDataWalletPersistence {
    return new DataWalletPersistence(
      this.cloudStoreManager,
      this.backupManagerProvider,
      this.storageUtils,
      this.volatileStorage,
      this.configProvider,
      this.logUtils,
      this.contextProvider,
      this.volatileSchemaProvider,
      this.fieldSchemaProvider,
      this.timeUtils,
    );
  }
}

describe("DataWalletPersistence tests", () => {
  test("getField() works, no restored backups but non-null value in storage", async () => {
    // Arrange
    const mocks = new DataWalletPersistenceMocks();
    const persistence = mocks.factory();

    // Act
    const result = await persistence.getField(fieldKey);

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const fieldVal = result._unsafeUnwrap();
    expect(fieldVal).toEqual(fieldValue);

    mocks.contextProvider.assertEventCounts({
      onBackupCreated: 0,
      onBackupRestored: 0,
    });
  });

  test("getField() works, no restored backups, and null value in storage", async () => {
    // Arrange
    const mocks = new DataWalletPersistenceMocks();

    td.when(mocks.storageUtils.read<SerializedObject>(fieldKey)).thenReturn(
      okAsync(null),
    );

    const persistence = mocks.factory();

    // Act
    const result = await persistence.getField(fieldKey);

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const fieldVal = result._unsafeUnwrap();
    expect(fieldVal).toBeNull();

    mocks.contextProvider.assertEventCounts({
      onBackupCreated: 0,
      onBackupRestored: 0,
    });
  });

  test("getField() works, has restored backups", async () => {
    // Arrange
    const mocks = new DataWalletPersistenceMocks();

    td.when(mocks.cloudStorage.getLatestBackup(fieldKey)).thenReturn(
      okAsync(fieldBackup),
    );

    const persistence = mocks.factory();

    // Act
    const result = await persistence.getField(fieldKey);

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const fieldVal = result._unsafeUnwrap();
    expect(fieldVal).toEqual(fieldValue);

    mocks.contextProvider.assertEventCounts({
      onBackupCreated: 0,
      onBackupRestored: 1,
    });

    expect(mocks.contextProvider.onBackupRestoredActivations[0].dataType).toBe(
      fieldKey,
    );
    expect(
      mocks.contextProvider.onBackupRestoredActivations[0].storageType,
    ).toBe(EDataStorageType.Field);
    expect(mocks.contextProvider.onBackupRestoredActivations[0].backupId).toBe(
      fieldBackupId,
    );
    expect(
      mocks.contextProvider.onBackupRestoredActivations[0].totalRestored,
    ).toBe(1);
    expect(
      mocks.contextProvider.onBackupRestoredActivations[0].remainingToRestore,
    ).toBe(0);
  });

  test("getField() fails, backup manager fails to restore backup, returns most available value for field", async () => {
    // Arrange
    const mocks = new DataWalletPersistenceMocks();

    td.when(mocks.cloudStorage.getLatestBackup(fieldKey)).thenReturn(
      okAsync(fieldBackup),
    );

    const persistenceError = new PersistenceError(
      "BackupManager.restore() failed",
    );

    td.when(mocks.backupManager.restore(fieldBackup)).thenReturn(
      errAsync(persistenceError),
    );

    const persistence = mocks.factory();

    // Act
    const result = await persistence.getField(fieldKey);

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const fieldVal = result._unsafeUnwrap();
    expect(fieldVal).toEqual(fieldValue);

    mocks.contextProvider.assertEventCounts({
      onBackupCreated: 0,
      onBackupRestored: 0,
    });
  });

  test("updateField() works, no restored backups", async () => {
    // Arrange
    const mocks = new DataWalletPersistenceMocks();
    const persistence = mocks.factory();

    // Act
    const result = await persistence.updateField(fieldKey, fieldValue);

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();

    mocks.contextProvider.assertEventCounts({
      onBackupCreated: 0,
      onBackupRestored: 0,
    });
  });

  test("getObject() works, no restored backups but non-null value in storage", async () => {
    // Arrange
    const mocks = new DataWalletPersistenceMocks();
    const persistence = mocks.factory();

    // Act
    const result = await persistence.getObject(recordKey, volatileStorageKey);

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const record = result._unsafeUnwrap();
    expect(record).toEqual(versionedObject);

    mocks.contextProvider.assertEventCounts({
      onBackupCreated: 0,
      onBackupRestored: 0,
    });
  });

  test("getObject() works, no restored backups, and null value in storage", async () => {
    // Arrange
    const mocks = new DataWalletPersistenceMocks();

    td.when(
      mocks.volatileStorage.getObject(recordKey, volatileStorageKey),
    ).thenReturn(okAsync(null));

    const persistence = mocks.factory();

    // Act
    const result = await persistence.getObject(recordKey, volatileStorageKey);

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const record = result._unsafeUnwrap();
    expect(record).toBeNull();

    mocks.contextProvider.assertEventCounts({
      onBackupCreated: 0,
      onBackupRestored: 0,
    });
  });

  test("getObject() works, has restored backups", async () => {
    // Arrange
    const mocks = new DataWalletPersistenceMocks();

    td.when(
      mocks.cloudStorage.pollByStorageType(
        td.matchers.argThat((set) => {
          return set.size === 0;
        }),
        recordKey,
      ),
    ).thenReturn(okAsync([recordBackup]));

    const persistence = mocks.factory();

    // Act
    const result = await persistence.getObject(recordKey, volatileStorageKey);

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const record = result._unsafeUnwrap();
    expect(record).toEqual(versionedObject);

    mocks.contextProvider.assertEventCounts({
      onBackupCreated: 0,
      onBackupRestored: 1,
    });

    expect(mocks.contextProvider.onBackupRestoredActivations[0].dataType).toBe(
      recordKey,
    );
    expect(
      mocks.contextProvider.onBackupRestoredActivations[0].storageType,
    ).toBe(EDataStorageType.Record);
    expect(mocks.contextProvider.onBackupRestoredActivations[0].backupId).toBe(
      recordBackupId,
    );
    expect(
      mocks.contextProvider.onBackupRestoredActivations[0].totalRestored,
    ).toBe(1);
    expect(
      mocks.contextProvider.onBackupRestoredActivations[0].remainingToRestore,
    ).toBe(0);
  });

  test("getCursor() works, no restored backups", async () => {
    // Arrange
    const mocks = new DataWalletPersistenceMocks();
    const persistence = mocks.factory();

    // Act
    const result = await persistence.getCursor(
      recordKey,
      indexName,
      query,
      direction,
      mode,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const resultCursor = result._unsafeUnwrap();
    expect(resultCursor).toBe(cursor);

    mocks.contextProvider.assertEventCounts({
      onBackupCreated: 0,
      onBackupRestored: 0,
    });
  });

  test("getAll() works, no restored backups", async () => {
    // Arrange
    const mocks = new DataWalletPersistenceMocks();
    const persistence = mocks.factory();

    // Act
    const result = await persistence.getAll(recordKey, indexName);

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const vals = result._unsafeUnwrap();
    expect(vals.length).toBe(1);
    expect(vals[0]).toBe(versionedObject);

    mocks.contextProvider.assertEventCounts({
      onBackupCreated: 0,
      onBackupRestored: 0,
    });
  });

  test("getAllByIndex() works, no restored backups", async () => {
    // Arrange
    const mocks = new DataWalletPersistenceMocks();
    const persistence = mocks.factory();

    // Act
    const result = await persistence.getAllByIndex(recordKey, indexName, query);

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const vals = result._unsafeUnwrap();
    expect(vals.length).toBe(1);
    expect(vals[0]).toBe(versionedObject);

    mocks.contextProvider.assertEventCounts({
      onBackupCreated: 0,
      onBackupRestored: 0,
    });
  });

  test("updateRecord() works for non-account table", async () => {
    // Arrange
    const mocks = new DataWalletPersistenceMocks();
    const persistence = mocks.factory();

    // Act
    const result = await persistence.updateRecord(recordKey, versionedObject);

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();

    mocks.contextProvider.assertEventCounts({
      onBackupCreated: 0,
      onBackupRestored: 0,
    });
  });

  test("updateRecord() works for account table where there is no backed up record of the account", async () => {
    // Arrange
    const mocks = new DataWalletPersistenceMocks();

    td.when(
      mocks.volatileStorage.getObject(ERecordKey.ACCOUNT, volatileStorageKey),
    ).thenReturn(okAsync(volatileStorageMetadata0));

    const persistence = mocks.factory();

    // Act
    const result = await persistence.updateRecord(
      ERecordKey.ACCOUNT,
      versionedObject,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();

    mocks.contextProvider.assertEventCounts({
      onBackupCreated: 0,
      onBackupRestored: 0,
    });
  });

  test("updateRecord() works for account table where there is a backed up record of the account", async () => {
    // Arrange
    const mocks = new DataWalletPersistenceMocks();

    const persistence = mocks.factory();

    // Act
    const result = await persistence.updateRecord(
      ERecordKey.ACCOUNT,
      versionedObject,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();

    mocks.contextProvider.assertEventCounts({
      onBackupCreated: 0,
      onBackupRestored: 0,
    });
  });

  test("deleteRecord() works", async () => {
    // Arrange
    const mocks = new DataWalletPersistenceMocks();
    const persistence = mocks.factory();

    // Act
    const result = await persistence.deleteRecord(
      recordKey,
      volatileStorageKey,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();

    mocks.contextProvider.assertEventCounts({
      onBackupCreated: 0,
      onBackupRestored: 0,
    });
  });

  test("restoreBackup() restores backup sucessfully", async () => {
    // Arrange
    const mocks = new DataWalletPersistenceMocks();

    const persistence = mocks.factory();

    // Act
    const result = await persistence.restoreBackup(fieldBackup);

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();

    mocks.contextProvider.assertEventCounts({
      onBackupCreated: 0,
      onBackupRestored: 1,
    });

    expect(mocks.contextProvider.onBackupRestoredActivations[0].dataType).toBe(
      fieldKey,
    );
    expect(
      mocks.contextProvider.onBackupRestoredActivations[0].storageType,
    ).toBe(EDataStorageType.Field);
    expect(mocks.contextProvider.onBackupRestoredActivations[0].backupId).toBe(
      fieldBackupId,
    );
    expect(
      mocks.contextProvider.onBackupRestoredActivations[0].totalRestored,
    ).toBe(1);
    expect(
      mocks.contextProvider.onBackupRestoredActivations[0].remainingToRestore,
    ).toBe(0);
  });

  test("restoreBackup() fails to restore", async () => {
    // Arrange
    const mocks = new DataWalletPersistenceMocks();

    const persistenceError = new PersistenceError(
      "BackupManager.restore() failed",
    );

    td.when(mocks.backupManager.restore(fieldBackup)).thenReturn(
      errAsync(persistenceError),
    );

    const persistence = mocks.factory();

    // Act
    const result = await persistence.restoreBackup(fieldBackup);

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeFalsy();

    mocks.contextProvider.assertEventCounts({
      onBackupCreated: 0,
      onBackupRestored: 0,
    });
  });

  test("postBackups() posts 2 backups successfully", async () => {
    // Arrange
    const mocks = new DataWalletPersistenceMocks();
    const persistence = mocks.factory();

    // Act
    const result = await persistence.postBackups(true);

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const backupIds = result._unsafeUnwrap();
    expect(backupIds).toEqual([fieldBackupId, recordBackupId]);

    mocks.contextProvider.assertEventCounts({
      onBackupCreated: 2,
      onBackupRestored: 0,
    });

    const event1 = mocks.contextProvider.onBackupCreatedActivations[0];
    const event2 = mocks.contextProvider.onBackupCreatedActivations[1];

    expect(event1.dataType).toBe(fieldKey);
    expect(event1.storageType).toBe(EDataStorageType.Field);
    expect(event1.backupId).toBe(fieldBackupId);
    expect(event1.name).toBe(
      `${EBackupPriority.HIGH}_SD$Gender_${beforeNow}_${fieldBackupId}_true`,
    );
    expect(event1.backupsCreated).toBe(1);
    expect(event1.remainingBackupsToCreate).toBe(1);

    expect(event2.dataType).toBe(recordKey);
    expect(event2.storageType).toBe(EDataStorageType.Record);
    expect(event2.backupId).toBe(recordBackupId);
    expect(event2.name).toBe(
      `${EBackupPriority.HIGH}_SD$QueryStatus_${beforeNow}_${recordBackupId}_false`,
    );
    expect(event2.backupsCreated).toBe(2);
    expect(event2.remainingBackupsToCreate).toBe(0);
  });

  test("postBackups() posts 2 backups, 1 fails", async () => {
    // Arrange
    const mocks = new DataWalletPersistenceMocks();

    const persistenceError = new PersistenceError("CloudStorage.put() failed");
    td.when(mocks.cloudStorage.putBackup(fieldBackup)).thenReturn(
      errAsync(persistenceError),
    );

    const persistence = mocks.factory();

    // Act
    const result = await persistence.postBackups(true);

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const backupIds = result._unsafeUnwrap();
    expect(backupIds).toEqual([recordBackupId]);

    mocks.contextProvider.assertEventCounts({
      onBackupCreated: 1,
      onBackupRestored: 0,
    });

    const event = mocks.contextProvider.onBackupCreatedActivations[0];

    expect(event.dataType).toBe(recordKey);
    expect(event.storageType).toBe(EDataStorageType.Record);
    expect(event.backupId).toBe(recordBackupId);
    expect(event.name).toBe(
      `${EBackupPriority.HIGH}_SD$QueryStatus_${beforeNow}_${recordBackupId}_false`,
    );
    expect(event.backupsCreated).toBe(1);
    expect(event.remainingBackupsToCreate).toBe(1);
  });

  test("pollBackups()", async () => {
    // Arrange
    const mocks = new DataWalletPersistenceMocks();

    // No backups need to be posted first
    td.when(mocks.backupManager.getRendered(true)).thenReturn(okAsync([]));

    const persistence = mocks.factory();

    // Act
    const result = await persistence.pollBackups();

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();

    mocks.contextProvider.assertEventCounts({
      onBackupCreated: 0,
      onBackupRestored: 2,
    });

    const event1 = mocks.contextProvider.onBackupRestoredActivations[0];
    const event2 = mocks.contextProvider.onBackupRestoredActivations[1];

    expect(event1.dataType).toBe(fieldKey);
    expect(event1.storageType).toBe(EDataStorageType.Field);
    expect(event1.backupId).toBe(fieldBackupId);
    expect(event1.name).toBe(
      `${EBackupPriority.HIGH}_SD$Gender_${beforeNow}_${fieldBackupId}_true`,
    );
    expect(event1.totalRestored).toBe(1);
    expect(event1.remainingToRestore).toBe(1);

    expect(event2.dataType).toBe(recordKey);
    expect(event2.storageType).toBe(EDataStorageType.Record);
    expect(event2.backupId).toBe(recordBackupId);
    expect(event2.name).toBe(
      `${EBackupPriority.HIGH}_SD$QueryStatus_${beforeNow}_${recordBackupId}_false`,
    );
    expect(event2.totalRestored).toBe(2);
    expect(event2.remainingToRestore).toBe(0);
  });

  test("pollBackups() 2 at a time, returns the first result", async () => {
    // Arrange
    const mocks = new DataWalletPersistenceMocks();

    // No backups need to be posted first
    td.when(mocks.backupManager.getRendered(true)).thenReturn(okAsync([]));

    const persistence = mocks.factory();

    // Act
    const resultProm1 = persistence.pollBackups();
    const resultProm2 = persistence.pollBackups();

    const result = await resultProm1;
    const result2 = await resultProm2;

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    expect(result2).toBeDefined();
    expect(result2.isOk()).toBeTruthy();
    expect(resultProm1).toBe(resultProm2);

    mocks.contextProvider.assertEventCounts({
      onBackupCreated: 0,
      onBackupRestored: 2,
    });

    const event1 = mocks.contextProvider.onBackupRestoredActivations[0];
    const event2 = mocks.contextProvider.onBackupRestoredActivations[1];

    expect(event1.dataType).toBe(fieldKey);
    expect(event1.storageType).toBe(EDataStorageType.Field);
    expect(event1.backupId).toBe(fieldBackupId);
    expect(event1.name).toBe(
      `${EBackupPriority.HIGH}_SD$Gender_${beforeNow}_${fieldBackupId}_true`,
    );
    expect(event1.totalRestored).toBe(1);
    expect(event1.remainingToRestore).toBe(1);

    expect(event2.dataType).toBe(recordKey);
    expect(event2.storageType).toBe(EDataStorageType.Record);
    expect(event2.backupId).toBe(recordBackupId);
    expect(event2.name).toBe(
      `${EBackupPriority.HIGH}_SD$QueryStatus_${beforeNow}_${recordBackupId}_false`,
    );
    expect(event2.totalRestored).toBe(2);
    expect(event2.remainingToRestore).toBe(0);
  });
});
