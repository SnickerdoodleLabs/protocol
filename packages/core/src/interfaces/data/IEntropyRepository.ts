import {
  PersistenceError,
  ExternallyOwnedAccount,
  EVMPrivateKey,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IEntropyRepository {
  /**
   * This method returns the ethereum key that is used as the source entropy
   * of the data wallet. All derived keys are derived from this key.
   * The key is stored in the volatile storage as field data
   */
  getDataWalletPrivateKey(): ResultAsync<
    ExternallyOwnedAccount | null,
    PersistenceError
  >;

  /**
   * This method creates a new ethereum key that is used as the source entropy.
   */
  createDataWalletPrivateKey(): ResultAsync<
    ExternallyOwnedAccount,
    PersistenceError
  >;

  setDataWalletPrivateKey(
    dataWalletPrivateKey: EVMPrivateKey,
  ): ResultAsync<void, PersistenceError>;
}

export const IEntropyRepositoryType = Symbol.for("IEntropyRepository");
