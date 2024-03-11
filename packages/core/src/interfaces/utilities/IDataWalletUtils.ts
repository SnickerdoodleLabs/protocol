import {
  AccountAddress,
  AESKey,
  DataWalletAddress,
  EChain,
  EVMAccountAddress,
  EVMContractAddress,
  EVMPrivateKey,
  ExternallyOwnedAccount,
  OptInInfo,
  PasswordString,
  Signature,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IDataWalletUtils {
  createDataWalletKey(): ResultAsync<EVMPrivateKey, never>;
  deriveEncryptionKeyFromSignature(
    accountAddress: AccountAddress,
    signature: Signature,
  ): ResultAsync<AESKey, never>;
  deriveEncryptionKeyFromPassword(
    password: PasswordString,
  ): ResultAsync<AESKey, never>;

  getDerivedEVMAccountFromSignature(
    accountAddress: AccountAddress,
    signature: Signature,
  ): ResultAsync<ExternallyOwnedAccount, never>;

  getDerivedEVMAccountFromPassword(
    password: PasswordString,
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

  verifyTypedDataSignature(
    accountAddress: AccountAddress,
    domain: ethers.TypedDataDomain,
    types: Record<string, Array<ethers.TypedDataField>>,
    value: Record<string, unknown>,
    signature: Signature,
    chain: EChain,
  ): ResultAsync<boolean, never>;

  /**
   * Returns the key opt in info for a consent contract. This is derived from the data wallet key
   * and can be regenerated on demand.
   * @param consentContractAddress
   * @param dataWalletKey
   */
  deriveOptInInfo(
    consentContractAddress: EVMContractAddress,
    dataWalletKey: DataWalletAddress,
  ): ResultAsync<OptInInfo, never>;
}

export const IDataWalletUtilsType = Symbol.for("IDataWalletUtils");
