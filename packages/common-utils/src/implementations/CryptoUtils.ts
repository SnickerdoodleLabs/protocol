import Crypto from "crypto";
import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import {
  EthereumAccountAddress,
  Signature,
  AESEncryptedString,
  AESKey,
  Argon2Hash,
  EncryptedString,
  EthereumPrivateKey,
  InitializationVector,
  SHA256Hash,
} from "@snickerdoodlelabs/objects";
import argon2 from "argon2";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { ICryptoUtils } from "@common-utils/interfaces";

@injectable()
export class CryptoUtils implements ICryptoUtils {
  protected cipherAlgorithm = "aes-256-cbc";

  constructor() {}

  public getNonce(nonceSize = 64): ResultAsync<string, never> {
    return okAsync(
      Crypto.randomBytes(nonceSize).toString("base64").slice(0, nonceSize),
    );
  }

  public createAESKey(): ResultAsync<AESKey, never> {
    return okAsync(AESKey(Crypto.randomBytes(32).toString("base64")));
  }

  public createEthereumPrivateKey(): ResultAsync<EthereumPrivateKey, never> {
    return okAsync(EthereumPrivateKey(Crypto.randomBytes(32).toString("hex")));
  }

  public getEthereumAccountAddressFromPrivateKey(
    privateKey: EthereumPrivateKey,
  ): EthereumAccountAddress {
    const wallet = new ethers.Wallet(privateKey);

    return EthereumAccountAddress(wallet.address);
  }

  public verifySignature(
    message: string,
    signature: Signature,
  ): ResultAsync<EthereumAccountAddress, never> {
    const address = EthereumAccountAddress(
      ethers.utils.verifyMessage(message, signature),
    );

    return okAsync(address);
  }

  public verifyTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, unknown>,
    signature: Signature,
  ): ResultAsync<EthereumAccountAddress, never> {
    return okAsync(
      EthereumAccountAddress(
        ethers.utils.verifyTypedData(domain, types, value, signature),
      ),
    );
  }

  public encryptString(
    secret: string,
    encryptionKey: AESKey,
  ): ResultAsync<AESEncryptedString, never> {
    return this.getNonce(16).map((nonce) => {
      const iv = InitializationVector(nonce);

      const cipher = Crypto.createCipheriv(
        this.cipherAlgorithm,
        Buffer.from(encryptionKey, "base64"),
        iv,
      );

      // Encrypt the message
      let encryptedData = cipher.update(secret, "utf-8", "base64");
      encryptedData += cipher.final("base64");
      return new AESEncryptedString(EncryptedString(encryptedData), iv);
    });
  }

  public decryptAESEncryptedString(
    encrypted: AESEncryptedString,
    encryptionKey: AESKey,
  ): ResultAsync<string, never> {
    // The decipher function
    const decipher = Crypto.createDecipheriv(
      this.cipherAlgorithm,
      Buffer.from(encryptionKey, "base64"),
      encrypted.initializationVector,
    );

    // decrypt the message
    let decryptedData = decipher.update(encrypted.data, "base64", "utf-8");
    decryptedData += decipher.final("utf8");
    return okAsync(decryptedData);
  }

  // public generateKeyPair(): ResultAsync<void, never> {
  // 	const { publicKey, privateKey } = Crypto.generateKeyPairSync("rsa", {
  // 		// The standard secure default length for RSA keys is 2048 bits
  // 		modulusLength: 2048,
  // 	});

  // 	console.log(publicKey);

  // 	return okAsync(undefined);
  // }

  public signMessage(
    message: string,
    privateKey: EthereumPrivateKey,
  ): ResultAsync<Signature, never> {
    const wallet = new ethers.Wallet(privateKey);

    return ResultAsync.fromSafePromise<string, never>(
      wallet.signMessage(message),
    ).map((signature) => {
      return Signature(signature);
    });
  }

  public hashStringSHA256(message: string): ResultAsync<SHA256Hash, never> {
    const hash = Crypto.createHash("sha256").update(message).digest("base64");

    return okAsync(SHA256Hash(hash));
  }

  public hashStringArgon2(message: string): ResultAsync<Argon2Hash, never> {
    return ResultAsync.fromSafePromise<string, never>(argon2.hash(message)).map(
      (hash) => {
        return Argon2Hash(hash);
      },
    );
  }

  public verifyHashArgon2(
    hash: Argon2Hash,
    message: string,
  ): ResultAsync<boolean, never> {
    return ResultAsync.fromSafePromise<boolean, never>(
      argon2.verify(hash, message),
    );
  }
}
