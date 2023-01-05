import "reflect-metadata";

import { EligibleAd, EVMPrivateKey, IpfsCID, ISO8601DateString, PersistenceError } from "@snickerdoodlelabs/objects";
import { ELocalStorageKey } from "@persistence/ELocalStorageKey";
import { BackupManagerProviderMocks } from "@persistence-test/mocks";


describe("Bundle", () => {

  test("Create a backupmanager object", async () => {
    
    const backupManagerMocks = new BackupManagerProviderMocks();
    await backupManagerMocks.unlock(
      EVMPrivateKey("cdb1a5a07befb0420d8f2439a1794c3ac21f718bf3d63a5d9981cb490db8bfb7")
    );

    const backupManager = (await backupManagerMocks.getBackupManager())._unsafeUnwrap();

    expect(backupManager).toBeDefined();
  });

  test("backupmanager object is singleton", async () => {

    const backupManagerMocks = new BackupManagerProviderMocks();
    await backupManagerMocks.unlock(
      EVMPrivateKey("cdb1a5a07befb0420d8f2439a1794c3ac21f718bf3d63a5d9981cb490db8bfb7")
    );
    
    const firstBackupManager = (await backupManagerMocks.getBackupManager())._unsafeUnwrap();
    const secondBackupManager = (await backupManagerMocks.getBackupManager())._unsafeUnwrap();

    expect(secondBackupManager).toEqual(firstBackupManager);
  });

  test("Store and retrieve one ad object", async () => {

    const backupManagerMocks = new BackupManagerProviderMocks();
    await backupManagerMocks.unlock(
      EVMPrivateKey("cdb1a5a07befb0420d8f2439a1794c3ac21f718bf3d63a5d9981cb490db8bfb7")
    );

    const backupManager = (await backupManagerMocks.getBackupManager())._unsafeUnwrap();

    const testAd = new EligibleAd(
      "someCid_a1",
      "a1",
      "Creative ad name",
      {
        type: "image",
        src: IpfsCID("someCid")
      },
      "You can view this ad anytime",
      "banner",
      99999,
      ISO8601DateString("Future"),
      ["keyword1", "keyword2"]
    );

    await backupManager.addRecord(ELocalStorageKey.ELIGIBLE_ADS, testAd);

    const wrappedAdList = await backupManagerMocks.volatileStorage.getAll<EligibleAd>(
      ELocalStorageKey.ELIGIBLE_ADS,
    );

    const adList = wrappedAdList._unsafeUnwrap();

    expect(adList).toContainEqual(testAd);
  });
});
