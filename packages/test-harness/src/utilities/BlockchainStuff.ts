import { CryptoUtils } from "@snickerdoodlelabs/common-utils";
import {
  ConsentContract,
  ConsentFactoryContract,
  CrumbsContract,
  MinimalForwarderContract,
  WrappedTransactionResponse,
} from "@snickerdoodlelabs/contracts-sdk";
import {
  AccountAddress,
  BaseURI,
  chainConfig,
  ChainId,
  ConsentContractError,
  ConsentFactoryContractError,
  ConsentName,
  ControlChainInformation,
  DomainName,
  EVMContractAddress,
  IpfsCID,
  BlockchainCommonErrors,
  TransactionResponseError,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { localChainAccounts } from "@test-harness/mocks/LocalChainAccounts.js";
import { TestWallet } from "@test-harness/utilities/TestWallet.js";

export class BlockchainStuff {
  public serverSigner: ethers.Wallet;
  public businessSigner: ethers.Wallet;
  public provider: ethers.providers.JsonRpcProvider;
  public consentFactoryContract: ConsentFactoryContract;
  public crumbsContract: CrumbsContract;
  public minimalForwarder: MinimalForwarderContract;

  public serverAccount = localChainAccounts[0];
  public businessAccount = localChainAccounts[1];
  protected cryptoUtils = new CryptoUtils();
  public consentContracts = new Map<EVMContractAddress, ConsentContract>();

  public constructor(public accountWallets: TestWallet[]) {
    // Initialize a connection to the local blockchain
    this.provider = new ethers.providers.JsonRpcProvider(
      "http://localhost:8545",
      31337,
    );
    // We'll use account 0
    this.serverSigner = new ethers.Wallet(
      this.serverAccount.privateKey,
      this.provider,
    );

    this.businessSigner = new ethers.Wallet(
      this.businessAccount.privateKey,
      this.provider,
    );

    const doodleChain = chainConfig.get(
      ChainId(31337),
    ) as ControlChainInformation;
    this.consentFactoryContract = new ConsentFactoryContract(
      this.serverSigner,
      doodleChain.consentFactoryContractAddress,
    );
    this.crumbsContract = new CrumbsContract(
      this.serverSigner,
      doodleChain.crumbsContractAddress,
    );
    this.minimalForwarder = new MinimalForwarderContract(
      this.serverSigner,
      doodleChain.metatransactionForwarderAddress,
    );
  }

  public updateAccounts(newWallets: TestWallet[]) {
    this.accountWallets = newWallets;
  }

  public getWalletForAddress(accountAddress: AccountAddress): TestWallet {
    const wallet = this.accountWallets.find((wal) => {
      return wal.accountAddress == accountAddress;
    });

    if (wallet == null) {
      throw new Error(`No wallet found for account address ${accountAddress}`);
    }

    return wallet;
  }

  public getConsentContract(
    contractAddress: EVMContractAddress,
  ): ConsentContract {
    const consentContract = this.consentContracts.get(contractAddress);
    if (consentContract == null) {
      throw new Error(
        `Um, consent contract ${contractAddress} does not exist!`,
      );
    }
    return consentContract;
  }

  public createConsentContract(
    name: ConsentName,
    domain: DomainName,
    metadataCID: IpfsCID,
  ): ResultAsync<
    EVMContractAddress,
    | BlockchainCommonErrors
    | ConsentFactoryContractError
    | ConsentContractError
    | TransactionResponseError
  > {
    return this.consentFactoryContract
      .createConsent(
        this.serverAccount.accountAddress, // The server account has all the permissions to start with. We'll add the business' account later
        BaseURI(metadataCID),
        name,
      )
      .andThen((txRes) => {
        return this.consentFactoryContract
          .getAddressOfConsentCreated(txRes)
          .map((deployedConsentAddress) => {
            // Got the new consent contract address
            // Create the contract wrapper
            const consentContract = new ConsentContract(
              this.serverSigner,
              deployedConsentAddress,
              this.cryptoUtils,
            );
            this.consentContracts.set(deployedConsentAddress, consentContract);

            return deployedConsentAddress;
          });
      });
  }

  public setConsentContractMaxCapacity(
    contractAddress: EVMContractAddress,
    maxCapacity: number,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ConsentContractError
  > {
    const contract = this.getConsentContract(contractAddress);

    return contract.updateMaxCapacity(maxCapacity);
  }
}
