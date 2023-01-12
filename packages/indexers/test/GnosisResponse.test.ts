import "reflect-metadata";
import {
  HexString,
  Signature,
  SolanaAccountAddress,
  SolanaPrivateKey,
} from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";
import { ResultUtils } from "neverthrow-result-utils";

// import { GnosisResponse } from "../test/mock/GnosisReponse";

describe("Gnosis tests", () => {
  test("getNonce returns 64 characters of base64", async () => {
    // Arrange
    // const mocks = new CryptoUtilsMocks();
    // const utils = mocks.factoryCryptoUtils();

    // // Act
    // const result = await utils.getNonce();

    // // Assert
    // expect(result).toBeDefined();
    // expect(result.isErr()).toBeFalsy();
    // const nonce = result._unsafeUnwrap();
    // expect(Buffer.from(nonce, "base64").toString("base64")).toBe(nonce);
    // expect(Buffer.from(nonce, "base64").byteLength).toBe(48);
    // expect(nonce.length).toBe(64);
  });
});
