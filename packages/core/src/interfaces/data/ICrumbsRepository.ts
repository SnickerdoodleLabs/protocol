import {
  AESEncryptedString,
  BlockchainProviderError,
  CrumbsContractError,
  EVMAccountAddress,
  HexString,
  LanguageCode,
  TBlockchainCommonErrors,
  TokenId,
  TokenUri,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { CrumbCallData } from "@core/interfaces/objects/index.js";

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
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | TBlockchainCommonErrors
  >;

  getCrumbTokenId(
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    TokenId | null,
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | TBlockchainCommonErrors
  >;

  /**
   * Returns the encoded callData for a createCrumb metatransaction
   * @param languageCode
   * @param encryptedDataWalletKey
   */
  encodeCreateCrumb(
    languageCode: LanguageCode,
    encryptedDataWalletKey: AESEncryptedString,
  ): ResultAsync<CrumbCallData, BlockchainProviderError | UninitializedError>;

  encodeBurnCrumb(
    tokenId: TokenId,
  ): ResultAsync<HexString, BlockchainProviderError | UninitializedError>;

  /**
   * Returns the TokenURI of the crumb at tokenId, or null if the crumb doesn't exist.
   * @param tokenId
   */
  getURI(
    tokenId: TokenId,
  ): ResultAsync<
    TokenUri | null,
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | TBlockchainCommonErrors
  >;
}

export const ICrumbsRepositoryType = Symbol.for("ICrumbsRepository");
