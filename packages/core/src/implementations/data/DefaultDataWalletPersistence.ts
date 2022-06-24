import {
  ClickData,
  ClickFilter,
  EthereumAccountAddress,
  EthereumContractAddress,
  EthereumPrivateKey,
  IDataWalletPersistence,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

/**
 * This class is where we should implement the cloud-based data wallet persistence.
 * I think we can use Ceramic and/or bare IPFS to do this, so that the wallet data
 * can be accessed anywhere.
 */
export class DefaultDataWalletPersistence implements IDataWalletPersistence {
  public unlock(
    derivedKey: EthereumPrivateKey,
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public addAccount(
    accountAddress: EthereumAccountAddress,
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getAccounts(): ResultAsync<
    EthereumAccountAddress[],
    PersistenceError
  > {
    throw new Error("Method not implemented.");
  }

  public addClick(click: ClickData): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getClicks(
    clickFilter: ClickFilter,
  ): ResultAsync<ClickData, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public setAge(age: number): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getAge(): ResultAsync<number, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getRejectedCohorts(): ResultAsync<
    EthereumContractAddress[],
    PersistenceError
  > {
    throw new Error("Method not implemented.");
  }

  public addRejectedCohorts(
    consentContractAddresses: EthereumContractAddress[],
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }
}
