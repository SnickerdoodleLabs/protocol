import { ResultUtils } from "neverthrow-result-utils";
import td from "testdouble";

import { CryptoUtils } from "@common-utils/implementations";
import { ICryptoUtils } from "@common-utils/interfaces";

class CryptoUtilsMocks {
  // public customerRepository = td.object<ICustomerRepository>();
  // public userRepository = td.object<IUserRepository>();
  // public productUserRepository = td.object<IProductUserRepository>();
  // public authRepository = td.object<IAuthorizationRepository>();
  // public cryptoUtils = td.object<ICryptoUtils>();
  // public token =
  // 	"eyJhbGciOiJQUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJleHRlcm5hbElkIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.FeX-3ga7cSoHfuwcdneUvB1etMEAeMDYzVEYabZznZNHA14tOnkO1NcrvTpSJewrpnEd8flAHzvjFyNsJjgCBGUldiVt14uhxftdnYpc4RQplENkaqd3rKKZKVzGjwZm6ePLX48zRVYTCfMRt5CmsIAVNhGEGPmKFCvtvdVXTQFuOuTH-jfhROTY8C1qFOFE8gny9P6gkGpRiezZqsztCSAYTdYOFgadMNGhbq8Xcrw2qCRsRc6-5G2ceaI5tnUZVC-IMAmajCs52jw1hl_aeYMXJL5zSofM4-fkRVLUpdioqhF7C-Lt30e3Bkomzzwp-qfw_KUGiUpg3Oy_RhVlwA";
  // public userContextMock = UserContextMock.factoryUserContext();
  // public customerId = this.userContextMock.customerId as UUID;
  // public customerObject: Customer = new Customer(
  // 	this.customerId,
  // 	"",
  // 	"",
  // 	sampleEmail,
  // 	"",
  // 	"",
  // 	"",
  // 	"",
  // 	"",
  // 	true,
  // 	null,
  // 	new Date(),
  // 	new Date(),
  // );

  public constructor() {
    // td.when(
    // 	this.customerRepository.getByExternalId(["externalId"]),
    // ).thenReturn(okAsync(new Map([["externalId", this.customerObject]])));
  }

  public factoryCryptoUtils(): ICryptoUtils {
    return new CryptoUtils();
  }
}

