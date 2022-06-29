import {
  BlockchainProviderError,
  DerivationMask,
  EVMAccountAddress,
  LanguageCode,
  TokenId,
  UnsupportedLanguageError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

export interface ILoginRegistryRepository {
  /** getDerivationMask() returns the derivation mask stored on the DoodleChain
   * if it exists for the account address and language, or null if the token is
   * not yet minted
   */
  getDerivationMask(
    accountAddress: EVMAccountAddress,
    languageCode: LanguageCode,
  ): ResultAsync<DerivationMask | null, BlockchainProviderError>;

  addDerivationMask(
    accountAddress: EVMAccountAddress,
    languageCode: LanguageCode,
    derivationMask: DerivationMask,
  ): ResultAsync<TokenId, BlockchainProviderError>;
}

export const ILoginRegistryRepositoryType = Symbol.for(
  "ILoginRegistryRepository",
);
