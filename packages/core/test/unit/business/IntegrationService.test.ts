import "reflect-metadata";
import { ICryptoUtils } from "@snickerdoodlelabs/common-utils";
import {
  DomainCredential,
  DomainName,
  EDataWalletPermission,
  KeyGenerationError,
  PEMEncodedRSAPrivateKey,
  PEMEncodedRSAPublicKey,
  PersistenceError,
  RSAKeyPair,
  UnauthorizedError,
  UUID,
} from "@snickerdoodlelabs/objects";
import jwt from "jsonwebtoken";
import { errAsync, okAsync } from "neverthrow";
import * as td from "testdouble";

import { IntegrationService } from "@core/implementations/business/index.js";
import { IIntegrationService } from "@core/interfaces/business/index.js";
import {
  IDomainCredentialRepository,
  IPermissionRepository,
} from "@core/interfaces/data/index.js";
import { ContextProviderMock } from "@core-tests/mock/utilities/index.js";

const testDomain1 = DomainName("phoebe.cute");
const testDomain2 = DomainName("rats.adorable");
const id1 = UUID("UUID for testDomain1");
const id2 = UUID("UUID for testDomain2");

// These are random but valid keys. No security issues, but don't use them anywhere!
const publicKey1 = PEMEncodedRSAPublicKey(`-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAwSD9vw8pBY0fSdwxggzd
T+epKvSAkruPa3fAOehvgpw5gPZzjZrrYzPde5gikYmM2CdBAnwFBYo7opo5ATXB
sAeR3gMD2hgLN7dLhSD1fyE7N7Ig+j60OKKBsKZ09YDvO1o2KHJK4vzCydQI0zR0
zweHWCnvs6qE7ntZukaws2trr/qVrCZSx81bqsUb+aFObpsERExR3iPXxqEL8wzI
kL9QY5gsdfogMY49l5DtJh/vZCjO2NkWcBSOm9apF7JcYXcLcQMmL8tSFzbaezAQ
GtH2SuBVg3xyYOyudkV4m5iBLJ6OpxOKSg8mbFOkBBzB5Msb+/Nb0nC27hY60teq
jXxp5Gcd1mCBn85wdTB7vI2VJegBAdM1YWJcV88SBgphwjzOh6xoOpUTMU6BmjtM
Jr+DgiAOL3NMCMCS4OzZUEUdgdrM+IFWdMlx+Dfia+7g4I4Mzl4q3wiLh2Mo/a87
PW0j+p0JYK2aC3ih+FtMZtJ4kG0a/+lwZrmS8dYNf3j9Q1PMpoxoKsf1A2EhSopU
uwVmvHlCB/MOo25F2E9Fw2jNXODkry5qb7iXHYMS++kRXtutYE57BzpsWfuJTjvY
rnb3oXPlomzUl2mXbi8BkZTC98HN1rj1kqPXw4VMPr//nEoUzr1HhbB377gsnWow
Nz//6AWXwkALhKPdZSfduksCAwEAAQ==
-----END PUBLIC KEY-----`);
const privateKey1 = PEMEncodedRSAPrivateKey(`-----BEGIN PRIVATE KEY-----
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
incqlW1Q9jhXt8pRsbCt3wDiV30i8Q==
-----END PRIVATE KEY-----`);

const publicKey2 = PEMEncodedRSAPublicKey("Public key 2");
const privateKey2 = PEMEncodedRSAPrivateKey("Private key 2");
const keyPair1 = new RSAKeyPair(privateKey1, publicKey1);
const keyPair2 = new RSAKeyPair(privateKey2, publicKey2);

const domainCredential1 = new DomainCredential(testDomain1, id1, keyPair1);
const domainCredential2 = new DomainCredential(testDomain2, id2, keyPair2);

const testNonce = "Literally anything";

const permissionSet1 = [
  EDataWalletPermission.AddLinkedAccount,
  EDataWalletPermission.ReadWeb3Data,
];

class IntegrationServiceMocks {
  public permissionRepo: IPermissionRepository;
  public domainCredentialRepo: IDomainCredentialRepository;
  public contextProvider: ContextProviderMock;
  public cryptoUtils: ICryptoUtils;

  public constructor() {
    this.permissionRepo = td.object<IPermissionRepository>();
    this.domainCredentialRepo = td.object<IDomainCredentialRepository>();
    this.contextProvider = new ContextProviderMock();
    this.cryptoUtils = td.object<ICryptoUtils>();

    td.when(this.permissionRepo.getPermissions(testDomain1)).thenReturn(
      okAsync(permissionSet1),
    );

    // Domain 1 already defined, domain 2 undefined
    td.when(
      this.domainCredentialRepo.getDomainCredential(testDomain1),
    ).thenReturn(okAsync(domainCredential1));
    td.when(
      this.domainCredentialRepo.getDomainCredential(testDomain2),
    ).thenReturn(okAsync(null));
    td.when(
      this.domainCredentialRepo.addDomainCredential(
        td.matchers.contains(domainCredential2),
      ),
    ).thenReturn(okAsync(undefined));

    // This will return the second key pair the first time it's called
    td.when(this.cryptoUtils.createRSAKeyPair()).thenReturn(okAsync(keyPair2));
    td.when(this.cryptoUtils.getUUID()).thenReturn(id2 as never);
  }

