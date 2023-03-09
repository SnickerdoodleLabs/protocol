import "reflect-metadata";
import {
  AjaxError,
  BigNumberString,
  BlockchainProviderError,
  ChainId,
  DataWalletBackupID,
  DomainName,
  EChain,
  EDataWalletPermission,
  EVMAccountAddress,
  EVMContractAddress,
  EVMPrivateKey,
  ExternallyOwnedAccount,
  HexString,
  InvalidSignatureError,
  LanguageCode,
  LinkedAccount,
  MinimalForwarderContractError,
  PersistenceError,
  Signature,
  SolanaAccountAddress,
  UnauthorizedError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { errAsync, okAsync } from "neverthrow";
import * as td from "testdouble";

import { IntegrationService } from "@core/implementations/business/index.js";
import { IIntegrationService } from "@core/interfaces/business/index.js";
import { IPermissionRepository } from "@core/interfaces/data/index.js";
import { ContextProviderMock } from "@core-tests/mock/utilities/index.js";

const evmAccountAddress = EVMAccountAddress("evmAccountAddress");
const solanaAccountAddress = SolanaAccountAddress("solanaAccountAddress");

const evmDerivedPrivateKey = EVMPrivateKey("evmDerivedPrivateKey");
const solanaDerivedPrivateKey = EVMPrivateKey("solanaDerivedPrivateKey");

const evmDerivedEVMAccount = new ExternallyOwnedAccount(
  EVMAccountAddress("derivedEVMAccountAddress1"),
  evmDerivedPrivateKey,
);
const solanaDerivedEVMAccount = new ExternallyOwnedAccount(
  EVMAccountAddress("derivedEVMAccountAddress2"),
  solanaDerivedPrivateKey,
);
const evmChain = EChain.DevDoodle;
const solanaChain = EChain.Solana;

const dataWalletBackupID = DataWalletBackupID("dataWalletBackup");

const testDomain1 = DomainName("phoebe.cute");
const testDomain2 = DomainName("rats.adorable");

const permissionSet1 = [
  EDataWalletPermission.AddLinkedAccount,
  EDataWalletPermission.ReadWeb3Data,
];

class IntegrationServiceMocks {
  public permissionRepo: IPermissionRepository;
  public contextProvider: ContextProviderMock;

  public constructor() {
    this.permissionRepo = td.object<IPermissionRepository>();
    this.contextProvider = new ContextProviderMock();

    td.when(this.permissionRepo.getPermissions(testDomain1)).thenReturn(
      okAsync(permissionSet1),
    );
  }

  public factory(): IIntegrationService {
    return new IntegrationService(this.permissionRepo, this.contextProvider);
  }
}

describe("IntegrationService tests", () => {
  test("getPermissions() returns the current list of permission with no sourceDomain", async () => {
    // Arrange
    const mocks = new IntegrationServiceMocks();

    const service = mocks.factory();

    // Act
    const result = await service.getPermissions(testDomain1);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const permissions = result._unsafeUnwrap();
    expect(permissions).toBe(permissionSet1);

    mocks.contextProvider.assertEventCounts({});
    // mocks.contextProvider.assertEventCounts({
    //   onInitialized: 1,
    //   onAccountAdded: 1,
    // });
  });

  test("getPermissions() returns the current list of permissions with a sourceDomain", async () => {
    // Arrange
    const mocks = new IntegrationServiceMocks();

    const service = mocks.factory();

    // Act
    const result = await service.getPermissions(testDomain1, testDomain1);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const permissions = result._unsafeUnwrap();
    expect(permissions).toBe(permissionSet1);

    mocks.contextProvider.assertEventCounts({});
    // mocks.contextProvider.assertEventCounts({
    //   onInitialized: 1,
    //   onAccountAdded: 1,
    // });
  });

  test("getPermissions() errors when source domain does not match requested domain", async () => {
    // Arrange
    const mocks = new IntegrationServiceMocks();

    const service = mocks.factory();

    // Act
    const result = await service.getPermissions(testDomain1, testDomain2);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const err = result._unsafeUnwrapErr();
    expect(err).toBeInstanceOf(UnauthorizedError);

    mocks.contextProvider.assertEventCounts({});
    // mocks.contextProvider.assertEventCounts({
    //   onInitialized: 1,
    //   onAccountAdded: 1,
    // });
  });
});
