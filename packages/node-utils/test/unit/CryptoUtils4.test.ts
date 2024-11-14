import "reflect-metadata";
import { base64 } from "@hexagon/base64";
import {
  P256SignatureComponentArrayBuffer,
  P256PublicKeyPointX,
  P256PublicKeyPointY,
  P256PublicKey,
  P256Signature,
  JSONString,
} from "@snickerdoodlelabs/objects";
import e from "cors";

import { CryptoUtilsMocks } from "../mocks/CryptoUtilsMocks";

// The mock values in this unit test were generated from the P256 proof of concept repo : https://github.com/TtheBC01/P256-Solidity/blob/main/index.html
// Most of the values are handled in ArrayBuffer format, so they are converted to Uint8Array for these mock values.

describe("CryptoUtils Tests 4", () => {
  test("parseRawPublicKey() Closed Loop", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    const mockPublicKey = P256PublicKey(
      "3059301306072a8648ce3d020106082a8648ce3d03010703420004599531f2d8ec62b611fd90df572a612e610d2421af8f9c6988d38b94cf3d9f1c27f42bc3e23838b4cdc7facc175eb51519cef0bbf226ff67a008f5b1c7cea227",
    );

    const webAuthnPublicKey = P256PublicKey(
      "0004599531f2d8ec62b611fd90df572a612e610d2421af8f9c6988d38b94cf3d9f1c27f42bc3e23838b4cdc7facc175eb51519cef0bbf226ff67a008f5b1c7cea227",
    );

    // Act
    const defaultValue = {
      x: P256PublicKeyPointX("0x0"),
      y: P256PublicKeyPointY("0x0"),
    };

    const result = utils
      .parseRawP256PublicKey(webAuthnPublicKey)
      .unwrapOr(defaultValue);

    const expectedParsedPublicKey = {
      x: P256PublicKeyPointX(
        "0x599531f2d8ec62b611fd90df572a612e610d2421af8f9c6988d38b94cf3d9f1c",
      ),
      y: P256PublicKeyPointY(
        "0x27f42bc3e23838b4cdc7facc175eb51519cef0bbf226ff67a008f5b1c7cea227",
      ),
    };

    // Assert
    expect(result).toEqual(expectedParsedPublicKey);
  });

  test("parseRawPublicKey() Closed Loop with WebAuth public key", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    // Other formats of the pubkey
    // const mockPublicKeyUint8Array = new Uint8Array([
    //   48, 89, 48, 19, 6, 7, 42, 134, 72, 206, 61, 2, 1, 6, 8, 42, 134, 72, 206,
    //   61, 3, 1, 7, 3, 66, 0, 4, 143, 31, 116, 17, 158, 142, 255, 163, 237, 17,
    //   34, 234, 9, 164, 127, 199, 210, 151, 33, 206, 139, 54, 247, 23, 25, 139,
    //   116, 244, 110, 169, 214, 78, 112, 104, 19, 48, 232, 51, 174, 40, 223, 30,
    //   243, 157, 69, 164, 221, 187, 60, 84, 134, 233, 126, 250, 2, 182, 244, 46,
    //   79, 209, 196, 128, 240, 208,
    // ]);

    // const mockPublicKey = P256PublicKey(
    //   "3059301306072a8648ce3d020106082a8648ce3d030107034200048f1f74119e8effa3ed1122ea09a47fc7d29721ce8b36f717198b74f46ea9d64e70681330e833ae28df1ef39d45a4ddbb3c5486e97efa02b6f42e4fd1c480f0d0",
    // );

    const webAuthnPublicKey = P256PublicKey(
      "0004e9472e04f0d697ca205f3af3c49502e9a3caf3cd17ce20d9a89282911cfcafc30bbfc34ded27460c504b0d3fd3523e38336748845f4810ef6ae6059c98ad6ce1",
    );

    // Act
    const defaultValue = {
      x: P256PublicKeyPointX("0x0"),
      y: P256PublicKeyPointY("0x0"),
    };

    const result = await utils
      .parseRawP256PublicKey(webAuthnPublicKey)
      .unwrapOr(defaultValue);

    const expectedParsedPublicKey = {
      x: P256PublicKeyPointX(
        "0xe9472e04f0d697ca205f3af3c49502e9a3caf3cd17ce20d9a89282911cfcafc3",
      ),
      y: P256PublicKeyPointY(
        "0x0bbfc34ded27460c504b0d3fd3523e38336748845f4810ef6ae6059c98ad6ce1",
      ),
    };

    // Assert
    expect(result).toEqual(expectedParsedPublicKey);
  });

  test("parseRawP256Signature() Closed Loop", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    const mockSignature = P256Signature(
      "304502202ae4188c4bf694fa309f6d05145408b57744fa7edfadfa120143f82c8887dd45022100a3009ac7d91a9945a454011ec4e5c568a5b20727e3fc8b804142fda1d918f289",
    );

    // const mockSignature = [
    //   48, 69, 2, 32, 42, 228, 24, 140, 75, 246, 148, 250, 48, 159, 109, 5, 20,
    //   84, 8, 181, 119, 68, 250, 126, 223, 173, 250, 18, 1, 67, 248, 44, 136,
    //   135, 221, 69, 2, 33, 0, 163, 0, 154, 199, 217, 26, 153, 69, 164, 84, 1,
    //   30, 196, 229, 197, 104, 165, 178, 7, 39, 227, 252, 139, 128, 65, 66, 253,
    //   161, 217, 24, 242, 137,
    // ];

    // new Uint8Array([
    //   48, 69, 2, 32, 14, 27, 112, 251, 186, 180, 8, 55, 226, 184, 231, 66, 147,
    //   175, 60, 167, 109, 24, 41, 45, 121, 89, 59, 32, 196, 41, 207, 150, 77, 75,
    //   45, 83, 2, 33, 0, 226, 39, 224, 126, 172, 254, 233, 54, 107, 161, 26, 138,
    //   31, 110, 197, 103, 194, 3, 1, 44, 58, 255, 82, 175, 220, 80, 29, 139, 21,
    //   137, 114, 60,
    // ]);
    const expectedValue = {
      r: "2ae4188c4bf694fa309f6d05145408b57744fa7edfadfa120143f82c8887dd45",
      s: "a3009ac7d91a9945a454011ec4e5c568a5b20727e3fc8b804142fda1d918f289",
    };

    const defaultValue = {
      r: "",
      s: "",
    };

    // Act
    const result = utils
      .parseRawP256Signature(mockSignature)
      .unwrapOr(defaultValue);

    // Assert
    expect(result.r).toEqual(expectedValue.r);
    expect(result.s).toEqual(expectedValue.s);
  });

  test("parseClientDataJSON() Closed Loop", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    const mockSignature = P256Signature(
      "304502200e1b70fbbab40837e2b8e74293af3ca76d18292d79593b20c429cf964d4b2d53022100e227e07eacfee9366ba11a8a1f6ec567c203012c3aff52afdc501d8b1589723c",
    );

    const mockClientDataJSON = JSONString(
      `{"type":"webauthn.get","challenge":"SkgtbmpSNGs4TUw3T3k3LUxsVUZtQeCNdoJu1unwpgzfenUVeSFuX221IEmGHVYEGrQ0G5A3l1CPrqa6jtHx3a4SdKeJxGRgaH2ChCnqOjcfmd6TiLc","origin":"http://localhost:8000","crossOrigin":false}`,
    );

    const expectedParsedClientJSONData = {
      challenge:
        "SkgtbmpSNGs4TUw3T3k3LUxsVUZtQeCNdoJu1unwpgzfenUVeSFuX221IEmGHVYEGrQ0G5A3l1CPrqa6jtHx3a4SdKeJxGRgaH2ChCnqOjcfmd6TiLc",
      clientDataJSONLeft: `{"type":"webauthn.get","challenge":"`,
      clientDataJSONRight: `","origin":"http://localhost:8000","crossOrigin":false}`,
    };

    // Act
    const defaultValue = {
      challenge: "",
      clientDataJSONLeft: "",
      clientDataJSONRight: "",
    };

    const result = utils
      .parseClientDataJSON(mockClientDataJSON)
      .unwrapOr(defaultValue);

    // Assert
    expect(result.clientDataJSONLeft).toEqual(
      expectedParsedClientJSONData.clientDataJSONLeft,
    );
    expect(result.clientDataJSONRight).toEqual(
      expectedParsedClientJSONData.clientDataJSONRight,
    );
    expect(result.challenge).toEqual(expectedParsedClientJSONData.challenge);
  });

  test("testing UTF 8 encoding() Closed Loop", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    const randomUint8 = new Uint8Array([
      48, 69, 2, 32, 42, 228, 24, 140, 75, 246, 148, 250, 48, 159, 109, 5, 20,
      84, 8, 181, 119, 68, 250, 126, 223, 173, 250, 18, 1, 67, 248, 44, 136,
      135, 221, 69, 2, 33, 0, 163, 0, 154, 199, 217, 26, 153, 69, 164, 84, 1,
      30, 196, 229, 197, 104, 165, 178, 7, 39, 227, 252, 139, 128, 65, 66, 253,
      161, 217, 24, 242, 137,
    ]);

    // our return value
    const base64URLString = isoBase64fromBuffer(randomUint8);

    const restoredRandomUint8 = base64URLStringToBuffer(base64URLString);

    expect(randomUint8.buffer).toEqual(restoredRandomUint8);
  });
});

