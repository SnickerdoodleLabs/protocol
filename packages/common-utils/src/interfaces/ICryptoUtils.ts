import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import {
  AESEncryptedString,
  AESKey,
  Argon2Hash,
  EVMPrivateKey,
  SHA256Hash,
  EVMAccountAddress,
  Signature,
  HexString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICryptoUtils {
  getNonce(nonceSize?: number): ResultAsync<string, never>;

  createAESKey(): ResultAsync<AESKey, never>;
  deriveAESKeyFromSignature(
    signature: Signature,
    salt: HexString,
  ): ResultAsync<AESKey, never>;

  createEthereumPrivateKey(): ResultAsync<EVMPrivateKey, never>;
  getEthereumAccountAddressFromPrivateKey(
    privateKey: EVMPrivateKey,
  ): EVMAccountAddress;

  verifySignature(
    message: string,
    signature: Signature,
  ): ResultAsync<EVMAccountAddress, never>;
  verifyTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, unknown>,
    signature: Signature,
  ): ResultAsync<EVMAccountAddress, never>;

  encryptString(
    secret: string,
    encryptionKey: AESKey,
  ): ResultAsync<AESEncryptedString, never>;

  decryptAESEncryptedString(
    encrypted: AESEncryptedString,
    encryptionKey: AESKey,
  ): ResultAsync<string, never>;

  // generateKeyPair(): ResultAsync<void, never>;

  signMessage(
    message: string,
    privateKey: EVMPrivateKey,
  ): ResultAsync<Signature, never>;

  signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, unknown>,
    privateKey: EVMPrivateKey,
  ): ResultAsync<Signature, never>;

  hashStringSHA256(message: string): ResultAsync<SHA256Hash, never>;
  hashStringArgon2(message: string): ResultAsync<Argon2Hash, never>;
  verifyHashArgon2(
    hash: Argon2Hash,
    message: string,
  ): ResultAsync<boolean, never>;

  xmur3(str: string): () => number;
  sfc32(a: number, b: number, c: number, d: number): () => number;
  randomInt(randomFunc: () => number, low: number, high: number): number;
  randomBytes(length: number, seed: string): Uint8Array;
}

export const ICryptoUtilsType = Symbol.for("ICryptoUtils");
