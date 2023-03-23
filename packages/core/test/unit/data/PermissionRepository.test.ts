import "reflect-metadata";
import {
  DomainName,
  EBackupPriority,
  EDataWalletPermission,
  EFieldKey,
} from "@snickerdoodlelabs/objects";
import { errAsync, okAsync } from "neverthrow";
import * as td from "testdouble";

import { PermissionRepository } from "@core/implementations/data/index.js";
import {
  IDataWalletPersistence,
  IPermissionRepository,
} from "@core/interfaces/data/index.js";

const domainName1 = DomainName("phoebe.cute");
const domainName2 = DomainName("rats.chu");
const domainPermissions = {
  [domainName1]: [
    EDataWalletPermission.AddLinkedAccount,
    EDataWalletPermission.ReadBrowserHistory,
  ],
};

class PermissionRepositoryMocks {
  public dataWalletPeristence: IDataWalletPersistence;

  constructor() {
    this.dataWalletPeristence = td.object<IDataWalletPersistence>();

    td.when(
      this.dataWalletPeristence.getField(EFieldKey.DOMAIN_PERMISSIONS),
    ).thenReturn(okAsync(domainPermissions));

    td.when(
      this.dataWalletPeristence.updateField(
        EFieldKey.DOMAIN_PERMISSIONS,
        td.matchers.contains({
          [domainName1]: [EDataWalletPermission.ReadWeb3Data],
        }),
      ),
    ).thenReturn(okAsync(undefined));
  }

  public factoryRepository(): IPermissionRepository {
    return new PermissionRepository(this.dataWalletPeristence);
  }
}

describe("PermissionRepository tests", () => {
  test("getPermissions returns empty set if domain hasn't been set", async () => {
    // Arrange
    const mocks = new PermissionRepositoryMocks();
    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.getPermissions(domainName2);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const permissions = result._unsafeUnwrap();
    expect(permissions).toEqual([]);
  });

  test("getPermissions returns empty set if field does not exist", async () => {
    // Arrange
    const mocks = new PermissionRepositoryMocks();

    td.when(
      mocks.dataWalletPeristence.getField(EFieldKey.DOMAIN_PERMISSIONS),
    ).thenReturn(okAsync(null));

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.getPermissions(domainName2);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const permissions = result._unsafeUnwrap();
    expect(permissions).toEqual([]);
  });

  test("getPermissions returns permission set if permissions exist", async () => {
    // Arrange
    const mocks = new PermissionRepositoryMocks();
    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.getPermissions(domainName1);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const permissions = result._unsafeUnwrap();
    expect(permissions).toEqual([
      EDataWalletPermission.AddLinkedAccount,
      EDataWalletPermission.ReadBrowserHistory,
    ]);
  });
  test("setPermissions replaces existing permission set", async () => {
    // Arrange
    const mocks = new PermissionRepositoryMocks();
    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.setPermissions(domainName1, [
      EDataWalletPermission.ReadWeb3Data,
    ]);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
  });

  test("setPermissions works with no existing field", async () => {
    // Arrange
    const mocks = new PermissionRepositoryMocks();

    td.when(
      mocks.dataWalletPeristence.getField(EFieldKey.DOMAIN_PERMISSIONS),
    ).thenReturn(okAsync(null));

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.setPermissions(domainName1, [
      EDataWalletPermission.ReadWeb3Data,
    ]);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
  });
});
