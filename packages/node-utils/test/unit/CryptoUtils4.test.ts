import "reflect-metadata";
import {
  P256PublicKeyComponent,
  P256SignatureComponentArrayBuffer,
  PasskeyId,
  PasskeyPublicKeyPointX,
  PasskeyPublicKeyPointY,
} from "@snickerdoodlelabs/objects";

import { CryptoUtilsMocks } from "../mocks/CryptoUtilsMocks";

// The mock values in this unit test were generated from the P256 proof of concept repo : https://github.com/TtheBC01/P256-Solidity/blob/main/index.html
// Most of the values are handled in ArrayBuffer format, so they are converted to Uint8Array for these mock values.

describe("CryptoUtils Tests 4", () => {
  test("parseRawPublicKey() Closed Loop", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    const mockKeyId = PasskeyId("M-hfHIx9Cpy-L9PhhyzBiqluYXAvmM7FmHsY8TEAGPQ");

    const mockPublicKey = new Uint8Array([
      48, 89, 48, 19, 6, 7, 42, 134, 72, 206, 61, 2, 1, 6, 8, 42, 134, 72, 206,
      61, 3, 1, 7, 3, 66, 0, 4, 89, 149, 49, 242, 216, 236, 98, 182, 17, 253,
      144, 223, 87, 42, 97, 46, 97, 13, 36, 33, 175, 143, 156, 105, 136, 211,
      139, 148, 207, 61, 159, 28, 39, 244, 43, 195, 226, 56, 56, 180, 205, 199,
      250, 204, 23, 94, 181, 21, 25, 206, 240, 187, 242, 38, 255, 103, 160, 8,
      245, 177, 199, 206, 162, 39,
    ]);

    // Act
    const result = await utils.parseRawPublicKey(mockKeyId, mockPublicKey);

    const expectedParsedPublicKey = new P256PublicKeyComponent(
      PasskeyPublicKeyPointX(
        "0x599531f2d8ec62b611fd90df572a612e610d2421af8f9c6988d38b94cf3d9f1c",
      ),
      PasskeyPublicKeyPointY(
        "0x27f42bc3e23838b4cdc7facc175eb51519cef0bbf226ff67a008f5b1c7cea227",
      ),
      mockKeyId,
    );

    console.log("result", result);
    // Assert
    expect(result).toEqual(expectedParsedPublicKey);
  });
});

describe("CryptoUtils Tests 4", () => {
  test("parseRawP256Signature() Closed Loop", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    const mockSignature = new Uint8Array([
      48, 69, 2, 32, 14, 27, 112, 251, 186, 180, 8, 55, 226, 184, 231, 66, 147,
      175, 60, 167, 109, 24, 41, 45, 121, 89, 59, 32, 196, 41, 207, 150, 77, 75,
      45, 83, 2, 33, 0, 226, 39, 224, 126, 172, 254, 233, 54, 107, 161, 26, 138,
      31, 110, 197, 103, 194, 3, 1, 44, 58, 255, 82, 175, 220, 80, 29, 139, 21,
      137, 114, 60,
    ]);
    const mockMsgPayload = `authenticatorData: 0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000, clientJSONData: "{\"type\":\"webauthn.get\",\"challenge\":\"SkgtbmpSNGs4TUw3T3k3LUxsVUZtQeCNdoJu1unwpgzfenUVeSFuX221IEmGHVYEGrQ0G5A3l1CPrqa6jtHx3a4SdKeJxGRgaH2ChCnqOjcfmd6TiLc\",\"origin\":\"http://localhost:8000\",\"crossOrigin\":false,\"other_keys_can_be_added_here\":\"do not compare clientDataJSON against a template. See https://goo.gl/yabPex\"}",`;

    const expectedParsedSignature = P256SignatureComponentArrayBuffer(
      new Uint8Array([
        14, 27, 112, 251, 186, 180, 8, 55, 226, 184, 231, 66, 147, 175, 60, 167,
        109, 24, 41, 45, 121, 89, 59, 32, 196, 41, 207, 150, 77, 75, 45, 83,
        226, 39, 224, 126, 172, 254, 233, 54, 107, 161, 26, 138, 31, 110, 197,
        103, 194, 3, 1, 44, 58, 255, 82, 175, 220, 80, 29, 139, 21, 137, 114,
        60,
      ]).buffer,
    );

    // Act
    const result = await utils.parseRawP256Signature(
      mockSignature,
      mockMsgPayload,
    );

    // Assert
    expect(result).toEqual(expectedParsedSignature);
  });
});
