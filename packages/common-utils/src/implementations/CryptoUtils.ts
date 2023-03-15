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
  EncryptedString,
  EVMPrivateKey,
  InitializationVector,
  SHA256Hash,
  HexString,
  TokenId,
  Base64String,
  SolanaAccountAddress,
  SolanaPrivateKey,
  InvalidParametersError,
  EVMContractAddress,
  RSAKeyPair,
  PEMEncodedRSAPrivateKey,
  PEMEncodedRSAPublicKey,
  KeyGenerationError,
} from "@snickerdoodlelabs/objects";
// import argon2 from "argon2";
import { BigNumber, ethers } from "ethers";
import { base58 } from "ethers/lib/utils.js";
import { injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import nacl from "tweetnacl";

import { ICryptoUtils } from "@common-utils/interfaces/index.js";

@injectable()
export class CryptoUtils implements ICryptoUtils {
  protected cipherAlgorithm = "aes-256-cbc";
  constructor() {}

  public getNonce(nonceSize = 64): ResultAsync<Base64String, never> {
    const baseString = Base64String(
      Crypto.randomBytes(nonceSize).toString("base64").slice(0, nonceSize),
    );
    return okAsync(baseString);
  }

  public getTokenId(): ResultAsync<TokenId, never> {
    const buf = Crypto.randomBytes(4);
    const hex = buf.toString("hex");
    const bigInt = BigInt(`0x${hex}`);

    return okAsync(TokenId(bigInt));

    // This older implementation I'm leaving as a comment. It's very clean, but does not
    // work in a service worker, because the polyfills available do not support randomInt().
    // Ye be warned.
    //return okAsync(TokenId(BigInt(Crypto.randomInt(281474976710655))));
  }

  public getTokenIds(quantity: number): ResultAsync<TokenId[], never> {
    if (quantity < 1) {
      return okAsync([]);
    }

    const generateUniqueTokens = (
      uniqueList: TokenId[] = [],
    ): ResultAsync<TokenId[], never> => {
      return ResultUtils.combine(
        [...Array(quantity - uniqueList.length)].map(() => {
          return this.getTokenId();
        }),
      ).andThen((tokenIds) => {
        const uniqueTokenIds = [...new Set([...uniqueList, ...tokenIds])];
        if (uniqueTokenIds.length !== quantity) {
          return generateUniqueTokens(uniqueTokenIds);
        }
        return okAsync(uniqueTokenIds);
      });
    };
    return generateUniqueTokens();
  }

  public deriveAESKeyFromSignature(
    signature: Signature,
    salt: HexString,
  ): ResultAsync<AESKey, never> {
    // A signature is a hex string, with 65 bytes. We should convert it to a buffer
    const sourceEntropy = this.hexStringToBuffer(signature);
    const saltBuffer = this.hexStringToBuffer(salt);
    const keyBuffer = Crypto.pbkdf2Sync(
      sourceEntropy,
      saltBuffer,
      100000,
      32,
      "sha256",
    );

    return okAsync(AESKey(keyBuffer.toString("base64")));
  }

  public deriveEVMPrivateKeyFromSignature(
    signature: Signature,
    salt: HexString,
  ): ResultAsync<EVMPrivateKey, never> {
    // A signature is a hex string, with 65 bytes. We should convert it to a buffer
    const sourceEntropy = this.hexStringToBuffer(signature);
    const saltBuffer = this.hexStringToBuffer(salt);
    const keyBuffer = Crypto.pbkdf2Sync(
      sourceEntropy,
      saltBuffer,
      100000,
      32,
      "sha256",
    );

    return okAsync(EVMPrivateKey(keyBuffer.toString("hex")));
  }

  public deriveAESKeyFromEVMPrivateKey(
    evmKey: EVMPrivateKey,
  ): ResultAsync<AESKey, never> {
    // We can generate salt by signing a message
    return this.signMessage("PhoebeIsCute", evmKey).map((signature) => {
      // An EVMPrivateKey is a hex string. We should convert it to a buffer
      const sourceEntropy = this.hexStringToBuffer(evmKey);
      const saltBuffer = this.hexStringToBuffer(signature);
      const keyBuffer = Crypto.pbkdf2Sync(
        sourceEntropy,
        saltBuffer,
        100000,
        32,
        "sha256",
      );
      return AESKey(keyBuffer.toString("base64"));
    });
  }

  public deriveCeramicSeedFromEVMPrivateKey(
    evmKey: EVMPrivateKey,
  ): ResultAsync<Uint8Array, never> {
    return this.signMessage("VarunWasHere", evmKey).map((signature) => {
      // An EVMPrivateKey is a hex string. We should convert it to a buffer
      const sourceEntropy = this.hexStringToBuffer(evmKey);
      const saltBuffer = this.hexStringToBuffer(signature);
      const keyBuffer = Crypto.pbkdf2Sync(
        sourceEntropy,
        saltBuffer,
        100000,
        32,
        "sha256",
      );
      return new Uint8Array(keyBuffer.buffer);
    });
  }

  public createRSAKeyPair(): ResultAsync<RSAKeyPair, KeyGenerationError> {
    return ResultAsync.fromPromise(
      new Promise((resolve, reject) => {
        Crypto.generateKeyPair(
          "rsa",
          {
            modulusLength: 4096,
            publicKeyEncoding: {
              type: "spki",
              format: "pem",
            },
            privateKeyEncoding: {
              type: "pkcs8",
              format: "pem",
            },
          } as Crypto.RSAKeyPairOptions<"pem", "pem">,
          (err, publicKey, privateKey) => {
            if (err != null) {
              reject(err);
            }
            resolve(
              new RSAKeyPair(
                PEMEncodedRSAPrivateKey(privateKey),
                PEMEncodedRSAPublicKey(publicKey),
              ),
            );
          },
        );
      }),
      (e) => {
        return new KeyGenerationError("Unable to generate a new RSA Key", e);
      },
    );
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

  public verifyEVMSignature(
    message: string | Uint8Array,
    signature: Signature,
  ): ResultAsync<EVMAccountAddress, never> {
    const address = EVMAccountAddress(
      ethers.utils.verifyMessage(message, signature),
    );
    return okAsync(address);
  }

  public verifySolanaSignature(
    message: string,
    signature: Signature,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<boolean, never> {
    return okAsync(
      nacl.sign.detached.verify(
        Buffer.from(message, "utf-8"),
        Buffer.from(signature, "hex"),
        base58.decode(accountAddress),
      ),
    );
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
      try {
        const cipher = Crypto.createCipheriv(
          this.cipherAlgorithm,
          Buffer.from(encryptionKey, "base64"),
          iv,
        );

        // Encrypt the message
        let encryptedData = cipher.update(secret, "utf8", "base64");
        encryptedData += cipher.final("base64");
        return new AESEncryptedString(EncryptedString(encryptedData), iv);
      } catch (e) {
        // This is not ideal error handling, but is better than nothing. At least
        // we will get some logs
        console.error(`Error while encrypting string!`);
        console.error(e);
        return new AESEncryptedString(EncryptedString("THIS IS AN ERROR"), iv);
      }
    });
  }

  public decryptAESEncryptedString(
    encrypted: AESEncryptedString,
    encryptionKey: AESKey,
  ): ResultAsync<string, never> {
    try {
      // The decipher function
      const decipher = Crypto.createDecipheriv(
        this.cipherAlgorithm,
        Buffer.from(encryptionKey, "base64"),
        encrypted.initializationVector,
      );
      // decrypt the message
      let decryptedData = decipher.update(encrypted.data, "base64", "utf8");
      decryptedData += decipher.final("utf8");
      return okAsync(decryptedData);
    } catch (e) {
      // This is not ideal error handling, but is better than nothing. At least
      // we will get some logs
      console.error(`Error while deciphering encrypted string!`);
      console.error(e);
      return okAsync("THIS IS AN ERROR");
    }
  }

  public getSignature(
    owner: ethers.providers.JsonRpcSigner | ethers.Wallet,
    types: Array<string>,
    values: Array<
      BigNumber | string | HexString | EVMContractAddress | EVMAccountAddress
    >,
  ): ResultAsync<Signature, InvalidParametersError> {
    if (types.length !== values.length) {
      return errAsync(
        new InvalidParametersError(
          "Types and values should have same number of members.",
        ),
      );
    }
    const msgHash = ethers.utils.solidityKeccak256([...types], [...values]);

    return ResultAsync.fromSafePromise<string, never>(
      owner.signMessage(ethers.utils.arrayify(msgHash)),
    ).map((signature) => {
      return Signature(signature);
    });
  }

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

  public signMessageSolana(
    message: string,
    privateKey: SolanaPrivateKey,
  ): ResultAsync<Signature, never> {
    return okAsync(
      Signature(
        Buffer.from(
          nacl.sign.detached(
            Buffer.from(message, "utf8"),
            base58.decode(privateKey),
          ),
        ).toString("hex"),
      ),
    );
  }

  public signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, unknown>,
    privateKey: EVMPrivateKey,
  ): ResultAsync<Signature, never> {
    const wallet = new ethers.Wallet(privateKey); // TODO, need to specify default provider (https://github.com/ethers-io/ethers.js/issues/2258)

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

  // public hashStringArgon2(message: string): ResultAsync<Argon2Hash, never> {
  //   return ResultAsync.fromSafePromise<string, never>(argon2.hash(message)).map(
  //     (hash) => {
  //       return Argon2Hash(hash);
  //     },
  //   );
  // }

  // public verifyHashArgon2(
  //   hash: Argon2Hash,
  //   message: string,
  // ): ResultAsync<boolean, never> {
  //   return ResultAsync.fromSafePromise<boolean, never>(
  //     argon2.verify(hash, message),
  //   );
  // }

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

  protected hexStringToBuffer(
    hex: HexString | Signature | EVMPrivateKey,
  ): Buffer {
    // HexStrings have a nasty habit of SOMETIMES having a 0x prefix but not always.
    // We will correct that
    if (!ethers.utils.isHexString(hex)) {
      const prefixedHex = `0x${hex}`;

      // If it's still not a valid hex string, then it's exception time.
      if (!ethers.utils.isHexString(prefixedHex)) {
        throw new Error(`Invalid hex string ${hex}`);
      }
      return Buffer.from(ethers.utils.arrayify(prefixedHex));
    }
    return Buffer.from(ethers.utils.arrayify(hex));
  }
}
