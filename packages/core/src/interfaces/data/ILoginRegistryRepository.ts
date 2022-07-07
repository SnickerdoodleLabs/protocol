import {
  AESEncryptedString,
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  DataWalletAddress,
  EVMAccountAddress,
  EVMPrivateKey,
  LanguageCode,
  TokenId,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { CrumbsContractError } from "@snickerdoodlelabs/objects";

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
    dataWalletAddress: DataWalletAddress,
    accountAddress: EVMAccountAddress,
    encryptedDataWalletKey: AESEncryptedString,
    languageCode: LanguageCode,
    dataWalletKey: EVMPrivateKey,
  ): ResultAsync<TokenId, AjaxError>;
}

export const ILoginRegistryRepositoryType = Symbol.for(
  "ILoginRegistryRepository",
);
