import {
  AESEncryptedString,
  BlockchainProviderError,
  EVMAccountAddress,
  LanguageCode,
  TokenId,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ILoginRegistryRepository {
  /** getCrumb() returns the encrypted private key for the data wallet stored on the DoodleChain
   * if it exists for the account address and language, or null if the token is
   * not yet minted
   */
  getCrumb(
    accountAddress: EVMAccountAddress,
    languageCode: LanguageCode,
  ): ResultAsync<AESEncryptedString | null, BlockchainProviderError>;

  addCrumb(
    accountAddress: EVMAccountAddress,
    languageCode: LanguageCode,
    encryptedDataWalletKey: AESEncryptedString,
  ): ResultAsync<TokenId, BlockchainProviderError>;
}

export const ILoginRegistryRepositoryType = Symbol.for(
  "ILoginRegistryRepository",
);
