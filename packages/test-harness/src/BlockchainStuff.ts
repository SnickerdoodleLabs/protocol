import {
  ConsentContract,
  ConsentFactoryContract,
  CrumbsContract,
  MinimalForwarderContract,
} from "@snickerdoodlelabs/contracts-sdk";
import {
  BaseURI,
  chainConfig,
  ChainId,
  ConsentContractError,
  ConsentFactoryContractError,
  ConsentName,
  ControlChainInformation,
  DomainName,
  EVMAccountAddress,
  EVMContractAddress,
  EVMPrivateKey,
  IpfsCID,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { localChainAccounts } from "@test-harness/LocalChainAccounts";

export class BlockchainStuff {
  public serverSigner: ethers.Wallet;
  public businessSigner: ethers.Wallet;
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

    this.businessSigner = new ethers.Wallet(
      this.businessAccount.privateKey,
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
      .andThen((contractAddress) => {
        // Got the new consent contract address
        // Create the contract wrapper
        const consentContract = new ConsentContract(
          this.serverSigner,
          contractAddress,
        );
        this.consentContracts.set(contractAddress, consentContract);

        return ResultUtils.combine([consentContract.addDomain(domain)]).map(
          () => {
            return contractAddress;
          },
        );
      });
  }
}
