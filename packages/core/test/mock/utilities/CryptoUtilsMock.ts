import { TypedDataDomain, TypedDataField } from "@ethersproject/abstract-signer";
import { CryptoUtils } from "@snickerdoodlelabs/common-utils";
import { EVMPrivateKey, Signature } from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

export class CryptoUtilsMock extends CryptoUtils {
    
  public signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, unknown>,
    privateKey: EVMPrivateKey,
  ): ResultAsync<Signature, never> {
    return okAsync(Signature("Fake signature"));
  }

//   public getNonce(nonceSize?: number): ResultAsync<string, never> {
//     return okAsync('');
//   }

//   getTokenId(): ResultAsync<TokenId, never>{
//     return okAsync('');
//   }

//   createAESKey(): ResultAsync<AESKey, never>{
//     return okAsync('');
//   }
//   deriveAESKeyFromSignature(
//     signature: Signature,
//     salt: HexString,
//   ): ResultAsync<AESKey, never>{
//     return okAsync('');
//   }

//   createEthereumPrivateKey(): ResultAsync<EVMPrivateKey, never>;
//   getEthereumAccountAddressFromPrivateKey(
//     privateKey: EVMPrivateKey,
//   ): EVMAccountAddress{
//     return okAsync('');
//   }

//   verifySignature(
//     message: string,
//     signature: Signature,
//   ): ResultAsync<EVMAccountAddress, never>{
//     return okAsync('');
//   }
//   verifyTypedData(
//     domain: TypedDataDomain,
//     types: Record<string, Array<TypedDataField>>,
//     value: Record<string, unknown>,
//     signature: Signature,
//   ): ResultAsync<EVMAccountAddress, never>{
//     return okAsync('');
//   }

//   encryptString(
//     secret: string,
//     encryptionKey: AESKey,
//   ): ResultAsync<AESEncryptedString, never>{
//     return okAsync('');
//   }

//   decryptAESEncryptedString(
//     encrypted: AESEncryptedString,
//     encryptionKey: AESKey,
//   ): ResultAsync<string, never>{
//     return okAsync('');
//   }

//   // generateKeyPair(): ResultAsync<void, never>;

//   signMessage(
//     message: string,
//     privateKey: EVMPrivateKey,
//   ): ResultAsync<Signature, never>{
//     return okAsync('');
//   }

//   hashStringSHA256(message: string): ResultAsync<SHA256Hash, never>{
//     return okAsync('');
//   }
//   hashStringArgon2(message: string): ResultAsync<Argon2Hash, never>{
//     return okAsync('');
//   }
//   verifyHashArgon2(
//     hash: Argon2Hash,
//     message: string,
//   ): ResultAsync<boolean, never>{
//     return okAsync('');
//   }

//   xmur3(str: string): () => number{
//     return okAsync('');
//   }
//   sfc32(a: number, b: number, c: number, d: number): () => number{
//     return okAsync('');
//   }
//   randomInt(randomFunc: () => number, low: number, high: number): number{
//     return okAsync('');
//   }
//   randomBytes(length: number, seed: string): Uint8Array{
//     return okAsync('');
//   }
}