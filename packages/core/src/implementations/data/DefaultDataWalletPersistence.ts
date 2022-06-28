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
import { ResultAsync } from "neverthrow";

/**
 * This class is where we should implement the cloud-based data wallet persistence.
 * I think we can use Ceramic and/or bare IPFS to do this, so that the wallet data
 * can be accessed anywhere.
 */
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
    derivedKey: EthereumPrivateKey,
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
    accountAddress: EthereumAccountAddress,
  ): ResultAsync<void, PersistenceError> {

    if (this.walletUnlockSuccessful = false) {
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
  public getAccounts(): ResultAsync<
    EthereumAccountAddress[],
    PersistenceError
  > {

    if (this.walletUnlockSuccessful = false) {
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

    if (this.walletUnlockSuccessful = false) {
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

  public addSiteVisits(
    siteVisits: SiteVisit[],
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public addEthereumTransactions(
    transactions: EthereumTransaction[],
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

    throw new Error("Method not implemented.");
  }


}
