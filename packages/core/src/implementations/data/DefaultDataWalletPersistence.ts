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
import { ResultAsync } from "neverthrow";

/**
 * This class is where we should implement the cloud-based data wallet persistence.
 * I think we can use Ceramic and/or bare IPFS to do this, so that the wallet data
 * can be accessed anywhere.
 */
@injectable()
export class DefaultDataWalletPersistence implements IDataWalletPersistence {
  protected walletUnlockSuccessful = false;
  protected unlocked;

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
    /* call to ipfs */
    /* if true, then unlocked is successful */
    this.walletUnlockSuccessful = true;

    /*  now have a consistent unlocked resultasync  */

    throw new Error("Method not implemented.");
  }

  /**
   * This method adds an ethereum account to the data wallet. Only these accounts may unlock the
   * wallet.
   * @param accountAddress
   */
  public addAccount(
    accountAddress: EVMAccountAddress,
  ): ResultAsync<void, PersistenceError> {
    if (!this.walletUnlockSuccessful) {
      //return new ResultAsync(undefined);
    }

    return this.unlocked.andThen(([accountAddress]) => {
      /*
            const currentBlockNumber = BlockNumber(currentBlock.number);
            const latestKnownBlockNumber =
              this.chainLatestKnownBlockNumber.get(chainId) || BlockNumber(-1);
      
            if (latestKnownBlockNumber < currentBlockNumber) {
              this.chainLatestKnownBlockNumber.set(chainId, currentBlockNumber);
      
              const isControlChain = chainId === config.controlChainId;
              if (isControlChain) {
                this.listenForConsentContractsEvents(currentBlockNumber);
              }
              this.monitorChain(currentBlockNumber, chainId, provider, accounts);
            }
      */
      //return okAsync(undefined);
    });

    throw new Error("Method not implemented.");
  }

  /**
   * This method returns all the Ethereum accounts that are registered in the data wallet.
   */
  public getAccounts(): ResultAsync<EVMAccountAddress[], PersistenceError> {
    if (!this.walletUnlockSuccessful) {
      //return new ResultAsync(undefined);
    }

    return this.unlocked.andThen();

    throw new Error("Method not implemented.");
  }

  /**
   * This is an example method for adding data to the wallet. In this case, it would be a "click",
   * presumeably captured by the Form Factor.
   */
  public addClick(click: ClickData): ResultAsync<void, PersistenceError> {
    if (!this.walletUnlockSuccessful) {
      //return new ResultAsync(undefined);
    }

    return this.unlocked.andThen();

    throw new Error("Method not implemented.");
  }

  public getClicks(
    clickFilter: ClickFilter,
  ): ResultAsync<ClickData, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public setAge(age: Age): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getAge(): ResultAsync<Age, PersistenceError> {
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

  public setGivenName(name: GivenName): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getGivenName(): ResultAsync<GivenName, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public setFamilyName(name: FamilyName): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getFamilyName(): ResultAsync<FamilyName, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public setBirthday(
    birthday: UnixTimestamp,
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getBirthday(): ResultAsync<UnixTimestamp, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public setGender(gender: Gender): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getGender(): ResultAsync<Gender, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public setEmail(
    email: EmailAddressString,
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getEmail(): ResultAsync<EmailAddressString, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public setLocation(
    location: CountryCode,
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getLocation(): ResultAsync<CountryCode, PersistenceError> {
    throw new Error("Method not implemented.");
  }
}
