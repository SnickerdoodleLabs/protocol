import {
  ClickData,
  ClickFilter,
  EthereumAccountAddress,
  EthereumContractAddress,
  EthereumPrivateKey,
  EthereumTransaction,
  IDataWalletPersistence,
  PersistenceError,
  SiteVisit,
} from "@snickerdoodlelabs/objects";
import { LocalStorageUtils } from "@snickerdoodlelabs/utils";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

enum ELocalStorageKey {
  ACCOUNT = "SD_Accounts",
  AGE = "SD_Age",
}

export const LocalStoragePersistence: IDataWalletPersistence = {
  unlock(derivedKey: EthereumPrivateKey): ResultAsync<void, PersistenceError> {
    return okAsync(undefined);
    throw new Error("Method not implemented.");
  },
  getAccounts(): ResultAsync<EthereumAccountAddress[], PersistenceError> {
    const accounts = LocalStorageUtils.readLocalStorage(
      ELocalStorageKey.ACCOUNT,
    );
    if (!accounts) {
      return errAsync(
        new PersistenceError("Key is not found in Local Storage!"),
      );
    }
    return okAsync(accounts);
  },
  addClick(click: ClickData): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  },
  getClicks(
    clickFilter: ClickFilter,
  ): ResultAsync<ClickData, PersistenceError> {
    throw new Error("Method not implemented.");
  },
  setAge(age: number): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.AGE, age);
    return okAsync(undefined);
  },
  getAge(): ResultAsync<number, PersistenceError> {
    const age = LocalStorageUtils.readLocalStorage(ELocalStorageKey.AGE);
    if (!age) {
      return errAsync(
        new PersistenceError("Key is not found in Local Storage!"),
      );
    }
    return okAsync(age);
  },
  getRejectedCohorts(): ResultAsync<
    EthereumContractAddress[],
    PersistenceError
  > {
    throw new Error("Method not implemented.");
  },
  addRejectedCohorts(
    consentContractAddresses: EthereumContractAddress[],
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  },
  addSiteVisits(siteVisits: SiteVisit[]): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  },
  addEthereumTransactions(
    transactions: EthereumTransaction[],
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  },
  addAccount(
    accountAddress: EthereumAccountAddress,
  ): ResultAsync<void, PersistenceError> {
    const accounts = LocalStorageUtils.readLocalStorage(
      ELocalStorageKey.ACCOUNT,
    );
    LocalStorageUtils.writeLocalStorage(
      ELocalStorageKey.ACCOUNT,
      Array.from(new Set([accountAddress, ...(accounts ?? [])])),
    );
    return okAsync(undefined);
  },
};