function base64URLStringToBuffer(base64URLString: string): ArrayBuffer {
  // Convert from Base64URL to Base64
  const base64 = base64URLString.replace(/-/g, "+").replace(/_/g, "/");
  /**
   * Pad with '=' until it's a multiple of four
   * (4 - (85 % 4 = 1) = 3) % 4 = 3 padding
   * (4 - (86 % 4 = 2) = 2) % 4 = 2 padding
   * (4 - (87 % 4 = 3) = 1) % 4 = 1 padding
   * (4 - (88 % 4 = 0) = 4) % 4 = 0 padding
   */
  const padLength = (4 - (base64.length % 4)) % 4;
  const padded = base64.padEnd(base64.length + padLength, "=");
  // Convert to a binary string
  const binary = atob(padded);
  // Convert binary string to buffer
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return buffer;
}

function bufferToBase64URLString(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = "";
  for (const charCode of bytes) {
    str += String.fromCharCode(charCode);
  }
  const base64String = btoa(str);
  return base64String.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function isoBase64fromBuffer(
  buffer: Uint8Array,
  to: "base64" | "base64url" = "base64url",
): string {
  return base64.fromArrayBuffer(buffer, to === "base64url");
}

function convertWebAuthnToDER(rawPublicKey: string): P256PublicKey {
  const asn1Prefix = "3059301306072a8648ce3d020106082a8648ce3d0301070342";
  return P256PublicKey(asn1Prefix + rawPublicKey);
}
