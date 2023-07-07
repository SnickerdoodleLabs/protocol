import { DataPermissions } from "@objects/businessObjects/index.js";
import { EWalletDataType } from "@objects/enum/index.js";
import { HexString32 } from "@objects/primitives/index.js";

describe("DataPermissions bitwise operation tests", () => {
  test("0x0000000b contains b, a, 8, 1, 0", () => {
    // b = 11, 1011
    // a = 10, 1010
    // 1 = 1, 0001
    // 0 = 0, 0000
    const dp1 = new DataPermissions(
      HexString32(
        "0x000000000000000000000000000000000000000000000000000000000000000b",
      ),
    );
    const dp2 = new DataPermissions(
      HexString32(
        "0x000000000000000000000000000000000000000000000000000000000000000a",
      ),
    );
    const dp3 = new DataPermissions(
      HexString32(
        "0x0000000000000000000000000000000000000000000000000000000000000008",
      ),
    );
    const dp4 = new DataPermissions(
      HexString32(
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      ),
    );
    const dp5 = new DataPermissions(
      HexString32(
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      ),
    );

    expect(dp1.contains(dp1)).toBeTruthy();
    expect(dp1.contains(dp2)).toBeTruthy();
    expect(dp1.contains(dp3)).toBeTruthy();
    expect(dp1.contains(dp4)).toBeTruthy();
    expect(dp1.contains(dp5)).toBeTruthy();
  });

  test("0x0000000b does not contain c, 4", () => {
    // b = 11, 1011
    // c = 12, 1100
    // 4 = 4, 0100
    const dp1 = new DataPermissions(
      HexString32(
        "0x000000000000000000000000000000000000000000000000000000000000000b",
      ),
    );
    const dp2 = new DataPermissions(
      HexString32(
        "0x000000000000000000000000000000000000000000000000000000000000000c",
      ),
    );
    const dp3 = new DataPermissions(
      HexString32(
        "0x0000000000000000000000000000000000000000000000000000000000000004",
      ),
    );
    expect(dp1.contains(dp2)).toBeFalsy();
    expect(dp1.contains(dp3)).toBeFalsy();
  });

  test("CreateWithAllPermissions works", () => {
    // Arrange

    // Act
    const dp = DataPermissions.createWithAllPermissions();

    // Assert
    expect(dp.Age).toBeTruthy();
    expect(dp.Gender).toBeTruthy();
    expect(dp.GivenName).toBeTruthy();
    expect(dp.FamilyName).toBeTruthy();
    expect(dp.Birthday).toBeTruthy();
    expect(dp.Email).toBeTruthy();
    expect(dp.Location).toBeTruthy();
    expect(dp.SiteVisits).toBeTruthy();
    expect(dp.EVMTransactions).toBeTruthy();
    expect(dp.AccountBalances).toBeTruthy();
    expect(dp.AccountNFTs).toBeTruthy();
    expect(dp.LatestBlockNumber).toBeTruthy();
  });

  test("CreateWithPermissions with no permissions", () => {
    // Arrange

    // Act
    const dp = DataPermissions.createWithPermissions([]);

    // Assert
    expect(dp.Age).toBeFalsy();
    expect(dp.Gender).toBeFalsy();
    expect(dp.GivenName).toBeFalsy();
    expect(dp.FamilyName).toBeFalsy();
    expect(dp.Birthday).toBeFalsy();
    expect(dp.Email).toBeFalsy();
    expect(dp.Location).toBeFalsy();
    expect(dp.SiteVisits).toBeFalsy();
    expect(dp.EVMTransactions).toBeFalsy();
    expect(dp.AccountBalances).toBeFalsy();
    expect(dp.AccountNFTs).toBeFalsy();
    expect(dp.LatestBlockNumber).toBeFalsy();
  });

  test("CreateWithPermissions across multiple bytes", () => {
    // Arrange

    // Act
    const dp = DataPermissions.createWithPermissions([
      EWalletDataType.Age,
      EWalletDataType.LatestBlockNumber,
    ]);

    // Assert
    expect(dp.Age).toBeTruthy();
    expect(dp.Gender).toBeFalsy();
    expect(dp.GivenName).toBeFalsy();
    expect(dp.FamilyName).toBeFalsy();
    expect(dp.Birthday).toBeFalsy();
    expect(dp.Email).toBeFalsy();
    expect(dp.Location).toBeFalsy();
    expect(dp.SiteVisits).toBeFalsy();
    expect(dp.EVMTransactions).toBeFalsy();
    expect(dp.AccountBalances).toBeFalsy();
    expect(dp.AccountNFTs).toBeFalsy();
    expect(dp.LatestBlockNumber).toBeTruthy();
  });
});
