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
} from "@snickerdoodlelabs/objects";
import { localChainAccounts } from "@test-harness/mocks/LocalChainAccounts.js";
import { TestWallet } from "@test-harness/utilities/TestWallet.js";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

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
    ConsentFactoryContractError | ConsentContractError
  > {
    return this.consentFactoryContract
      .createConsent(
        this.serverAccount.accountAddress, // The server account has all the permissions to start with. We'll add the business' account later
        BaseURI(metadataCID),
        name,
      )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new ConsentFactoryContractError(
            "Wait for createConsent() failed",
            "Unknown",
            e,
          );
        });
      })
      .map((receipt) => {
        // Get the hash of the event
        const event = "ConsentDeployed(address,address)";
        const eventHash = ethers.utils.keccak256(
          ethers.utils.toUtf8Bytes(event),
        );

        // Filter out for the ConsentDeployed event from the receipt's logs
        // returns an array
        const consentDeployedLog = receipt.logs.filter(
          (_log) => _log.topics[0] == eventHash,
        );

        // access the data and topics from the filtered log
        const data = consentDeployedLog[0].data;
        const topics = consentDeployedLog[0].topics;

        // Declare a new interface
        const Interface = ethers.utils.Interface;
        const iface = new Interface([
          "event ConsentDeployed(address indexed owner, address indexed consentAddress)",
        ]);

        // Decode the log from the given data and topic
        const decodedLog = iface.decodeEventLog(
          "ConsentDeployed",
          data,
          topics,
        );

        const deployedConsentAddress: EVMContractAddress =
          decodedLog.consentAddress;

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
  }

  public setConsentContractMaxCapacity(
    contractAddress: EVMContractAddress,
    maxCapacity: number,
  ): ResultAsync<WrappedTransactionResponse, ConsentContractError> {
    const contract = this.getConsentContract(contractAddress);

    return contract.updateMaxCapacity(maxCapacity);
  }
}
