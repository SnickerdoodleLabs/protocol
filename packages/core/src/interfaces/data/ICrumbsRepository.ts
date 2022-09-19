import {
  AESEncryptedString,
  BlockchainProviderError,
  CrumbsContractError,
  EVMAccountAddress,
  LanguageCode,
  TokenId,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICrumbsRepository {
  /** getCrumb() returns the encrypted private key for the data wallet stored on the DoodleChain
   * if it exists for the account address, or null if the token is
   * not yet minted
   */
  getCrumb(
    accountAddress: EVMAccountAddress,
    languageCode: LanguageCode,
  ): ResultAsync<
    AESEncryptedString | null,
    BlockchainProviderError | UninitializedError | CrumbsContractError
  >;

  getCrumbTokenId(
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    TokenId | null,
    BlockchainProviderError | UninitializedError | CrumbsContractError
  >;
}

export const ICrumbsRepositoryType = Symbol.for("ICrumbsRepository");
