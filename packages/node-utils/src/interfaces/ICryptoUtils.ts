import { NobleEd25519Signer } from "@farcaster/hub-nodejs";
import {
  AESEncryptedString,
  AESKey,
  Base64String,
  ED25519PublicKey,
  EVMAccountAddress,
  EVMContractAddress,
  EVMPrivateKey,
  HexString,
  InvalidParametersError,
  KeyGenerationError,
  NobleED25519KeyPair,
  OAuth1Config,
  P256PublicKeyComponent,
  P256SignatureComponentArrayBuffer,
  RSAKeyPair,
  SHA256Hash,
  Signature,
  SignerUnavailableError,
  SolanaAccountAddress,
  SolanaPrivateKey,
  SuiAccountAddress,
  TokenAndSecret,
  TokenId,
  URLString,
  UUID,
} from "@snickerdoodlelabs/objects";
import { TypedDataDomain, TypedDataField, ethers } from "ethers";
import { ResultAsync } from "neverthrow";

export interface ICryptoUtils {
  getUUID(): UUID;
  getNonce(nonceSize?: number): ResultAsync<Base64String, never>;
  getTokenId(): ResultAsync<TokenId, never>;
  getTokenIds(quantity: number): ResultAsync<TokenId[], never>;

  /**
   * Creates a new 4096 bit RSA public/private keypair. There's no way to derive a valid RSA key
   * via PBKDF2. The resulting keys are PEM encoded but not encrypted
   */
  createRSAKeyPair(): ResultAsync<RSAKeyPair, KeyGenerationError>;
  createAESKey(): ResultAsync<AESKey, never>;
  deriveAESKeyFromSignature(
    signature: Signature,
    salt: HexString,
  ): ResultAsync<AESKey, never>;
  deriveAESKeyFromString(
    source: string,
    salt: HexString,
  ): ResultAsync<AESKey, never>;

  deriveEVMPrivateKeyFromSignature(
    signature: Signature,
    salt: HexString,
  ): ResultAsync<EVMPrivateKey, never>;
  deriveEVMPrivateKeyFromString(
    source: string,
    salt: HexString,
  ): ResultAsync<EVMPrivateKey, never>;

  deriveAESKeyFromEVMPrivateKey(
    evmKey: EVMPrivateKey,
  ): ResultAsync<AESKey, never>;

  deriveCeramicSeedFromEVMPrivateKey(
    evmKey: EVMPrivateKey,
  ): ResultAsync<Uint8Array, never>;

  createEthereumPrivateKey(): ResultAsync<EVMPrivateKey, never>;

  getEd25519PublicKeyFromPrivateKey(
    privateKey: string,
  ): ResultAsync<string, never>;

  getEthereumAccountAddressFromPrivateKey(
    privateKey: EVMPrivateKey,
  ): EVMAccountAddress;

  verifyEVMSignature(
    message: string | Uint8Array,
    signature: Signature,
  ): ResultAsync<EVMAccountAddress, never>;

  verifySolanaSignature(
    message: string,
    signature: Signature,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<boolean, never>;

  verifySuiSignature(
    message: string,
    signature: Signature,
    accountAddress: SuiAccountAddress,
  ): ResultAsync<boolean, never>;

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

  signMessage(
    message: string,
    privateKey: EVMPrivateKey,
  ): ResultAsync<Signature, never>;

  signMessageSolana(
    message: string,
    privateKey: SolanaPrivateKey,
  ): ResultAsync<Signature, never>;

  signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, unknown>,
    privateKey: EVMPrivateKey,
  ): ResultAsync<Signature, never>;

  hashStringSHA256(message: string): ResultAsync<SHA256Hash, never>;
  // hashStringArgon2(message: string): ResultAsync<Argon2Hash, never>;
  // verifyHashArgon2(
  //   hash: Argon2Hash,
  //   message: string,
  // ): ResultAsync<boolean, never>;

  xmur3(str: string): () => number;
  sfc32(a: number, b: number, c: number, d: number): () => number;
  randomInt(randomFunc: () => number, low: number, high: number): number;
  randomBytes(length: number, seed: string): Uint8Array;
  getSignature(
    owner: ethers.JsonRpcSigner | ethers.Wallet,
    types: Array<string>,
    values: Array<
      bigint | string | HexString | EVMContractAddress | EVMAccountAddress
    >,
  ): ResultAsync<Signature, InvalidParametersError>;

  packOAuth1Credentials(
    config: OAuth1Config,
    url: URLString,
    method: string,
    pathAndBodyParams?: object,
    accessTokenAndSecret?: TokenAndSecret,
  ): string;

  getNobleED25519Signer(privateKey: string): NobleEd25519Signer;

  getNobleED25519SignerPublicKey(
    ed25519Signer: NobleEd25519Signer,
  ): ResultAsync<ED25519PublicKey, SignerUnavailableError>;

  generateEd25519KeyPair(): ResultAsync<
    NobleED25519KeyPair,
    KeyGenerationError
  >;

  parseRawPublicKey(id, publicKeyArray: ArrayBuffer): P256PublicKeyComponent;

  parseRawP256Signature(
    signatureArray,
    msgPayload,
  ): P256SignatureComponentArrayBuffer;
}

export const ICryptoUtilsType = Symbol.for("ICryptoUtils");