describe("CryptoUtils tests", () => {
  test("getNonce returns 64 characters of base64", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    // Act
    const result = await utils.getNonce();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const nonce = result._unsafeUnwrap();
    expect(Buffer.from(nonce, "base64").toString("base64")).toBe(nonce);
    expect(Buffer.from(nonce, "base64").byteLength).toBe(48);
    expect(nonce.length).toBe(64);
  });

  test("createAESKey returns 32 bytes as 44 characters of base64", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    // Act
    const result = await utils.createAESKey();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const key = result._unsafeUnwrap();
    expect(Buffer.from(key, "base64").toString("base64")).toBe(key);
    expect(Buffer.from(key, "base64").byteLength).toBe(32);
    expect(key.length).toBe(44);
  });

  test("createEthereumPrivateKey returns 32 bytes as 64 characters of hex", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    // Act
    const result = await utils.createEthereumPrivateKey();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const key = result._unsafeUnwrap();
    expect(Buffer.from(key, "hex").toString("hex")).toBe(key);
    expect(Buffer.from(key, "hex").byteLength).toBe(32);
    expect(key.length).toBe(64);
  });

  test("Encrypt Decrypt Closed Loop", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    const dataToEncrypt = "Phoebe is cute!";

    // Act
    const result = await utils.createAESKey().andThen((encryptionKey) => {
      return utils
        .encryptString(dataToEncrypt, encryptionKey)
        .andThen((encryptedString) => {
          return utils.decryptAESEncryptedString(
            encryptedString,
            encryptionKey,
          );
        });
    });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toEqual(dataToEncrypt);
  });

  test("Encrypt Data Multiple", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    const dataToEncrypt = "Phoebe is cute!";

    // Act
    const results = await utils.createAESKey().andThen((encryptionKey) => {
      return ResultUtils.combine([
        utils.encryptString(dataToEncrypt, encryptionKey),
        utils.encryptString(dataToEncrypt, encryptionKey),
      ]);
    });

    // Assert
    expect(results).toBeDefined();
    expect(results.isErr()).toBeFalsy();

    const [encryption1, encryption2] = results._unsafeUnwrap();

    expect(encryption1.data.length).toBe(24);
    expect(encryption2.data.length).toBe(24);
    expect(encryption1.data).not.toBe(encryption2.data);
    expect(encryption1.initializationVector).not.toBe(
      encryption2.initializationVector,
    );
  });

  test("Encrypt UUID", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    const dataToEncrypt = "123e4567-e89b-12d3-a456-426614174000";

    // Act
    const results = await utils.createAESKey().andThen((encryptionKey) => {
      return utils.encryptString(dataToEncrypt, encryptionKey);
    });

    // Assert
    expect(results).toBeDefined();
    expect(results.isErr()).toBeFalsy();

    const encryption = results._unsafeUnwrap();

    expect(encryption.data.length).toBe(64);
    expect(encryption.initializationVector.length).toBe(16);
    console.log(encryption.initializationVector);
  });

  test("signMessage() Closed Loop", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    const dataToEncrypt = "Phoebe is cute!";

    // Act
    const privateKeyResult = await utils.createEthereumPrivateKey();
    const privateKey = privateKeyResult._unsafeUnwrap();
    const expectedAddress =
      utils.getEthereumAccountAddressFromPrivateKey(privateKey);
    const result = await utils
      .signMessage(dataToEncrypt, privateKey)
      .andThen((signature) => {
        return utils.verifySignature(dataToEncrypt, signature);
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const address = result._unsafeUnwrap();
    expect(address).toEqual(expectedAddress);
  });

  // test("Asymettric Test", async () => {
  // 	// Arrange
  // 	const mocks = new CryptoUtilsMocks();
  // 	const utils = mocks.factoryCryptoUtils();

  // 	const dataToEncrypt = "Phoebe is cute!";

  // 	// Act
  // 	await utils.generateKeyPair();

  // 	// Assert
  // 	// expect(result).toBeDefined();
  // 	// expect(result.isErr()).toBeFalsy();
  // 	// expect(result._unsafeUnwrap()).toEqual(dataToEncrypt);
  // });

  test("hashStringSHA256 Test", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    const message = "Phoebe is cute!";

    // Act
    const result1 = await utils.hashStringSHA256(message);
    const result2 = await utils.hashStringSHA256(message);

    // Assert
    expect(result1).toBeDefined();
    expect(result2).toBeDefined();
    expect(result1.isErr()).toBeFalsy();
    expect(result2.isErr()).toBeFalsy();
    const retHash1 = result1._unsafeUnwrap();
    const retHash2 = result2._unsafeUnwrap();
    expect(retHash1.length).toBe(44);
    expect(retHash2.length).toBe(44);
    expect(retHash2).toBe(retHash1);
  });

  test("hashStringArgon2 Test", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    const message = "Phoebe is cute!";

    // Act
    const result1 = await utils.hashStringArgon2(message);
    const result2 = await utils.hashStringArgon2(message);

    // Assert
    expect(result1).toBeDefined();
    expect(result2).toBeDefined();
    expect(result1.isErr()).toBeFalsy();
    expect(result2.isErr()).toBeFalsy();
    const retHash1 = result1._unsafeUnwrap();
    const retHash2 = result2._unsafeUnwrap();
    expect(retHash1.length).toBe(95);
    expect(retHash2.length).toBe(95);
    expect(retHash2).not.toBe(retHash1);
  });

  test("verifyHashArgon2 Test", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    const message = "Phoebe is cute!";

    // Act
    const result = await utils.hashStringArgon2(message).andThen((hash) => {
      return utils.verifyHashArgon2(hash, message);
    });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const verified = result._unsafeUnwrap();
    expect(verified).toBeTruthy();
  });
});
