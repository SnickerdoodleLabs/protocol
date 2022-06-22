import { ResultAsync } from "neverthrow";

import { ClickData } from "@objects/businessObjects";
import { PersistenceError } from "@objects/errors";
import {
  EthereumAccountAddress,
  EthereumPrivateKey,
} from "@objects/primatives";

/**
 * This is technically a repository, but since the form factor may need to override where
 * data is put, we hoist it into the objects package.
 * Hopefully, we can just have a single implementation of this that uses perhaps Ceramic
 * and/or IPFS to hold all the data, but in the meantime, we may need local storage versions.
 *
 *
 */
export interface IDataWalletPersistence {
  /**
   * This method is called on the IDataWalletPersistence after the data wallet's derived
   * key is determined. All other methods should not return UNTIL after unlock is complete.
   * This means that if I call addAccount() before unlock(), addAccount() should not resolve,
   * indefinately. Once unlock() is complete, the outstanding call to addAccount() can continue.
   * This is trivially implemented internally by maintaining a consistent unlocked ResultAsync,
   * and using "return this.unlocked.andThen()" at the beginning of the other methods.
   * @param derivedKey
   */
  unlock(derivedKey: EthereumPrivateKey): ResultAsync<void, PersistenceError>;

  /**
   * This method adds an ethereum account to the data wallet. Only these accounts may unlock the
   * wallet.
   * @param accountAddress
   */
  addAccount(
    accountAddress: EthereumAccountAddress,
  ): ResultAsync<void, PersistenceError>;

  /**
   * This method returns all the Ethereum accounts that are registered in the data wallet.
   */
  getAccounts(): ResultAsync<EthereumAccountAddress[], PersistenceError>;

  /**
   * This is an example method for adding data to the wallet. In this case, it would be a "click",
   * presumeably captured by the Form Factor.
   */
  addClick(click: ClickData): ResultAsync<void, PersistenceError>;
}

export const IDataWalletPersistenceType = Symbol.for("IDataWalletPersistence");
