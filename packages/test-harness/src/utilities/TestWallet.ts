import { ICryptoUtils } from "@snickerdoodlelabs/node-utils";
import {
  AccountAddress,
  EChain,
  EChainTechnology,
  EVMPrivateKey,
  getChainInfoByChain,
  Signature,
  SolanaAccountAddress,
  SolanaPrivateKey,
} from "@snickerdoodlelabs/objects";
import * as solanaWeb3 from "@solana/web3.js";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

export class TestWallet {
  public accountAddress: AccountAddress;
  public constructor(
    public chain: EChain,
    protected privateKey: EVMPrivateKey | SolanaPrivateKey,
    protected cryptoUtils: ICryptoUtils,
  ) {
    const chainInfo = getChainInfoByChain(chain);

    if (chainInfo.chainTechnology == EChainTechnology.EVM) {
      this.accountAddress =
        this.cryptoUtils.getEthereumAccountAddressFromPrivateKey(
          this.privateKey as EVMPrivateKey,
        );
    } else {
      const keypair = solanaWeb3.Keypair.fromSecretKey(
        ethers.getBytes(ethers.toBeHex(ethers.decodeBase58(privateKey))),
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

  public getName(): string {
    const chainInfo = getChainInfoByChain(this.chain);
    return `${this.accountAddress} (${chainInfo.name})`;
  }
}
