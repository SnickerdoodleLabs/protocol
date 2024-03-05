import {
  configureChains,
  createConfig,
  getAccount,
  getPublicClient,
  getWalletClient,
  PublicClient,
  WalletClient,
} from "@wagmi/core";
import {
  arbitrum,
  avalanche,
  mainnet,
  polygon,
  avalancheFuji,
  optimism,
} from "@wagmi/core/chains";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";
import { HttpTransport } from "viem";
export class WCProvider {
  protected ethereumClient: EthereumClient;
  protected web3Modal: Web3Modal;
  constructor(projectId: string) {
    const web3ModalConfig = {
      projectId,
      walletImages: {
        safe: "https://pbs.twimg.com/profile_images/1566773491764023297/IvmCdGnM_400x400.jpg",
      },
    };
    const chains = [
      mainnet,
      avalanche,
      avalancheFuji,
      arbitrum,
      optimism,
      polygon,
    ];

    const { publicClient } = configureChains(chains, [
      w3mProvider({ projectId }),
    ]);
    const wagmiConfig = createConfig({
      autoConnect: true,
      connectors: w3mConnectors({ chains, projectId }),
      publicClient,
    });
    this.ethereumClient = new EthereumClient(wagmiConfig, chains);
    this.web3Modal = new Web3Modal(web3ModalConfig, this.ethereumClient);
  }
  public startWalletConnect(): ResultAsync<ethers.Signer, Error> {
    this.web3Modal.openModal();
    return this.setupEventListeners();
  }

  protected setupEventListeners(): ResultAsync<ethers.Signer, Error> {
    return ResultAsync.fromPromise(
      new Promise<void>((resolve, reject) => {
        this.ethereumClient.watchAccount((accounts) => {
          if (accounts.address) {
            resolve();
          }
        });
      }),
      (error) => new Error(`Error in setupEventListeners: ${error}`),
    )
      .andThen(() => {
        return ResultAsync.fromPromise(
          getWalletClient(),
          (error) => new Error(`Error getting wallet client: ${error}`),
        );
      })
      .andThen(() => {
        return this.getEthersSigner();
      });
  }

  public checkConnection(): boolean {
    const address = getAccount().address;
    if (address) {
      return true;
    } else {
      return false;
    }
  }

  protected getEthersProvider(
    chainId?: number,
  ): ethers.JsonRpcProvider | ethers.FallbackProvider {
    const publicClient = getPublicClient({ chainId });
    return this.publicClientToProvider(publicClient);
  }
  protected publicClientToProvider(
    publicClient: PublicClient,
  ): ethers.FallbackProvider | ethers.JsonRpcProvider {
    const { chain, transport } = publicClient;
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    };
    if (transport.type === "fallback") {
      return new ethers.FallbackProvider(
        (transport.transports as ReturnType<HttpTransport>[]).map(
          ({ value }) => new ethers.JsonRpcProvider(value?.url, network),
        ),
      );
    }
    return new ethers.JsonRpcProvider(transport.url, network);
  }

  protected walletClientToSigner(
    walletClient: WalletClient,
  ): ResultAsync<ethers.JsonRpcSigner, never> {
    const { account, chain, transport } = walletClient;
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new ethers.BrowserProvider(transport, network);
    return ResultAsync.fromSafePromise(provider.getSigner(account.address));
  }

  public getEthersSigner(chainId?: number): ResultAsync<ethers.Signer, Error> {
    return ResultAsync.fromPromise(
      getWalletClient({ chainId: chainId || 1 }),
      (error) => new Error(`Error getting wallet client: ${error}`),
    ).andThen((walletClient) => {
      return this.walletClientToSigner(walletClient!);
    });
  }

  protected sign(
    signer: ethers.Signer,
    message: string,
  ): ResultAsync<string, Error> {
    return ResultAsync.fromPromise(
      signer.signMessage(message),
      (error) => new Error(`Error during signMessage: ${error}`),
    );
  }
}
