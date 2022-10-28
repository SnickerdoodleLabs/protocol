import "reflect-metadata";
import { CryptoUtils } from "@snickerdoodlelabs/common-utils";
import { EVMContractAddress, EVMPrivateKey } from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";
import * as td from "testdouble";

import { DataWalletUtils } from "@core/implementations/utilities/index.js";
import { IDataWalletUtils } from "@core/interfaces/utilities/index.js";

const consentContractAddress1 = EVMContractAddress(
  "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
);
const consentContractAddress2 = EVMContractAddress(
  "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e1",
);
const privateKey = EVMPrivateKey(
  "e44867e4da30b5c651151ecebc673ced4b1ea968f00eef20cad78b30bfbe055b",
);

class DataWalletUtilsMocks {
  // Not actually mocking CryptoUtils, intentionally! I want to make sure all the inputs work as expected
  public cryptoUtils = new CryptoUtils();

  constructor() {}

  public factory(): IDataWalletUtils {
    return new DataWalletUtils(this.cryptoUtils);
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
});
