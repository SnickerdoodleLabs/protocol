import {
  ConsentContract,
  ConsentFactoryContract,
  CrumbsContract,
  MinimalForwarderContract,
} from "@snickerdoodlelabs/contracts-sdk";
import {
  chainConfig,
  ChainId,
  ConsentFactoryContractError,
  ControlChainInformation,
  EVMAccountAddress,
  EVMContractAddress,
  EVMPrivateKey,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { localChainAccounts } from "@test-harness/LocalChainAccounts";
const defaultConsentContractAddress = EVMContractAddress("");

export class BlockchainStuff {
  public serverSigner: ethers.Wallet;
  public accountWallet: ethers.Wallet;
  public accountAddress: EVMAccountAddress;
  public provider: ethers.providers.JsonRpcProvider;
  public consentFactoryContract: ConsentFactoryContract;
  public crumbsContract: CrumbsContract;
  public minimalForwarder: MinimalForwarderContract;

  public serverAccount = localChainAccounts[0];
  public businessAccount = localChainAccounts[1];

  public consentContracts = new Map<EVMContractAddress, ConsentContract>();

  public constructor(public accountPrivateKey: EVMPrivateKey) {
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

    this.accountWallet = new ethers.Wallet(accountPrivateKey, this.provider);
    this.accountAddress = EVMAccountAddress(this.accountWallet.address);

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

  public createConsentContract(): ResultAsync<
    EVMContractAddress,
    ConsentFactoryContractError
  > {
    return this.consentFactoryContract
      .createConsent(this.businessAccount.accountAddress, "this is a base uri")
      .map((contractAddress) => {
        // Got the new consent contract address
        // Create the contract wrapper
        this.consentContracts.set(
          contractAddress,
          new ConsentContract(this.serverSigner, contractAddress),
        );
        return contractAddress;
      });
  }
}
