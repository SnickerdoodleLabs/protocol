import "reflect-metadata";
import {
  EVMPrivateKey,
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

describe("CryptoUtils4 tests", () => {
  test("Andrew's test", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    // Act
    const messageToSign = "Testing Space and Time!";
    const privateKey = EVMPrivateKey(
      "a35JJjDhLqFuHWqnbxseTHEU99BFAa3CApIFjbWBQ3E=",
    );
    const result = await utils.signMessage(
      messageToSign,
      privateKey,
      messageToSign,
    );

    console.log("result: " + result);
    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const key = result._unsafeUnwrap();
    expect(Buffer.from(key, "hex").toString("hex")).toBe(key);
    expect(Buffer.from(key, "hex").byteLength).toBe(32);
    expect(key.length).toBe(64);
  });
});
