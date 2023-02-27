import { ICryptoUtils } from "@snickerdoodlelabs/common-utils";
import { IMinimalForwarderRequest } from "@snickerdoodlelabs/contracts-sdk";
import {
  AccountAddress,
  chainConfig,
  ChainId,
  ControlChainInformation,
  EChain,
  EChainTechnology,
  EVMPrivateKey,
  getChainInfoByChain,
  Signature,
  SolanaAccountAddress,
  SolanaPrivateKey,
} from "@snickerdoodlelabs/objects";
import {
  forwardRequestTypes,
  getMinimalForwarderSigningDomain,
} from "@snickerdoodlelabs/signature-verification";
import * as solanaWeb3 from "@solana/web3.js";
import { base58 } from "ethers/lib/utils.js";
import { ResultAsync } from "neverthrow";

export class TestWallet {
  public accountAddress: AccountAddress;
  public constructor(
    public chain: EChain,
    private privateKey: EVMPrivateKey | SolanaPrivateKey,
    private cryptoUtils: ICryptoUtils,
  ) {
    const chainInfo = getChainInfoByChain(chain);

    if (chainInfo.chainTechnology == EChainTechnology.EVM) {
      this.accountAddress =
        this.cryptoUtils.getEthereumAccountAddressFromPrivateKey(
          this.privateKey as EVMPrivateKey,
        );
    } else {
      const keypair = solanaWeb3.Keypair.fromSecretKey(
        base58.decode(privateKey),
      );

      this.accountAddress = SolanaAccountAddress(keypair.publicKey.toString());
    }
  }

  public signMessage(message: string): ResultAsync<Signature, never> {
    const chainInfo = getChainInfoByChain(this.chain);

    if (chainInfo.chainTechnology == EChainTechnology.EVM) {
      return this.cryptoUtils.signMessage(
        message,
        this.privateKey as EVMPrivateKey,
      );
    } else {
      return this.cryptoUtils.signMessageSolana(
        message,
        this.privateKey as SolanaPrivateKey,
      );
    }
  }

  public signMinimalForwarderRequest(
    request: IMinimalForwarderRequest,
  ): ResultAsync<Signature, never> {
    // Get the chain info for the doodle chain
    const doodleChainConfig = chainConfig.get(
      ChainId(31337),
    ) as ControlChainInformation;

    const chainInfo = getChainInfoByChain(this.chain);

    if (chainInfo.chainTechnology == EChainTechnology.EVM) {
      return this.cryptoUtils.signTypedData(
        // This domain is critical- we have to use this and not the normal Snickerdoodle domain
        getMinimalForwarderSigningDomain(
          doodleChainConfig.chainId,
          doodleChainConfig.metatransactionForwarderAddress,
        ),
        forwardRequestTypes,
        request,
        this.privateKey as EVMPrivateKey,
      );
    } else {
      throw new Error("Cannot sign typed data except on EVM");
    }
  }

  public getName(): string {
    const chainInfo = getChainInfoByChain(this.chain);
    return `${this.accountAddress} (${chainInfo.name})`;
  }
}
