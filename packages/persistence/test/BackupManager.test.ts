import "reflect-metadata";

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
  EBackupPriority,
} from "@snickerdoodlelabs/objects";

import { BackupManagerProviderMocks } from "@persistence-test/mocks";
import { ERecordKey } from "@persistence/ELocalStorageKey";
import { VolatileStorageMetadata } from "@persistence/volatile";

describe("Bundle", () => {
  test("Create a backupmanager object", async () => {
    const backupManagerMocks = new BackupManagerProviderMocks();
    await backupManagerMocks.unlock(
      EVMPrivateKey(
        "cdb1a5a07befb0420d8f2439a1794c3ac21f718bf3d63a5d9981cb490db8bfb7",
      ),
    );

    const backupManager = (
      await backupManagerMocks.getBackupManager()
    )._unsafeUnwrap();

    expect(backupManager).toBeDefined();
  });

  test("backupmanager object is singleton", async () => {
    const backupManagerMocks = new BackupManagerProviderMocks();
    await backupManagerMocks.unlock(
      EVMPrivateKey(
        "cdb1a5a07befb0420d8f2439a1794c3ac21f718bf3d63a5d9981cb490db8bfb7",
      ),
    );

    const firstBackupManager = (
      await backupManagerMocks.getBackupManager()
    )._unsafeUnwrap();
    const secondBackupManager = (
      await backupManagerMocks.getBackupManager()
    )._unsafeUnwrap();

    expect(secondBackupManager).toEqual(firstBackupManager);
  });

  test("Store and retrieve one ad object", async () => {
    const backupManagerMocks = new BackupManagerProviderMocks();
    await backupManagerMocks.unlock(
      EVMPrivateKey(
        "cdb1a5a07befb0420d8f2439a1794c3ac21f718bf3d63a5d9981cb490db8bfb7",
      ),
    );

    const backupManager = (
      await backupManagerMocks.getBackupManager()
    )._unsafeUnwrap();

    const testAd = new EligibleAd(
      EVMContractAddress("0x0B306BF915C4d645ff596e518fAf3F9669b97016"),
      IpfsCID("queryCID"),
      AdKey("a1"),
      "Creative ad name",
      new AdContent(EAdContentType.IMAGE, IpfsCID("adContentCID")),
      "You can view this ad anytime",
      EAdDisplayType.BANNER,
      99999,
      UnixTimestamp(123),
      ["keyword1", "keyword2"],
    );

    await backupManager.addRecord(
      ERecordKey.ELIGIBLE_ADS,
      new VolatileStorageMetadata<EligibleAd>(EBackupPriority.NORMAL, testAd),
    );

    const wrappedAdList =
      await backupManagerMocks.volatileStorage.getAll<EligibleAd>(
        ERecordKey.ELIGIBLE_ADS,
      );

    const adList = wrappedAdList._unsafeUnwrap();

    expect(adList).toContainEqual(testAd);
  });
});
