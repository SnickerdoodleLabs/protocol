import Crypto from "crypto";

import { HubAsyncResult, NobleEd25519Signer } from "@farcaster/hub-nodejs";
import { verifyPersonalMessage } from "@mysten/sui.js/verify";
import * as ed from "@noble/ed25519";
import {
  AESEncryptedString,
  AESKey,
  Base64String,
  EncryptedString,
  EVMAccountAddress,
  EVMContractAddress,
  EVMPrivateKey,
  HexString,
  InitializationVector,
  InvalidParametersError,
  KeyGenerationError,
  PEMEncodedRSAPrivateKey,
  PEMEncodedRSAPublicKey,
  RSAKeyPair,
  SHA256Hash,
  Signature,
  SolanaAccountAddress,
  SolanaPrivateKey,
  TokenAndSecret,
  TokenId,
  URLString,
  UUID,
  OAuth1Config,
  SuiAccountAddress,
  ED25519PublicKey,
  SignerUnavailableError,
  NobleED25519KeyPair,
  ED25519PrivateKey,
  P256PublicKeyComponent,
  PasskeyId,
  P256PublicKeyPointX,
  P256PublicKeyPointY,
  P256SignatureComponent,
  P256SignatureR,
  P256SignatureS,
  P256SignatureComponentArrayBuffer,
  P256PublicKey,
} from "@snickerdoodlelabs/objects";
// import argon2 from "argon2";
import {
  TypedDataDomain,
  TypedDataField,
  decodeBase58,
  ethers,
  getBytes,
  toBeHex,
} from "ethers";
import { injectable } from "inversify";
import { err, errAsync, ok, okAsync, Result, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import OAuth from "oauth-1.0a";
import nacl from "tweetnacl";
import { v4 } from "uuid";

import { ICryptoUtils } from "@node-utils/interfaces/index.js";

@injectable()
export class CryptoUtils implements ICryptoUtils {
  protected cipherAlgorithm = "aes-256-cbc";
  constructor() {}

  public getUUID(): UUID {
    return UUID(v4());
  }

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

  public getEd25519PublicKeyFromPrivateKey(
    privateKey: string,
  ): ResultAsync<string, never> {
    // derive public key from private key
    // if (privateKey == "") {
    //   return errAsync(
    //     new KeyGenerationError("Ed25519 Private Key was not provided"),
    //   );
    // }

    const privateKeyBuffer = Buffer.from(privateKey, "base64");
    const privateKeyUint8 = new Uint8Array(
      privateKeyBuffer.buffer,
      privateKeyBuffer.byteOffset,
      privateKeyBuffer.byteLength,
    );

    return ResultAsync.fromSafePromise(ed.getPublicKey(privateKeyUint8)).map(
      (response: Uint8Array) => {
        const output = Buffer.from(
          response.buffer,
          response.byteOffset,
          response.byteLength,
        ).toString("base64");
        return output;
      },
    );
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

  public deriveAESKeyFromString(
    source: string,
    salt: HexString,
  ): ResultAsync<AESKey, never> {
    const saltBuffer = this.hexStringToBuffer(salt);
    const keyBuffer = Crypto.pbkdf2Sync(
      source,
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

  public deriveEVMPrivateKeyFromString(
    source: string,
    salt: HexString,
  ): ResultAsync<EVMPrivateKey, never> {
    const saltBuffer = this.hexStringToBuffer(salt);
    const keyBuffer = Crypto.pbkdf2Sync(
      source,
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
    return EVMAccountAddress(wallet.address.toLowerCase());
  }

  public verifyEVMSignature(
    message: string | Uint8Array,
    signature: Signature,
  ): ResultAsync<EVMAccountAddress, never> {
    const address = EVMAccountAddress(
      ethers.verifyMessage(message, signature).toLowerCase(),
    );
    return okAsync(address);
  }

  /**
   * Sui signatures are documented here: https://docs.sui.io/learn/cryptography/sui-signatures
   * @param message
   * @param signature
   * @param accountAddress
   * @returns a boolean representing if the message was signed by the provided account address
   */
  public verifySuiSignature(
    message: string,
    signature: Signature,
    accountAddress: SuiAccountAddress,
  ): ResultAsync<boolean, never> {
    return ResultAsync.fromPromise(
      verifyPersonalMessage(Buffer.from(message, "utf-8"), signature),
      (e) => {
        return e as Error;
      },
    )
      .map((publicKey) => {
        const recoveredAccountAddress = SuiAccountAddress(
          publicKey.toSuiAddress(),
        );
        return (
          recoveredAccountAddress.toLowerCase() == accountAddress.toLowerCase()
        );
      })
      .orElse((e) => {
        // The signature is almost certainly invalid; verifyPersonalMessage returns an error if the crypto fails
        // in the verification step
        return okAsync(false);
      });
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
        getBytes(toBeHex(decodeBase58(accountAddress))),
      ),
    );
  }

  public verifyTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, unknown>,
    signature: Signature,
  ): ResultAsync<EVMAccountAddress, never> {
    // The types per the spec have a type, EIP712Domain, which is actually added by ethers.
    // But if you're not using ethers, you may be providing the types yourself. Since ethers
    // will re-add it, we'll remove it.
    delete types.EIP712Domain;

    return okAsync(
      EVMAccountAddress(
        ethers.verifyTypedData(domain, types, value, signature).toLowerCase(),
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
    owner: ethers.JsonRpcSigner | ethers.Wallet,
    types: Array<string>,
    values: Array<
      bigint | string | HexString | EVMContractAddress | EVMAccountAddress
    >,
  ): ResultAsync<Signature, InvalidParametersError> {
    if (types.length !== values.length) {
      return errAsync(
        new InvalidParametersError(
          "Types and values should have same number of members.",
        ),
      );
    }
    const msgHash = ethers.solidityPackedKeccak256([...types], [...values]);

    return ResultAsync.fromSafePromise<string, never>(
      owner.signMessage(ethers.getBytes(msgHash)),
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
            getBytes(toBeHex(decodeBase58(privateKey))),
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

    // The types per the spec have a type, EIP712Domain, which is actually added by ethers.
    // But if you're not using ethers, you may be providing the types yourself. Since ethers
    // will re-add it, we'll remove it.
    delete types.EIP712Domain;

    return ResultAsync.fromSafePromise<string, never>(
      wallet.signTypedData(domain, types, value),
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

  public packOAuth1Credentials(
    config: OAuth1Config,
    url: URLString,
    method: string,
    pathAndBodyParams?: object,
    accessTokenAndSecret?: TokenAndSecret,
  ): string {
    const oAuth = new OAuth({
      consumer: {
        key: config.apiKey,
        secret: config.apiSecretKey,
      },
      signature_method:
        config.signingAlgorithm.toUpperCase() +
        "-" +
        config.hashingAlgorithm.toUpperCase(),
      hash_function: (baseString, secretKey) =>
        Base64String(
          Crypto.createHmac(config.hashingAlgorithm.toLowerCase(), secretKey)
            .update(baseString)
            .digest("base64"),
        ),
    });
    return oAuth.toHeader(
      oAuth.authorize(
        {
          url: url,
          method: method,
          ...(pathAndBodyParams ? { data: pathAndBodyParams } : {}),
        } as OAuth.RequestOptions,
        accessTokenAndSecret
          ? {
              key: accessTokenAndSecret.token,
              secret: accessTokenAndSecret.secret,
            }
          : undefined,
      ),
    ).Authorization;
  }

  public getNobleED25519Signer(privateKey: string): NobleEd25519Signer {
    return new NobleEd25519Signer(ethers.getBytes(privateKey));
  }

  public getNobleED25519SignerPublicKey(
    ed25519Signer: NobleEd25519Signer,
  ): ResultAsync<ED25519PublicKey, SignerUnavailableError> {
    return ResultAsync.fromPromise(
      ed25519Signer.getSignerKey() as HubAsyncResult<Uint8Array>,
      (e) => {
        return e as SignerUnavailableError;
      },
    ).andThen((signerKey) => {
      if (signerKey.isOk()) {
        return okAsync(ED25519PublicKey(ethers.hexlify(signerKey.value)));
      }
      return errAsync(
        new SignerUnavailableError(
          "Unable to obtain NobleED25519Signer's public key",
        ),
      );
    });
  }

  public generateEd25519KeyPair(): ResultAsync<
    NobleED25519KeyPair,
    KeyGenerationError
  > {
    const privateKeyBytes = ed.utils.randomPrivateKey();

    return ResultAsync.fromPromise(
      ed.getPublicKey(privateKeyBytes) as Promise<Uint8Array>,
      (e) => {
        return e as KeyGenerationError;
      },
    ).map((publicKeyBytes) => {
      const publicKeyString =
        "0x" + Buffer.from(publicKeyBytes).toString("hex");
      const privateKeyString =
        "0x" + Buffer.from(privateKeyBytes).toString("hex");

      return new NobleED25519KeyPair(
        ED25519PublicKey(publicKeyString),
        ED25519PrivateKey(privateKeyString),
      );
    });
  }

  protected hexStringToBuffer(
    hex: HexString | Signature | EVMPrivateKey,
  ): Buffer {
    // HexStrings have a nasty habit of SOMETIMES having a 0x prefix but not always.
    // We will correct that
    if (!ethers.isHexString(hex)) {
      const prefixedHex = `0x${hex}`;

      // If it's still not a valid hex string, then it's exception time.
      if (!ethers.isHexString(prefixedHex)) {
        throw new Error(`Invalid hex string ${hex}`);
      }
      return Buffer.from(ethers.getBytes(prefixedHex));
    }
    return Buffer.from(ethers.getBytes(hex));
  }

  public parseRawP256PublicKey(
    publicKey: P256PublicKey,
  ): Result<
    { x: P256PublicKeyPointX; y: P256PublicKeyPointY },
    InvalidParametersError
  > {
    // Convert hex string public key to Uint8Array
    const pubKeyView = this.hexToUint8Array(publicKey);

    // Public Key Header Bytes
    const headerByte = pubKeyView[0];

    // Second value tells you the length of the rest of the data array
    const keyLength = pubKeyView[1];

    // Third value tells you the type of the next value which MUST be an integer (0x02) if this is a signature array
    const metadataIndicatorByte = pubKeyView[2];
    // Third byte MUST be equal to 48 if this is a legitimate public key array
    if (metadataIndicatorByte !== 48) {
      return err(new InvalidParametersError("This is not a public key array"));
    }

    // Forth Value is the length of the public key metadata
    const metadataLength = pubKeyView[3];

    // Slice out the metadata and print it
    // this metadata is a SEQUENCE OF containing the description of the key type (i.e. ecPublickey for P-256)
    // Really we should parse this and make sure the public key was generated for the curve we are expecting
    // i.e. P256 (the object identifier for this curve is: 1.2.840.10045.3.1.7 https://oid-rep.orange-labs.fr/get/1.2.840.10045.3.1.7)
    const metadataUint8Array = pubKeyView.slice(4, 4 + metadataLength);
    const metadataString = metadataUint8Array.reduce(
      (t, x) => t + x.toString(16).padStart(2, "0"),
      "",
    );

    const publicKeyIndicatorByte = pubKeyView[4 + metadataLength];
    // This byte MUST be equal to 2 if this is a legitimate signature array
    if (publicKeyIndicatorByte !== 3) {
      return err(new InvalidParametersError("This is not a public key array"));
    }

    // Now get the length of the s value of the signature (r,s)
    const pubKeyLength = pubKeyView[4 + metadataLength + 1];

    // Slice out the s value and print it
    const startingByte = 4 + metadataLength + 2;
    const endingByte = startingByte + pubKeyLength;
    const publicKeyUint8Array = pubKeyView.slice(startingByte, endingByte);
    const publicKeyString = publicKeyUint8Array.reduce(
      (t, x) => t + x.toString(16).padStart(2, "0"),
      "",
    );
    const qx = publicKeyString.slice(
      publicKeyString.length - 128,
      publicKeyString.length - 64,
    );
    const qy = publicKeyString.slice(-64);

    return ok({
      x: P256PublicKeyPointX(`0x${qx}`),
      y: P256PublicKeyPointY(`0x${qy}`),
    });
  }

  // returns a 64-byte ArrayBuffer containing r and s concatenated together
  public parseRawP256Signature(
    signatureArray: ArrayBuffer,
    msgPayload: string,
  ): P256SignatureComponentArrayBuffer {
    const signatureView = new Uint8Array(signatureArray);

    // First value is the header and should be 0x30
    const headerByte = signatureView[0];

    // Second value tells you the length of the rest of the data array
    const signatureLength = signatureView[1];

    // Third value tells you the type of the next value which MUST be an integer (0x02) if this is a signature array
    // https://en.wikipedia.org/wiki/X.690#identifier_octets
    const rTypeIndicatorByte = signatureView[2];

    // Third byte MUST be equal to 2 if this is a legitimate signature array
    console.assert(
      rTypeIndicatorByte === 2,
      "This is not a signature byte array",
    );

    // Forth Value is the length of the first coordinate (r) of the signature (r,s)
    const rLength = signatureView[3];

    // Slice out the r value and print it
    const rValueUint8Array = this.formatInteger(
      signatureView.slice(4, 4 + rLength),
    );
    const rString = rValueUint8Array.reduce(
      (t, x) => t + x.toString(16).padStart(2, "0"),
      "",
    );

    const sTypeIndicatorByte = signatureView[4 + rLength];

    // This byte MUST be equal to 2 if this is a legitimate signature array
    console.assert(
      sTypeIndicatorByte === 2,
      "This is not a signature byte array",
    );

    // Now get the length of the s value of the signature (r,s)
    const sLength = signatureView[4 + rLength + 1];

    // Slice out the s value and print it
    const startingByte = 4 + rLength + 2;
    const endingByte = startingByte + sLength;
    const sValueUint8Array = this.formatInteger(
      signatureView.slice(startingByte, endingByte),
    );
    const sString = sValueUint8Array.reduce(
      (t, x) => t + x.toString(16).padStart(2, "0"),
      "",
    );

    const sigAndMsgPayload = msgPayload + `r: 0x${rString}, s: 0x${sString}`;

    // return the signature formatted for use in crypto.subtle.verify
    return P256SignatureComponentArrayBuffer(
      new Uint8Array([...rValueUint8Array, ...sValueUint8Array]).buffer,
    );
  }

  // curve elements MUST be 32 bytes for use in secp256r1 implementations
  // this function converts variable length ArrayBuffers to 32 byte ArrayBuffers
  // representing integer field elements
  private formatInteger(integerBytes): Uint8Array {
    if (integerBytes.byteLength === 32) return integerBytes;
    if (integerBytes.byteLength < 32) {
      return this.concatenateUint8Array(
        // pad the most significant digits with 0's if too short
        new Uint8Array(32 - integerBytes.byteLength).fill(0),
        integerBytes,
      );
    }
    // remove superfluous 0's if too long
    return integerBytes.slice(-32);
  }

  // Takes any number of Uint8Arrays and concatenates them into a single Uint8Array
  private concatenateUint8Array(...arrays) {
    // Calculate the total length of the concatenated array
    const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);

    // Create a new Uint8Array to hold all elements
    const result = new Uint8Array(totalLength);

    // Copy each array into the result array sequentially
    let offset = 0;
    arrays.forEach((arr) => {
      result.set(arr, offset);
      offset += arr.length;
    });

    return result;
  }

  private hexToUint8Array(hexString: string): Uint8Array {
    const array = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
      array[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
    }
    return array;
  }
}
