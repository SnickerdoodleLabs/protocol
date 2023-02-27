import "reflect-metadata";
import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import { EVMAccountAddress, HexString } from "@snickerdoodlelabs/objects";
import { BigNumber, ethers } from "ethers";

import { CryptoUtilsMocks } from "../mocks/CryptoUtilsMocks";

describe("CryptoUtils tests", () => {
  test("getSignature() Closed Loop", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();
    const testBigInt = BigNumber.from(69);
    const types = ["address", "uint256"];
    const testAddress = EVMAccountAddress(
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    );

    // Act
    const privateKeyResult = await utils.createEthereumPrivateKey();
    const privateKey = privateKeyResult._unsafeUnwrap();
    const wallet = new ethers.Wallet(privateKey);
    const values = [testAddress, testBigInt];
    const msgHash = ethers.utils.solidityKeccak256([...types], [...values]);

    const expectedAddress =
      utils.getEthereumAccountAddressFromPrivateKey(privateKey);
    const result = await utils.getSignature(wallet, types, values);
    const signature = result._unsafeUnwrap();
    const address = ethers.utils.verifyMessage(
      ethers.utils.arrayify(msgHash),
      signature,
    );
    const result2 = await utils.getSignature(wallet, [], values);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result2.isErr()).toBeTruthy();
    expect(address).toEqual(expectedAddress);
  });

  test("signTypedData<>verifyTypedData Closed Loop", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    const testDomain = {
      name: "Test Domain",
      version: "1",
    } as TypedDataDomain;

    const testTypes: Record<string, TypedDataField[]> = {
      // I am not sure but so far this key doesn't actually matter.
      // You can not have multiple keys though, I just tested that, you get
      // "ambiguous primary types or unused types" error. So call it whatever you want, but you
      // only have 1.
      TestData: [
        { name: "testAddress", type: "address" },
        { name: "testString", type: "string" },
        { name: "testBigInt", type: "uint256" },
        { name: "testBytes", type: "bytes" },
      ],
    };

    // Act
    const privateKeyResult = await utils.createEthereumPrivateKey();
    const privateKey = privateKeyResult._unsafeUnwrap();
    const expectedAddress =
      utils.getEthereumAccountAddressFromPrivateKey(privateKey);

    const valueToSign = {
      testAddress: EVMAccountAddress(
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      ),
      testString: "Phoebe is cute",
      testBigInt: BigNumber.from(69),
      testBytes: HexString("0x0123456789ABCDEF"),
    };

    const result = await utils
      .signTypedData(testDomain, testTypes, valueToSign, privateKey)
      .andThen((signature) => {
        return utils.verifyTypedData(
          testDomain,
          testTypes,
          valueToSign,
          signature,
        );
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
});
