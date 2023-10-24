/* eslint-disable @typescript-eslint/no-non-null-assertion */
import "reflect-metadata";
import { ITimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  UnixTimestamp,
  ERecordKey,
  VersionedObject,
  EBackupPriority,
  EFieldKey,
  VolatileDataUpdate,
  EDataUpdateOpCode,
  DataWalletBackup,
  DataWalletBackupHeader,
  DataWalletBackupID,
  FieldDataUpdate,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";
import * as td from "testdouble";

import {
  ChunkRenderer,
  IBackupUtils,
  IChunkRenderer,
} from "@persistence/backup/index.js";
import { FieldIndex, Serializer } from "@persistence/local/index.js";
import { VolatileTableIndex } from "@persistence/volatile/index.js";
import {
  TestMigrator,
  TestVersionedObject,
} from "@persistence-test/mocks/index.js";

const dataWalletBackupIntervalMS = 10;
const maxChunkSize = 2;
const maxChunkSizeImmediate = 1;
const recordKey = ERecordKey.ACCOUNT;
const fieldKey = EFieldKey.GENDER;
const keyPath = "foo";
const keyValue = "Key Value";
const now = UnixTimestamp(30);
const beforeNow = UnixTimestamp(20);
const newValue = Serializer.serialize("New Value")._unsafeUnwrap();
const dataWalletBackupId = DataWalletBackupID("Data Wallet Backup ID");

const volatileTableIndex = new VolatileTableIndex<VersionedObject>(
  recordKey,
  keyPath, // keyPath
  false, // autoincrement
  new TestMigrator(),
  EBackupPriority.NORMAL,
  dataWalletBackupIntervalMS,
  maxChunkSize,
  [["foo", false]],
);
const volatileTableIndexImmediate = new VolatileTableIndex<VersionedObject>(
  recordKey,
  keyPath, // keyPath
  false, // autoincrement
  new TestMigrator(),
  EBackupPriority.NORMAL,
  0,
  maxChunkSizeImmediate,
  [["foo", false]],
);

const fieldIndex = new FieldIndex(
  fieldKey,
  EBackupPriority.HIGH,
  dataWalletBackupIntervalMS,
);
const fieldIndexImmediate = new FieldIndex(fieldKey, EBackupPriority.HIGH, 0);

const testRecord = new TestVersionedObject(keyValue, 1);

const fieldDataUpdate = new FieldDataUpdate(fieldKey, newValue, now);
const fieldDataUpdateBefore = new FieldDataUpdate(
  fieldKey,
  newValue,
  beforeNow,
);
const volatileDataUpdate = new VolatileDataUpdate(
  EDataUpdateOpCode.UPDATE,
  keyValue,
  now,
  testRecord,
  TestVersionedObject.CURRENT_VERSION,
);
const volatileDataUpdate0 = new VolatileDataUpdate(
  EDataUpdateOpCode.UPDATE,
  keyValue,
  beforeNow,
  testRecord,
  TestVersionedObject.CURRENT_VERSION,
);

class ChunkRendererMocks {
  public timeUtils: ITimeUtils;
  public backupUtils: IBackupUtils;

  public constructor(
    protected schema: VolatileTableIndex<VersionedObject> | FieldIndex,
  ) {
    this.timeUtils = td.object<ITimeUtils>();
    this.backupUtils = td.object<IBackupUtils>();

    // TimeUtils ---------------------------------------------------
    td.when(this.timeUtils.getUnixNow()).thenReturn(now as never);

    // BackupUtils -----------------------------------------------------------
    td.when(
      this.backupUtils.getBackupHash(td.matchers.contains(fieldDataUpdate)),
    ).thenReturn(okAsync(dataWalletBackupId));
    td.when(
      this.backupUtils.getBackupHash(
        td.matchers.contains(fieldDataUpdateBefore),
      ),
    ).thenReturn(okAsync(dataWalletBackupId));
    td.when(
      this.backupUtils.getBackupHash(
        td.matchers.argThat((arg) => {
          return (
            arg.length == 1 &&
            JSON.stringify(arg[0]) == JSON.stringify(volatileDataUpdate)
          );
        }),
      ),
    ).thenReturn(okAsync(dataWalletBackupId));
    td.when(
      this.backupUtils.getBackupHash(
        td.matchers.argThat((arg) => {
          return (
            arg.length == 2 &&
            JSON.stringify(arg[0]) == JSON.stringify(volatileDataUpdate0) &&
            JSON.stringify(arg[1]) == JSON.stringify(volatileDataUpdate)
          );
        }),
      ),
    ).thenReturn(okAsync(dataWalletBackupId));
  }

  public factory(): IChunkRenderer {
    return new ChunkRenderer(this.schema, this.backupUtils, this.timeUtils);
  }
}

describe("ChunkRenderer Tests", () => {
  test("update() works with first FieldDataUpdate, no backup is rendered", async () => {
    // Arrange
    const mocks = new ChunkRendererMocks(fieldIndex);

    const chunkRenderer = mocks.factory();

    // Act
    const result = await chunkRenderer.update(fieldDataUpdate);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const dataWalletBackup = result._unsafeUnwrap();
    expect(dataWalletBackup).toBeNull();
  });

  test("update() works with first VolatileDataUpdate, no backup is rendered", async () => {
    // Arrange
    const mocks = new ChunkRendererMocks(volatileTableIndex);

    const chunkRenderer = mocks.factory();

    // Act
    const result = await chunkRenderer.update(volatileDataUpdate);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const dataWalletBackup = result._unsafeUnwrap();
    expect(dataWalletBackup).toBeNull();
  });

  test("update() works with first FieldDataUpdate. Backup is supposed to be immediate and is rendered", async () => {
    // Arrange
    const mocks = new ChunkRendererMocks(fieldIndexImmediate);

    const chunkRenderer = mocks.factory();

    // Act
    const result = await chunkRenderer.update(fieldDataUpdate);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const dataWalletBackup = result._unsafeUnwrap();
    expect(dataWalletBackup).toBeDefined();
    expect(dataWalletBackup).toBeInstanceOf(DataWalletBackup);
    expect(dataWalletBackup!.id).toEqual(dataWalletBackupId);
    expect(dataWalletBackup!.blob).toEqual(fieldDataUpdate);
    expect(dataWalletBackup!.header).toBeInstanceOf(DataWalletBackupHeader);
    expect(dataWalletBackup!.header.hash).toBe(dataWalletBackupId);
    expect(dataWalletBackup!.header.timestamp).toBe(now);
    expect(dataWalletBackup!.header.priority).toBe(EBackupPriority.HIGH);
    expect(dataWalletBackup!.header.isField).toBeTruthy();
  });

  test("update() new update replaces older update for FieldDataUpdate. Backup is supposed to be immediate and is rendered", async () => {
    // Arrange
    const mocks = new ChunkRendererMocks(fieldIndexImmediate);

    const chunkRenderer = mocks.factory();

    // Act
    const result = await chunkRenderer
      .update(fieldDataUpdateBefore)
      .andThen(() => {
        return chunkRenderer.update(fieldDataUpdate);
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const dataWalletBackup = result._unsafeUnwrap();
    expect(dataWalletBackup).toBeDefined();
    expect(dataWalletBackup).toBeInstanceOf(DataWalletBackup);
    expect(dataWalletBackup!.id).toEqual(dataWalletBackupId);
    expect(dataWalletBackup!.blob).toEqual(fieldDataUpdate);
    expect(dataWalletBackup!.header).toBeInstanceOf(DataWalletBackupHeader);
    expect(dataWalletBackup!.header.hash).toBe(dataWalletBackupId);
    expect(dataWalletBackup!.header.timestamp).toBe(now);
    expect(dataWalletBackup!.header.priority).toBe(EBackupPriority.HIGH);
    expect(dataWalletBackup!.header.isField).toBeTruthy();
  });

  test("update() works with first VolatileDataUpdate. Backup is supposed to be immediate and is rendered", async () => {
    // Arrange
    const mocks = new ChunkRendererMocks(volatileTableIndexImmediate);

    const chunkRenderer = mocks.factory();

    // Act
    const result = await chunkRenderer.update(volatileDataUpdate);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const dataWalletBackup = result._unsafeUnwrap();
    expect(dataWalletBackup).toBeDefined();
    expect(dataWalletBackup).toBeInstanceOf(DataWalletBackup);
    expect(dataWalletBackup!.id).toEqual(dataWalletBackupId);
    expect(dataWalletBackup!.blob).toEqual([volatileDataUpdate]);
    expect(dataWalletBackup!.header).toBeInstanceOf(DataWalletBackupHeader);
    expect(dataWalletBackup!.header.hash).toBe(dataWalletBackupId);
    expect(dataWalletBackup!.header.timestamp).toBe(now);
    expect(dataWalletBackup!.header.priority).toBe(EBackupPriority.NORMAL);
    expect(dataWalletBackup!.header.isField).toBeFalsy();
  });

  test("update() exceed maxChunkSize and forces an update ", async () => {
    // Arrange
    const mocks = new ChunkRendererMocks(volatileTableIndex);

    const chunkRenderer = mocks.factory();

    // Act
    const result = await chunkRenderer
      .update(volatileDataUpdate0)
      .andThen((firstUpdate) => {
        expect(firstUpdate).toBeNull();
        return chunkRenderer.update(volatileDataUpdate);
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const dataWalletBackup = result._unsafeUnwrap();
    expect(dataWalletBackup).toBeDefined();
    expect(dataWalletBackup).toBeInstanceOf(DataWalletBackup);
    expect(dataWalletBackup!.id).toEqual(dataWalletBackupId);
    expect(dataWalletBackup!.blob).toEqual([
      volatileDataUpdate0,
      volatileDataUpdate,
    ]);
    expect(dataWalletBackup!.header).toBeInstanceOf(DataWalletBackupHeader);
    expect(dataWalletBackup!.header.hash).toBe(dataWalletBackupId);
    expect(dataWalletBackup!.header.timestamp).toBe(now);
    expect(dataWalletBackup!.header.priority).toBe(EBackupPriority.NORMAL);
    expect(dataWalletBackup!.header.isField).toBeFalsy();
  });

  test("update() fails with a mismatched update type: fieldDataUpdate", async () => {
    // Arrange
    const mocks = new ChunkRendererMocks(volatileTableIndex);

    const chunkRenderer = mocks.factory();

    // Act
    const result = await chunkRenderer.update(fieldDataUpdate);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const error = result._unsafeUnwrapErr();
    expect(error).toBeInstanceOf(PersistenceError);
  });

  test("update() fails with a mismatched update type: volatileDataUpdate", async () => {
    // Arrange
    const mocks = new ChunkRendererMocks(fieldIndex);

    const chunkRenderer = mocks.factory();

    // Act
    const result = await chunkRenderer.update(volatileDataUpdate);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const error = result._unsafeUnwrapErr();
    expect(error).toBeInstanceOf(PersistenceError);
  });

  test("clear() works with records and no updates", async () => {
    // Arrange
    const mocks = new ChunkRendererMocks(volatileTableIndex);

    const chunkRenderer = mocks.factory();

    // Act
    const result = await chunkRenderer.clear();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const dataWalletBackup = result._unsafeUnwrap();
    expect(dataWalletBackup).toBeNull();
  });

  test("clear() works with fields and no updates", async () => {
    // Arrange
    const mocks = new ChunkRendererMocks(fieldIndex);

    const chunkRenderer = mocks.factory();

    // Act
    const result = await chunkRenderer.clear();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const dataWalletBackup = result._unsafeUnwrap();
    expect(dataWalletBackup).toBeNull();
  });
});
