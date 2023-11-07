import "reflect-metadata";
import {
  HexString,
  Signature,
  SolanaAccountAddress,
  SolanaPrivateKey,
  SuiAccountAddress,
} from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import * as tweetnacl from "tweetnacl"; // crypto lib for verify signature

import { CryptoUtilsMocks } from "../mocks/CryptoUtilsMocks";

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

  test("getTokenId returns a bigInt", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    // Act
    const result = await utils.getTokenId();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const tokenId = result._unsafeUnwrap();
    expect(tokenId).toBeGreaterThanOrEqual(0);
  });

  test("generated tokenId as a big number and call toNumber()", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    // Act
    const result = await utils.getTokenId();
    const tokenId = result._unsafeUnwrap();
    const bigNumber = BigNumber.from(tokenId);
    const tokenIdNumber = bigNumber.toNumber();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(typeof tokenIdNumber).toBe("number");
    expect(tokenId).toBeGreaterThanOrEqual(0);
  });

  test("generated tokenIds are unique", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();
    const quantity = 10;

    // Act
    const result = await utils.getTokenIds(quantity);
    const result2 = await utils.getTokenIds(-1);
    const tokenIdList = result._unsafeUnwrap();
    const tokenIdList2 = result2._unsafeUnwrap();
    const uniqueTokenIdList = [...new Set(tokenIdList)];

    // Assert
    expect(result).toBeDefined();
    expect(result2).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result2.isErr()).toBeFalsy();
    expect(tokenIdList2.length).toEqual(0);
    expect(uniqueTokenIdList.length).toEqual(quantity);
  });

  test("deriveAESKeyFromSignature returns 32 bytes as 44 characters of base64", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    const messageToSign = "Phoebe is cute!";

    // Act
    const privateKeyResult = await utils.createEthereumPrivateKey();
    const privateKey = privateKeyResult._unsafeUnwrap();
    const signatureResult = await utils.signMessage(messageToSign, privateKey);
    const signature = signatureResult._unsafeUnwrap();

    const result = await utils.deriveAESKeyFromSignature(
      signature,
      HexString("0x00123456789abcdf"),
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const key = result._unsafeUnwrap();
    expect(Buffer.from(key, "base64").toString("base64")).toBe(key);
    expect(Buffer.from(key, "base64").byteLength).toBe(32);
    expect(key.length).toBe(44);
  });

  test("deriveAESKeyFromString returns 32 bytes as 44 characters of base64", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    const password = "ThisIsAnOKPassword!";

    // Act
    const result = await utils.deriveAESKeyFromString(
      password,
      HexString("0x00123456789abcdf"),
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const key = result._unsafeUnwrap();
    expect(Buffer.from(key, "base64").toString("base64")).toBe(key);
    expect(Buffer.from(key, "base64").byteLength).toBe(32);
    expect(key.length).toBe(44);
    expect(key).toBe("naXUBGgZVRgBUlsSXaZ9+t59Y71O2V609Xjvp+o4gx0=");
  });

  test("deriveEVMPrivateKeyFromSignature returns 32 bytes as 64 characters of hex", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    const messageToSign = "Phoebe is cute!";

    // Act
    const privateKeyResult = await utils.createEthereumPrivateKey();
    const privateKey = privateKeyResult._unsafeUnwrap();
    const signatureResult = await utils.signMessage(messageToSign, privateKey);
    const signature = signatureResult._unsafeUnwrap();

    const result = await utils.deriveEVMPrivateKeyFromSignature(
      signature,
      HexString("0x00123456789abcdf"),
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const key = result._unsafeUnwrap();
    expect(Buffer.from(key, "hex").toString("hex")).toBe(key);
    expect(Buffer.from(key, "hex").byteLength).toBe(32);
    expect(key.length).toBe(64);
  });

  test("deriveEVMPrivateKeyFromSignature returns different keys for different signatures with same salt", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    // Act
    const result1 = await utils.deriveEVMPrivateKeyFromSignature(
      Signature(
        "0x8cc2c7e87610e4751b18ecea53ccbfb2dd8112206003ccda45f8cd356f57f30107c4cbc8f620d514cc4b8fe8182271547f41deed78d11ce86702907ae7e9cfc31c",
      ),
      HexString("0x14791697260E4c9A71f18484C9f997B308e59325"),
    );
    const result2 = await utils.deriveEVMPrivateKeyFromSignature(
      Signature(
        "0x3203ee912627f11d20cc9481cedf805053c66aff6c13c05c780a39c275b8dec0459b3a28355713d7a91a4c089b930248a1e78accd4c1aa96e2ab478bd19545df1c",
      ),
      HexString("0x14791697260E4c9A71f18484C9f997B308e59325"),
    );

    // Assert
    expect(result1).toBeDefined();
    expect(result2).toBeDefined();
    expect(result1.isErr()).toBeFalsy();
    expect(result2.isErr()).toBeFalsy();
    const key1 = result1._unsafeUnwrap();
    const key2 = result2._unsafeUnwrap();
    expect(Buffer.from(key1, "hex").toString("hex")).toBe(key1);
    expect(Buffer.from(key2, "hex").toString("hex")).toBe(key2);
    expect(Buffer.from(key1, "hex").byteLength).toBe(32);
    expect(Buffer.from(key2, "hex").byteLength).toBe(32);
    expect(key1.length).toBe(64);
    expect(key2.length).toBe(64);
    expect(key1).toBe(
      "e44867e4da30b5c651151ecebc673ced4b1ea968f00eef20cad78b30bfbe055b",
    );
    expect(key2).toBe(
      "91637233fcd3b0846085ca62aa85685b4c0d31b2efe66871dd9412239523bf17",
    );
    expect(key1 == key2).toBeFalsy();
  });

  test("deriveEVMPrivateKeyFromSignature returns different keys for same signatures with different salt", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    // Act
    const result1 = await utils.deriveEVMPrivateKeyFromSignature(
      Signature(
        "0x8cc2c7e87610e4751b18ecea53ccbfb2dd8112206003ccda45f8cd356f57f30107c4cbc8f620d514cc4b8fe8182271547f41deed78d11ce86702907ae7e9cfc31c",
      ),
      HexString("0x14791697260E4c9A71f18484C9f997B308e59325"),
    );
    const result2 = await utils.deriveEVMPrivateKeyFromSignature(
      Signature(
        "0x8cc2c7e87610e4751b18ecea53ccbfb2dd8112206003ccda45f8cd356f57f30107c4cbc8f620d514cc4b8fe8182271547f41deed78d11ce86702907ae7e9cfc31c",
      ),
      HexString("0x2e988A386a799F506693793c6A5AF6B54dfAaBfB"),
    );

    // Assert
    expect(result1).toBeDefined();
    expect(result2).toBeDefined();
    expect(result1.isErr()).toBeFalsy();
    expect(result2.isErr()).toBeFalsy();
    const key1 = result1._unsafeUnwrap();
    const key2 = result2._unsafeUnwrap();
    expect(Buffer.from(key1, "hex").toString("hex")).toBe(key1);
    expect(Buffer.from(key2, "hex").toString("hex")).toBe(key2);
    expect(Buffer.from(key1, "hex").byteLength).toBe(32);
    expect(Buffer.from(key2, "hex").byteLength).toBe(32);
    expect(key1.length).toBe(64);
    expect(key2.length).toBe(64);
    expect(key1).toBe(
      "e44867e4da30b5c651151ecebc673ced4b1ea968f00eef20cad78b30bfbe055b",
    );
    expect(key2).toBe(
      "275c2fe82846ef0d3bef46c8cbee9d71a635f9344ae7e766c4e6fb971fde4614",
    );
    expect(key1 == key2).toBeFalsy();
  });

  test("deriveEVMPrivateKeyFromString returns 32 bytes as 64 characters of hex", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    const testPhrase = "Phoebe is cute!";

    // Act
    const result1 = await utils.deriveEVMPrivateKeyFromString(
      testPhrase,
      HexString("0x00123456789abcdf"),
    );
    const result2 = await utils.deriveEVMPrivateKeyFromString(
      testPhrase,
      HexString("00123456789abcdf"),
    );

    // Assert
    expect(result1).toBeDefined();
    expect(result2).toBeDefined();
    expect(result1.isErr()).toBeFalsy();
    expect(result2.isErr()).toBeFalsy();
    const key1 = result1._unsafeUnwrap();
    const key2 = result2._unsafeUnwrap();
    expect(key1).toBe(key2);
    expect(key1.length).toBe(64);
    expect(key1).toBe(
      "d56dd3dbdb48797b0668ae3a9ab3c8044bd2061193779a5e70938e7b27c043b8",
    );
  });

  test("createRSAKeyPair returns 2 PEM encoded keys", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    // Act
    const result = await utils.createRSAKeyPair();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const keyPair = result._unsafeUnwrap();
    // I have no way to validate the key is anything
    expect(keyPair.privateKey).toBeDefined();
    expect(keyPair.publicKey).toBeDefined();
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
  });

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
    expect(retHash1).toBe("g79Vva7gDafnYCFQPSx8pSaVgmsPqFPs2YzrbqqHwkY=");
  });

  // test("hashStringArgon2 Test", async () => {
  //   // Arrange
  //   const mocks = new CryptoUtilsMocks();
  //   const utils = mocks.factoryCryptoUtils();

  //   const message = "Phoebe is cute!";

  //   // Act
  //   const result1 = await utils.hashStringArgon2(message);
  //   const result2 = await utils.hashStringArgon2(message);

  //   // Assert
  //   expect(result1).toBeDefined();
  //   expect(result2).toBeDefined();
  //   expect(result1.isErr()).toBeFalsy();
  //   expect(result2.isErr()).toBeFalsy();
  //   const retHash1 = result1._unsafeUnwrap();
  //   const retHash2 = result2._unsafeUnwrap();
  //   expect(retHash1.length).toBe(96);
  //   expect(retHash2.length).toBe(96);
  //   expect(retHash2).not.toBe(retHash1);
  // });

  // test("verifyHashArgon2 Test", async () => {
  //   // Arrange
  //   const mocks = new CryptoUtilsMocks();
  //   const utils = mocks.factoryCryptoUtils();

  //   const message = "Phoebe is cute!";

  //   // Act
  //   const result = await utils.hashStringArgon2(message).andThen((hash) => {
  //     return utils.verifyHashArgon2(hash, message);
  //   });

  //   // Assert
  //   expect(result).toBeDefined();
  //   expect(result.isErr()).toBeFalsy();
  //   const verified = result._unsafeUnwrap();
  //   expect(verified).toBeTruthy();
  // });

  test("verifySolanaSignature() works", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    // This signature was generated from an account with this public key
    const solanaPublicKey = SolanaAccountAddress(
      "FbthzRMmwWRyCD2q3NRbCTcmAPsbRn6Q3QYJC3yPd2ne",
    );
    const solanaSignature = Signature(
      "8f6d2d8b7844e881c5eadb3901afc0ee35060a0cafac4209c629bae112d9f3b7bf5447becd615d95350f56beef391a755af80ba4f45883f0084242c7f63e8e04",
    );
    const message = "Phoebe is cute";

    // Act
    const result = await utils.verifySolanaSignature(
      message,
      solanaSignature,
      solanaPublicKey,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const verified = result._unsafeUnwrap();
    expect(verified).toBeTruthy();
  });

  test("verifySuiSignature() works", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();
    // This signature was generated from an account with this public key
    const message = "Hello world!";
    const publicKey = Uint8Array.from([
      34, 75, 176, 247, 2, 153, 208, 222, 185, 81, 23, 152, 29, 41, 93, 221,
      238, 219, 246, 153, 103, 41, 27, 116, 229, 75, 24, 77, 21, 77, 116, 31,
    ]);
    const signature = Signature(
      "ADmKQDG8f1BQfTDqxryx64ok0Bvkd4z3Q8VZ+sfn8aeK7F/toAJKW4FsNMytXyjDAIxcXLDV7o+xHtEcKplcLQwiS7D3ApnQ3rlRF5gdKV3d7tv2mWcpG3TlSxhNFU10Hw==",
    );
    const suiAddress = SuiAccountAddress(
      "0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7",
    );
    const suiBoolean = await utils.verifySuiSignature(
      message,
      signature,
      suiAddress,
    );

    // Assert
    expect(suiBoolean).toBeDefined();
    expect(suiBoolean.isErr()).toBeFalsy();
    const verified = suiBoolean._unsafeUnwrap();
    expect(verified).toBeTruthy();
  });

  test("verifySuiSignature() works 2", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();
    // This signature was generated from an account with this public key
    const message = "Login to your Snickerdoodle data wallet";
    const signature = Signature(
      "AGCDOOLal8ZejRXfhip5mEoOoElMWd1MacHddfUFIyRccognoDyn3f59/t0RdOZWhy8lwT8pUZAjUOGnwFW5wgs72m7ls1stD7EvAaQn1xlIFUxjxEAUIK8Qa94YHeTsfw==",
    );
    const suiAddress = SuiAccountAddress(
      "0x8e57702fd50b946b951333f996dab16fc04c1df05ab781a0370f836e7f7988d0",
    );
    const suiBoolean = await utils.verifySuiSignature(
      message,
      signature,
      suiAddress,
    );

    // Assert
    expect(suiBoolean).toBeDefined();
    expect(suiBoolean.isErr()).toBeFalsy();
    const verified = suiBoolean._unsafeUnwrap();
    expect(verified).toBeTruthy();
  });

  test("verifySuiSignature() wrong message", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    const message = "Hello world2!";
    const signature = Signature(
      "ADmKQDG8f1BQfTDqxryx64ok0Bvkd4z3Q8VZ+sfn8aeK7F/toAJKW4FsNMytXyjDAIxcXLDV7o+xHtEcKplcLQwiS7D3ApnQ3rlRF5gdKV3d7tv2mWcpG3TlSxhNFU10Hw==",
    );
    const suiAddress = SuiAccountAddress(
      "0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7",
    );
    const suiBoolean = await utils.verifySuiSignature(
      message,
      signature,
      suiAddress,
    );

    // Assert
    expect(suiBoolean).toBeDefined();
    expect(suiBoolean.isErr()).toBeFalsy();
    const verified = suiBoolean._unsafeUnwrap();
    expect(verified).toBeFalsy();
  });

  test("verifySuiSignature() wrong signature", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();
    const message = "Hello world!";

    // Changed "e" to "f" in signature portion
    // SUI signatures are 97 byes- 1 for scheme, 64 for sig, 32 for the public key
    const signature = Signature(
      "ADmKQDG8f1BQfTDqxryx64ok0Bvkd4z3Q8VZ+sfn8afK7F/toAJKW4FsNMytXyjDAIxcXLDV7o+xHtEcKplcLQwiS7D3ApnQ3rlRF5gdKV3d7tv2mWcpG3TlSxhNFU10Hw==",
    );
    const suiAddress = SuiAccountAddress(
      "0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7",
    );
    const suiBoolean = await utils.verifySuiSignature(
      message,
      signature,
      suiAddress,
    );

    // Assert
    expect(suiBoolean).toBeDefined();
    expect(suiBoolean.isErr()).toBeFalsy();
    const verified = suiBoolean._unsafeUnwrap();
    expect(verified).toBeFalsy();
  });

  test("signMessageSolana() works", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    // This signature was generated from an account with this public key
    const privateKey = SolanaPrivateKey(
      "3UVXV4k4zErpzsjQLsJR3Ee1x1RJgZptbZrGuVZxribdhJvKGbkbGBzWD8b8ZYwjLDrcTJJdYwKX7Z7TDapnvhKG",
    );
    const message = "Phoebe is cute";

    // Act
    const result = await utils.signMessageSolana(message, privateKey);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const signature = result._unsafeUnwrap();
    expect(signature).toBe(
      Signature(
        "8f6d2d8b7844e881c5eadb3901afc0ee35060a0cafac4209c629bae112d9f3b7bf5447becd615d95350f56beef391a755af80ba4f45883f0084242c7f63e8e04",
      ),
    );
  });
});
