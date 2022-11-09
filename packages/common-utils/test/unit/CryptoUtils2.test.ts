import "reflect-metadata";
import {
  EVMPrivateKey,
  HexString,
  Signature,
} from "@snickerdoodlelabs/objects";

import { CryptoUtilsMocks } from "../mocks/CryptoUtilsMocks";


describe("CryptoUtils tests", () => {
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
    expect(key).toBe("TzhWa2if/TUOC4wWz7Cfn1CoPGbx2AqhnAOZxge/hZg==");
  });

  test("signMessage() works", async () => {
    // Arrange
    const mocks = new CryptoUtilsMocks();
    const utils = mocks.factoryCryptoUtils();

    const dataToEncrypt = "Phoebe is cute!";

    // Act
    // This key was randomly generated
    const privateKey = EVMPrivateKey(
      "cdb1a5a07befb0420d8f2439a1794c3ac21f718bf3d63a5d9981cb490db8bfb7",
    );
    const result = await utils.signMessage(dataToEncrypt, privateKey);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const signature = result._unsafeUnwrap();
    expect(signature).toEqual(
      Signature(
        "0x072db31845f8faf1627abb01dd1e5f5bb1059a1bd358d1d235147a7b765705e93be08e21268af8c0e8695ca000c1e4fca3d32b407c0e5973f87b8b7e7d995bf71c",
      ),
    );
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
        return utils.verifyEVMSignature(dataToEncrypt, signature);
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const address = result._unsafeUnwrap();
    expect(address).toEqual(expectedAddress);
  });
});
