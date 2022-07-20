import Crypto from "crypto";

import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import {
  EVMAccountAddress,
  Signature,
  AESEncryptedString,
  AESKey,
  Argon2Hash,
  EncryptedString,
  EVMPrivateKey,
  InitializationVector,
  SHA256Hash,
  HexString,
  TokenId,
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

  public getTokenId(): ResultAsync<TokenId, never> {
    return okAsync(TokenId(BigInt(Crypto.randomInt(281474976710655))));
  }

  public deriveAESKeyFromSignature(
    signature: Signature,
    salt: HexString,
  ): ResultAsync<AESKey, never> {
    // A signature is a hex string, with 65 bytes. We should convert it to a buffer
    const sourceEntropy = Buffer.from(signature, "hex");
    const saltBuffer = Buffer.from(salt, "hex");
    const keyBuffer = Crypto.pbkdf2Sync(
      sourceEntropy,
      saltBuffer,
      100,
      32,
      "sha256",
    );

    return okAsync(AESKey(keyBuffer.toString("base64")));
  }

  public createAESKey(): ResultAsync<AESKey, never> {
    return okAsync(AESKey(Crypto.randomBytes(32).toString("base64")));
  }

  public createEthereumPrivateKey(): ResultAsync<EVMPrivateKey, never> {
    return okAsync(EVMPrivateKey(Crypto.randomBytes(32).toString("hex")));
  }

  public getEthereumAccountAddressFromPrivateKey(
    privateKey: EVMPrivateKey,
  ): EVMAccountAddress {
    const wallet = new ethers.Wallet(privateKey);

    return EVMAccountAddress(wallet.address);
  }

  public verifySignature(
    message: string,
    signature: Signature,
  ): ResultAsync<EVMAccountAddress, never> {
    const address = EVMAccountAddress(
      ethers.utils.verifyMessage(message, signature),
    );

    return okAsync(address);
  }

  public verifyTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, unknown>,
    signature: Signature,
  ): ResultAsync<EVMAccountAddress, never> {
    return okAsync(
      EVMAccountAddress(
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
    privateKey: EVMPrivateKey,
  ): ResultAsync<Signature, never> {
    const wallet = new ethers.Wallet(privateKey);

    return ResultAsync.fromSafePromise<string, never>(
      wallet.signMessage(message),
    ).map((signature) => {
      return Signature(signature);
    });
  }

  public signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, unknown>,
    privateKey: EVMPrivateKey,
  ): ResultAsync<Signature, never> {
    const wallet = new ethers.Wallet(privateKey);

    return ResultAsync.fromSafePromise<string, never>(
      wallet._signTypedData(domain, types, value),
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

  public xmur3(str: string): () => number {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      (h = Math.imul(h ^ str.charCodeAt(i), 3432918353)),
        (h = (h << 13) | (h >>> 19));
    }

    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return (h ^= h >>> 16) >>> 0;
    };
  }

  public sfc32(a: number, b: number, c: number, d: number): () => number {
    return function () {
      a >>>= 0;
      b >>>= 0;
      c >>>= 0;
      d >>>= 0;
      let t = (a + b) | 0;
      a = b ^ (b >>> 9);
      b = (c + (c << 3)) | 0;
      c = (c << 21) | (c >>> 11);
      d = (d + 1) | 0;
      t = (t + d) | 0;
      c = (c + t) | 0;
      return (t >>> 0) / 4294967296;
    };
  }

  public randomInt(
    randomFunc: () => number,
    low: number,
    high: number,
  ): number {
    return Math.floor(randomFunc() * (high - low) + low);
  }

  public randomBytes(length: number, seed: string): Uint8Array {
    // The seed is any string, we can use that to seed the hash method.
    const hash = this.xmur3(seed);

    // Output four 32-bit hashes to provide the seed for sfc32
    const randFunc = this.sfc32(hash(), hash(), hash(), hash());

    const out = new Uint8Array(length);
    for (let i = 0; i < out.length; i++) {
      out[i] = this.randomInt(randFunc, 0, 256);
    }
    return out;
  }
}
