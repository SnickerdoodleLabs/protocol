import {
  AccountAddress,
  AESKey,
  EChain,
  EVMAccountAddress,
  EVMContractAddress,
  EVMPrivateKey,
  ExternallyOwnedAccount,
  Signature,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IDataWalletUtils {
  createDataWalletKey(): ResultAsync<EVMPrivateKey, never>;
  deriveEncryptionKeyFromSignature(
    accountAddress: AccountAddress,
    signature: Signature,
  ): ResultAsync<AESKey, never>;

  getDerivedEVMAccountFromSignature(
    accountAddress: AccountAddress,
    signature: Signature,
  ): ResultAsync<ExternallyOwnedAccount, never>;

  /**
   * This is a cross-chain technology wrapper for verifying a message was signed by the account address
   * in question
   * @param chain
   * @param accountAddress
   * @param signature
   * @param message
   */
  verifySignature(
    chain: EChain,
    accountAddress: AccountAddress,
    signature: Signature,
    message: string,
  ): ResultAsync<boolean, never>;

  /**
   * Returns a new private key specific for a consent contract
   * @param consentContractAddress
   * @param dataWalletKey
   */
  deriveOptInPrivateKey(
    consentContractAddress: EVMContractAddress,
    dataWalletKey: EVMPrivateKey,
  ): ResultAsync<EVMPrivateKey, never>;

  /**
   * Returns a new address specific for a consent contract
   * @param consentContractAddress
   * @param dataWalletKey
   */
  deriveOptInAccountAddress(
    consentContractAddress: EVMContractAddress,
    dataWalletKey: EVMPrivateKey,
  ): ResultAsync<EVMAccountAddress, never>;
}

export const IDataWalletUtilsType = Symbol.for("IDataWalletUtils");
