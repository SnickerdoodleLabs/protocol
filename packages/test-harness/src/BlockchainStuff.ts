import { CryptoUtils } from "@snickerdoodlelabs/common-utils";
import {
  ConsentContract,
  ConsentFactoryContract,
  CrumbsContract,
  MinimalForwarderContract,
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
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { localChainAccounts } from "@test-harness/LocalChainAccounts.js";
import { TestWallet } from "@test-harness/TestWallet.js";

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
      31338,
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
      ChainId(31338),
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
    ConsentFactoryContractError | ConsentContractError
  > {
    return this.consentFactoryContract
      .createConsent(
        this.serverAccount.accountAddress, // The server account has all the permissions to start with. We'll add the business' account later
        BaseURI(metadataCID),
        name,
      )
      .map((contractAddress) => {
        // Got the new consent contract address
        // Create the contract wrapper
        const consentContract = new ConsentContract(
          this.serverSigner,
          contractAddress,
          this.cryptoUtils,
        );
        this.consentContracts.set(contractAddress, consentContract);

        return contractAddress;
      });
  }
}
