import "reflect-metadata";
import { CryptoUtils } from "@snickerdoodlelabs/node-utils";
import {
  BigNumberString,
  Commitment,
  EVMContractAddress,
  EVMPrivateKey,
  NullifierBNS,
  OptInInfo,
  PasswordString,
  TrapdoorBNS,
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
  test("deriveOptInInfo() returns different addresses for different accounts", async () => {
    // Arrange
    const mocks = new DataWalletUtilsMocks();
    const utils = mocks.factory();

    // Act
    const result1 = await utils.deriveOptInInfo(
      consentContractAddress1,
      privateKey,
    );
    const result2 = await utils.deriveOptInInfo(
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
    expect(newAccount1).toMatchObject(
      new OptInInfo(
        consentContractAddress1,
        NullifierBNS(
          "7066702639326327399116150719347482337210454460800740786909897573924607370079",
        ),
        TrapdoorBNS(
          "8315784282536975342493907777441634328941392618163062367656237203700098465750",
        ),
        Commitment(
          21233153495375348882760896874209823339766656559746404449151412061447979628219n,
        ),
      ),
    );
    expect(newAccount2).toMatchObject(
      new OptInInfo(
        consentContractAddress2,
        NullifierBNS(
          "19235884486051724882735247669412121980748313938340939246158589548549615842061",
        ),
        TrapdoorBNS(
          "6360521399899726056335867173507539295634314673568141049107614100094174500676",
        ),
        Commitment(
          21261097953629989912975858573121778396540198401745873951508822848858265883452n,
        ),
      ),
    );
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
      "0x8ed53fb062a2285cb9726c4961a6bbdc6aa6fca9",
    );
    expect(eoa2.privateKey).toBe(
      "f3ae4787d9545528065d0a63c82159581ac8ef073c5aba177a9c82299a586511",
    );
    expect(eoa2.accountAddress).toBe(
      "0xb717c7dc8a1576c77c05703885584c23f2d45440",
    );
  });
});
