import {
  BlockchainProviderError,
  ConsentContractError,
  ConsentError,
  ConsentFactoryContractError,
  ConsentToken,
  EVMContractAddress,
  HexString32,
  PersistenceError,
  TBlockchainCommonErrors,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IConsentTokenUtils {
  getCurrentConsentToken(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    ConsentToken | null,
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | ConsentError
    | PersistenceError
    | TBlockchainCommonErrors
  >;

  getAgreementFlags(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    HexString32,
    | PersistenceError
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | ConsentError
    | ConsentFactoryContractError
    | TBlockchainCommonErrors
  >;
}

export const IConsentTokenUtilsType = Symbol.for("IConsentTokenUtils");
