import "reflect-metadata";
import { ICryptoUtils, ITimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  AdContent,
  EAdContentType,
  EligibleAd,
  EAdDisplayType,
  EVMPrivateKey,
  IpfsCID,
  UnixTimestamp,
  AdKey,
  EVMContractAddress,
  VolatileStorageMetadata,
  ERecordKey,
  VersionedObject,
  VersionedObjectMigrator,
  EBackupPriority,
  EFieldKey,
  EBoolean,
  VolatileDataUpdate,
  EDataUpdateOpCode,
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
import { FieldIndex } from "@persistence/local/index.js";
import {
  IVolatileStorage,
  VolatileTableIndex,
} from "@persistence/volatile/index.js";

const privateKey = EVMPrivateKey("Private Key");
const backupInterval = 10;
const maxChunkSize = 20;
const now = UnixTimestamp(30);
const recordKey = ERecordKey.ACCOUNT;
const fieldKey = EFieldKey.ACCEPTED_INVITATIONS;
const testVersionedObjectKey = "foo";

class TestVersionedObject extends VersionedObject {
  public static CURRENT_VERSION = 1;

  public constructor(public foo: string) {
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
    return new TestVersionedObject(data["foo"] as string);
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
  testVersionedObjectKey, // keyPath
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

class BackupManagerMocks {
  public cryptoUtils: ICryptoUtils;
  public volatileStorage: IVolatileStorage;
  public storageUtils: IStorageUtils;
  public timeUtils: ITimeUtils;
  public backupUtils: IBackupUtils;
  public chunkRendererFactory: IChunkRendererFactory;
  public testRecord = new TestVersionedObject("newVal");
  public recordChunkRenderer: IChunkRenderer;
  public fieldChunkRenderer: IChunkRenderer;

  public constructor(
    protected existingObject = false,
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

    // TimeUtils ---------------------------------------------------
    td.when(this.timeUtils.getUnixNow()).thenReturn(now as never); // Seriously, I don't know why the as never is needed; some strange typing issue in testdouble dealing with ts-brand

    // VolatileStorage ---------------------------------------------------
    td.when(this.volatileStorage.getKey(recordKey, this.testRecord)).thenReturn(
      okAsync("foo"),
    );

    if (existingObject) {
      td.when(
        this.volatileStorage.getObject<TestVersionedObject>(
          recordKey,
          testVersionedObjectKey,
          true,
        ),
      ).thenReturn(
        okAsync(
          new VolatileStorageMetadata(
            new TestVersionedObject("oldVal"),
            UnixTimestamp(0),
            EBoolean.FALSE,
          ),
        ),
      );
    } else {
      td.when(
        this.volatileStorage.getObject<TestVersionedObject>(
          recordKey,
          testVersionedObjectKey,
          true,
        ),
      ).thenReturn(okAsync(null));
    }
    td.when(
      this.volatileStorage.putObject(
        recordKey,
        td.matchers.isA(VolatileStorageMetadata),
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
          key: "foo",
          timestamp: now,
          value: td.matchers.isA(TestVersionedObject),
          version: 1,
        }),
      ),
    ).thenReturn(okAsync(null));
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
    );
  }
}

describe("BackupManager Tests", () => {
  test("addRecord() works with no rendered backups", async () => {
    // Arrange
    const mocks = new BackupManagerMocks();

    const backupManager = mocks.factory();

    // Act
    const result = await backupManager
      .addRecord(recordKey, new VolatileStorageMetadata(mocks.testRecord, now)) // Have to provide the timestamp manually, otherwise it defaults to Date.now(), which is very hard to mock correctly
      .andThen(() => {
        return backupManager.getRendered();
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const backups = result._unsafeUnwrap();
    expect(backups.length).toBe(0);
  });
});
