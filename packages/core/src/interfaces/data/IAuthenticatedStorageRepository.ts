import {
  LinkedAccount,
  PersistenceError,
  AccountAddress,
  EVMContractAddress,
  EarnedReward,
  AuthenticatedStorageSettings,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IAuthenticatedStorageRepository {
  saveCredentials(
    settings: AuthenticatedStorageSettings,
  ): ResultAsync<void, PersistenceError>;

  clearCredentials(
    settings: AuthenticatedStorageSettings,
  ): ResultAsync<void, PersistenceError>;

  getCredentials(): ResultAsync<
    AuthenticatedStorageSettings | null,
    PersistenceError
  >;
  activateAuthenticatedStorage(
    settings: AuthenticatedStorageSettings,
  ): ResultAsync<void, PersistenceError>;
}

export const IAuthenticatedStorageRepositoryType = Symbol.for(
  "IAuthenticatedStorageRepositoryType",
);
