import {
  Age,
  ClickData,
  ClickFilter,
  EmailAddressString,
  GivenName,
  Gender,
  EVMAccountAddress,
  EVMContractAddress,
  EVMPrivateKey,
  EVMTransaction,
  IDataWalletPersistence,
  FamilyName,
  CountryCode,
  PersistenceError,
  SiteVisit,
  UnixTimestamp,
  ChainId,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";

import { LocalStorageUtils } from "@snickerdoodlelabs/utils";


import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { Container } from "inversify";
import { IConfigProvider } from "@core/interfaces/utilities";
import { snickerdoodleCoreModule } from "@core/implementations/SnickerdoodleCore.module";
import { IConfigOverrides } from "@snickerdoodlelabs/objects";

import { IConfigProviderType } from "@core/interfaces/utilities";

import {
  IProfileService,
  IProfileServiceType,
} from "@core/interfaces/business";


import { IAccountIndexingType } from "@snickerdoodlelabs/objects";
import { DefaultAccountIndexers } from "@snickerdoodlelabs/indexers";
import { IAccountIndexing } from "@snickerdoodlelabs/objects";
import { IDataWalletPersistenceType } from "@snickerdoodlelabs/objects";
import { BlockNumber } from "@snickerdoodlelabs/objects";
import { AccountIndexingError } from "@snickerdoodlelabs/objects";


enum ELocalStorageKey {
  ACCOUNT = "SD_Accounts",
  AGE = "SD_Age",
  SITE_VISITS = "SD_SiteVisits",
  TRANSACTIONS = "SD_Transactions",
  FIRST_NAME = "SD_GivenName",
  LAST_NAME = "SD_FamilyName",
  BIRTHDAY = "SD_Birthday",
  GENDER = "SD_Gender",
  EMAIL = "SD_Email",
  LOCATION = "SD_Location",
}

/**
 * This class is where we should implement the cloud-based data wallet persistence.
 * I think we can use Ceramic and/or bare IPFS to do this, so that the wallet data
 * can be accessed anywhere.
 */
@injectable()
export class DefaultDataWalletPersistence implements IDataWalletPersistence {
  protected walletUnlockSuccessful = false;
  protected unlocked;
  protected iocContainer: Container = new Container();
  protected profileService: IProfileService;

  /* Obsolete - used in local storage*/
  
  private _checkAndRetrieveValue<T>(
    key: ELocalStorageKey,
  ): ResultAsync<T, PersistenceError> {
    const value = LocalStorageUtils.readLocalStorage(ELocalStorageKey.AGE);
    if (!value) {
      return errAsync(
        new PersistenceError(`Key ${key} is not found in Local Storage!`),
      );
    }
    return okAsync(value as T);
  }
  


  public constructor(
    configOverrides?: IConfigOverrides,
    persistence?: IDataWalletPersistence,
    accountIndexer?: IAccountIndexing,
  ) {
    this.iocContainer = new Container();

    // Elaborate syntax to demonstrate that we can use multiple modules
    this.iocContainer.load(...[snickerdoodleCoreModule]);

    // If persistence is provided, we need to hook it up. If it is not, we will use the default
    // persistence.
    if (persistence != null) {
      this.iocContainer
        .bind(IDataWalletPersistenceType)
        .toConstantValue(persistence);
    } else {
      this.iocContainer
        .bind(IDataWalletPersistenceType)
        .to(DefaultDataWalletPersistence)
        .inSingletonScope();
    }
    this.profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);

    // If an Account Indexer is provided, hook it up. If not we'll use the default.
    if (accountIndexer != null) {
      this.iocContainer
        .bind(IAccountIndexingType)
        .toConstantValue(accountIndexer);
    } else {
      this.iocContainer
        .bind(IAccountIndexingType)
        .to(DefaultAccountIndexers)
        .inSingletonScope();
    }

    // Setup the config
    if (configOverrides != null) {
      const configProvider =
        this.iocContainer.get<IConfigProvider>(IConfigProviderType);

      configProvider.setConfigOverrides(configOverrides);
    }
  }


  /**
   * This method is called on the IDataWalletPersistence after the data wallet's derived
   * key is determined. All other methods should not return UNTIL after unlock is complete.
   * This means that if I call addAccount() before unlock(), addAccount() should not resolve,
   * indefinately. Once unlock() is complete, the outstanding call to addAccount() can continue.
   * This is trivially implemented internally by maintaining a consistent unlocked ResultAsync,
   * and using "return this.unlocked.andThen()" at the beginning of the other methods.
   * @param derivedKey
   */
  public unlock(
    derivedKey: EVMPrivateKey,
  ): ResultAsync<void, PersistenceError> {
    /* if true, then unlocked is successful */

    /*
    if (this.walletUnlockSuccessful == false) {
      throw new Error("Method not implemented.");
    }
    */
    /*  now have a consistent unlocked resultasync  */

    /*
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.unlock(accountAddress, signature, languageCode);
    */
    return okAsync(undefined);
  }

  setLocation(location: CountryCode): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.LOCATION, location);
    return okAsync(undefined);
  }
  getLocation(): ResultAsync<CountryCode, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.LOCATION);
  }
  setAge(age: Age): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.AGE, age);
    return okAsync(undefined);
  }
  getAge(): ResultAsync<Age, PersistenceError> {
    return okAsync(Age(28));
  }
  setGivenName(name: GivenName): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.FIRST_NAME, name);
    return okAsync(undefined);
  }
  getGivenName(): ResultAsync<GivenName, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.FIRST_NAME);
  }
  setFamilyName(name: FamilyName): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.FIRST_NAME, name);
    return okAsync(undefined);
  }
  getFamilyName(): ResultAsync<FamilyName, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.LAST_NAME);
  }
  setBirthday(birthday: UnixTimestamp): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.BIRTHDAY, birthday);
    return okAsync(undefined);
  }
  getBirthday(): ResultAsync<UnixTimestamp, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.BIRTHDAY);
  }
  setGender(gender: Gender): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.GENDER, gender);
    return okAsync(undefined);
  }
  getGender(): ResultAsync<Gender, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.GENDER);
  }
  setEmail(email: EmailAddressString): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.EMAIL, email);
    return okAsync(undefined);
  }
  getEmail(): ResultAsync<EmailAddressString, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.EMAIL);
  }

  /**
   * This method adds an ethereum account to the data wallet. Only these accounts may unlock the
   * wallet.
   * @param accountAddress
   */
  public addAccount(
    accountAddress: EVMAccountAddress,
  ): ResultAsync<void, PersistenceError> {
    const accounts = LocalStorageUtils.readLocalStorage(
      ELocalStorageKey.ACCOUNT,
    );
    LocalStorageUtils.writeLocalStorage(
      ELocalStorageKey.ACCOUNT,
      Array.from(new Set([accountAddress, ...(accounts ?? [])])),
    );
    return okAsync(undefined);
  }

  /**
   * This is an example method for adding data to the wallet. In this case, it would be a "click",
   * presumeably captured by the Form Factor.
   */
  public addClick(click: ClickData): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getClicks(
    clickFilter: ClickFilter,
  ): ResultAsync<ClickData, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getAccounts(): ResultAsync<EVMAccountAddress[], PersistenceError> {
    throw new Error("Method not implemented.");
  }



  public getRejectedCohorts(): ResultAsync<
    EVMContractAddress[],
    PersistenceError
  > {
    throw new Error("Method not implemented.");
  }

  public addRejectedCohorts(
    consentContractAddresses: EVMContractAddress[],
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public addSiteVisits(
    siteVisits: SiteVisit[],
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public addEthereumTransactions(
    transactions: EVMTransaction[],
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getLatestTransactionForAccount(
    chainId: ChainId,
    address: EVMAccountAddress,
  ): ResultAsync<EVMTransaction | null, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public addEVMTransactions(
    transactions: EVMTransaction[],
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getSiteVisits(): ResultAsync<SiteVisit[], PersistenceError> {
    throw new Error("Method not implemented.");
  }

  getEVMTransactions(
    accountAddress: EVMAccountAddress,
    firstBlock: BlockNumber,
    lastBlock?: BlockNumber | undefined,
  ): ResultAsync<EVMTransaction[], AccountIndexingError>{
    let transactions : EVMTransaction[] = [];
    return okAsync(transactions);
  }


}
