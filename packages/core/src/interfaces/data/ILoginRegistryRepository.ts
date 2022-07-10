import {
  AESEncryptedString,
  BlockchainProviderError,
  ConsentContractError,
  EVMAccountAddress,
  LanguageCode,
  TokenId,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ILoginRegistryRepository {
  /** getCrumb() returns the encrypted private key for the data wallet stored on the DoodleChain
   * if it exists for the account address, or null if the token is
   * not yet minted
   */
  getCrumb(
    accountAddress: EVMAccountAddress,
    languageCode: LanguageCode,
  ): ResultAsync<
    AESEncryptedString | null,
    BlockchainProviderError | UninitializedError | ConsentContractError
  >;

  addCrumb(
    accountAddress: EVMAccountAddress,
    encryptedDataWalletKey: AESEncryptedString,
    languageCode: LanguageCode,
  ): ResultAsync<
    TokenId,
    BlockchainProviderError | UninitializedError | ConsentContractError
  >;
}

export const ILoginRegistryRepositoryType = Symbol.for(
  "ILoginRegistryRepository",
);