  public factory(): IIntegrationService {
    return new IntegrationService(
      this.domainCredentialRepo,
      this.permissionRepo,
      this.contextProvider,
      this.cryptoUtils,
    );
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

  test("getTokenVerificationPublicKey() returns a key for domain that had already been established", async () => {
    // Arrange
    const mocks = new IntegrationServiceMocks();

    const service = mocks.factory();

    // Act
    const result = await service.getTokenVerificationPublicKey(testDomain1);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const key = result._unsafeUnwrap();
    expect(key).toBe(publicKey1);

    mocks.contextProvider.assertEventCounts({});
  });

  test("getTokenVerificationPublicKey() establishes a domain credential and returns a key for a new domain", async () => {
    // Arrange
    const mocks = new IntegrationServiceMocks();

    const service = mocks.factory();

    // Act
    const result = await service.getTokenVerificationPublicKey(testDomain2);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const key = result._unsafeUnwrap();
    expect(key).toBe(publicKey2);

    mocks.contextProvider.assertEventCounts({});
  });

  test("getTokenVerificationPublicKey() returns a different key for different domains", async () => {
    // Arrange
    const mocks = new IntegrationServiceMocks();

    const service = mocks.factory();

    // Act
    const result1 = await service.getTokenVerificationPublicKey(testDomain1);
    const result2 = await service.getTokenVerificationPublicKey(testDomain2);

    // Assert
    expect(result1).toBeDefined();
    expect(result2).toBeDefined();
    expect(result1.isErr()).toBeFalsy();
    expect(result2.isErr()).toBeFalsy();
    const key1 = result1._unsafeUnwrap();
    const key2 = result2._unsafeUnwrap();
    expect(key1).toBe(publicKey1);
    expect(key2).toBe(publicKey2);

    mocks.contextProvider.assertEventCounts({});
  });

  test("getTokenVerificationPublicKey() errors if getDomainCredential() fails", async () => {
    // Arrange
    const mocks = new IntegrationServiceMocks();

    const err = new PersistenceError();
    td.when(
      mocks.domainCredentialRepo.getDomainCredential(testDomain1),
    ).thenReturn(errAsync(err));

    const service = mocks.factory();

    // Act
    const result = await service.getTokenVerificationPublicKey(testDomain1);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const error = result._unsafeUnwrapErr();
    expect(error).toBe(err);

    mocks.contextProvider.assertEventCounts({});
  });

  test("getTokenVerificationPublicKey() errors if createRSAKeyPair() fails", async () => {
    // Arrange
    const mocks = new IntegrationServiceMocks();

    const err = new KeyGenerationError();
    td.when(mocks.cryptoUtils.createRSAKeyPair()).thenReturn(errAsync(err));

    const service = mocks.factory();

    // Act
    const result = await service.getTokenVerificationPublicKey(testDomain2);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const error = result._unsafeUnwrapErr();
    expect(error).toBe(err);

    mocks.contextProvider.assertEventCounts({});
  });

  test("getTokenVerificationPublicKey() errors if addDomainCredential() fails", async () => {
    // Arrange
    const mocks = new IntegrationServiceMocks();

    const err = new PersistenceError();
    td.when(
      mocks.domainCredentialRepo.addDomainCredential(td.matchers.anything()),
    ).thenReturn(errAsync(err));

    const service = mocks.factory();

    // Act
    const result = await service.getTokenVerificationPublicKey(testDomain2);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const error = result._unsafeUnwrapErr();
    expect(error).toBe(err);

    mocks.contextProvider.assertEventCounts({});
  });

  test("getBearerToken() returns a token", async () => {
    // Arrange
    const mocks = new IntegrationServiceMocks();

    const service = mocks.factory();

    // Act
    const result = await service.getBearerToken(testNonce, testDomain1);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const domainToken = result._unsafeUnwrap();

    // jwt.verify() throws an error if it's invalid, which is a failure case for us!
    const verifiedTokenContent = jwt.verify(
      domainToken,
      publicKey1,
    ) as jwt.JwtPayload;

    expect(verifiedTokenContent.sub).toBe(id1);
    expect(verifiedTokenContent.nonce).toBe(testNonce);
    expect(verifiedTokenContent.aud).toBe(testDomain1);
    expect(verifiedTokenContent.iss).toBe("Snickerdoodle Data Wallet");

    mocks.contextProvider.assertEventCounts({});
  });
});
