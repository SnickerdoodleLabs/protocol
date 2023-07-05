import "reflect-metadata";
import { CryptoUtils } from "@snickerdoodlelabs/common-utils";
import {
  EVMContractAddress,
  EVMPrivateKey,
  PasswordString,
} from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";
import * as td from "testdouble";

import { DataWalletUtils } from "@core/implementations/utilities/index.js";
import { IDataWalletUtils } from "@core/interfaces/utilities/index.js";
import { ConfigProviderMock } from "@core-tests/mock/utilities/index.js";

const consentContractAddress1 = EVMContractAddress(
  "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
);
const consentContractAddress2 = EVMContractAddress(
  "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e1",
);
const privateKey = EVMPrivateKey(
  "e44867e4da30b5c651151ecebc673ced4b1ea968f00eef20cad78b30bfbe055b",
);
const testPassword = PasswordString("test password");
const testPassword2 = PasswordString("test password 2");

class DataWalletUtilsMocks {
  // Not actually mocking CryptoUtils, intentionally! I want to make sure all the inputs work as expected
  public configProvider = new ConfigProviderMock();
  public cryptoUtils = new CryptoUtils();

  constructor() {}

  public factory(): IDataWalletUtils {
    return new DataWalletUtils(this.configProvider, this.cryptoUtils);
  }
}

describe("DataWalletUtils tests", () => {
  test("deriveOptInPrivateKey() returns different keys for different accounts", async () => {
    // Arrange
    const mocks = new DataWalletUtilsMocks();
    const utils = mocks.factory();

    // Act
    const result1 = await utils.deriveOptInPrivateKey(
      consentContractAddress1,
      privateKey,
    );
    const result2 = await utils.deriveOptInPrivateKey(
      consentContractAddress2,
      privateKey,
    );

    // Assert
    expect(result1).toBeDefined();
    expect(result2).toBeDefined();
    expect(result1.isErr()).toBeFalsy();
    expect(result2.isErr()).toBeFalsy();
    const newAccount1 = result1._unsafeUnwrap();
    const newAccount2 = result2._unsafeUnwrap();
    expect(newAccount1).toBe(
      "5241a20eeb3faf27978ab43c2c6ea55db0bd9e4011f1858565747adb79fe8bf6",
    );
    expect(newAccount2).toBe(
      "aa33ec9fbf37cb3176a9ebe7e4a37b83615d12257504c293149127558c825aaa",
    );
  });

  test("deriveOptInAccountAddress() returns different addresses for different accounts", async () => {
    // Arrange
    const mocks = new DataWalletUtilsMocks();
    const utils = mocks.factory();

    // Act
    const result1 = await utils.deriveOptInAccountAddress(
      consentContractAddress1,
      privateKey,
    );
    const result2 = await utils.deriveOptInAccountAddress(
      consentContractAddress2,
      privateKey,
    );

    // Assert
    expect(result1).toBeDefined();
    expect(result2).toBeDefined();
    expect(result1.isErr()).toBeFalsy();
    expect(result2.isErr()).toBeFalsy();
    const newAccount1 = result1._unsafeUnwrap();
    const newAccount2 = result2._unsafeUnwrap();
    expect(newAccount1).toBe("0x417643fBD5D41dB241d29C684Ba9bf46499FA21e");
    expect(newAccount2).toBe("0x67b7a6dD90a0d0eE405646771141a07F451B1256");
  });

  test("deriveEncryptionKeyFromPassword works", async () => {
    // Arrange
    const mocks = new DataWalletUtilsMocks();
    const repo = mocks.factory();

    // Act
    const result1 = await repo.deriveEncryptionKeyFromPassword(testPassword);
    const result2 = await repo.deriveEncryptionKeyFromPassword(testPassword2);

    // Assert
    expect(result1).toBeDefined();
    expect(result2).toBeDefined();
    expect(result1.isOk()).toBeTruthy();
    expect(result2.isOk()).toBeTruthy();
    const key1 = result1._unsafeUnwrap();
    const key2 = result2._unsafeUnwrap();
    expect(key1).toBe("BTEreDYNEkrYCFdbby6W2cYRsZrlj2HrW2mBMZ8zbu8=");
    expect(key2).toBe("865Hh9lUVSgGXQpjyCFZWBrI7wc8WroXepyCKZpYZRE=");
    expect(key1).not.toBe(key2);
  });

  test("getDerivedEVMAccountFromPassword works", async () => {
    // Arrange
    const mocks = new DataWalletUtilsMocks();
    const repo = mocks.factory();

    // Act
    const result1 = await repo.getDerivedEVMAccountFromPassword(testPassword);
    const result2 = await repo.getDerivedEVMAccountFromPassword(testPassword2);

    // Assert
    expect(result1).toBeDefined();
    expect(result2).toBeDefined();
    expect(result1.isOk()).toBeTruthy();
    expect(result2.isOk()).toBeTruthy();
    const eoa1 = result1._unsafeUnwrap();
    const eoa2 = result2._unsafeUnwrap();
    expect(eoa1.privateKey).not.toBe(eoa2.privateKey);
    expect(eoa1.accountAddress).not.toBe(eoa2.accountAddress);
    expect(eoa1.privateKey).toBe(
      "05312b78360d124ad808575b6f2e96d9c611b19ae58f61eb5b6981319f336eef",
    );
    expect(eoa1.accountAddress).toBe(
      "0x8eD53fb062a2285CB9726c4961a6BBDC6aA6FCA9",
    );
    expect(eoa2.privateKey).toBe(
      "f3ae4787d9545528065d0a63c82159581ac8ef073c5aba177a9c82299a586511",
    );
    expect(eoa2.accountAddress).toBe(
      "0xb717C7DC8a1576c77C05703885584c23f2d45440",
    );
  });
});
