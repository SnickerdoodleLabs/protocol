import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import {
  AESEncryptedString,
  AESKey,
  Argon2Hash,
  EthereumPrivateKey,
  SHA256Hash,
  EthereumAccountAddress,
  Signature,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICryptoUtils {
  getNonce(nonceSize?: number): ResultAsync<string, never>;

  createAESKey(): ResultAsync<AESKey, never>;
  createEthereumPrivateKey(): ResultAsync<EthereumPrivateKey, never>;
  getEthereumAccountAddressFromPrivateKey(
    privateKey: EthereumPrivateKey,
  ): EthereumAccountAddress;

  verifySignature(
    message: string,
    signature: Signature,
  ): ResultAsync<EthereumAccountAddress, never>;
  verifyTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, unknown>,
    signature: Signature,
  ): ResultAsync<EthereumAccountAddress, never>;

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
    privateKey: EthereumPrivateKey,
  ): ResultAsync<Signature, never>;

  hashStringSHA256(message: string): ResultAsync<SHA256Hash, never>;
  hashStringArgon2(message: string): ResultAsync<Argon2Hash, never>;
  verifyHashArgon2(
    hash: Argon2Hash,
    message: string,
  ): ResultAsync<boolean, never>;
}

export const ICryptoUtilsType = Symbol.for("ICryptoUtils");
