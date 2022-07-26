import {
  ConsentContract,
  CrumbsContract,
  MinimalForwarderContract,
} from "@snickerdoodlelabs/contracts-sdk";
import {
  chainConfig,
  ChainId,
  ControlChainInformation,
  EVMAccountAddress,
  EVMContractAddress,
  EVMPrivateKey,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";

import { localChainAccounts } from "@test-harness/LocalChainAccounts";
const defaultConsentContractAddress = EVMContractAddress("");

export class BlockchainStuff {
  public serverSigner: ethers.Wallet;
  public accountWallet: ethers.Wallet;
  public accountAddress: EVMAccountAddress;
  public provider: ethers.providers.JsonRpcProvider;
  public consentContract: ConsentContract;
  public crumbsContract: CrumbsContract;
  public minimalForwarder: MinimalForwarderContract;

  public constructor(public accountPrivateKey: EVMPrivateKey) {
    // Initialize a connection to the local blockchain
    this.provider = new ethers.providers.JsonRpcProvider(
      "http://localhost:8545",
      31337,
    );
    // We'll use account 0
    this.serverSigner = new ethers.Wallet(
      localChainAccounts[0].privateKey,
      this.provider,
    );

    this.accountWallet = new ethers.Wallet(accountPrivateKey, this.provider);
    this.accountAddress = EVMAccountAddress(this.accountWallet.address);

    const doodleChain = chainConfig.get(
      ChainId(31337),
    ) as ControlChainInformation;
    this.consentContract = new ConsentContract(
      this.serverSigner,
      defaultConsentContractAddress,
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
}
