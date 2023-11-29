import { Signer, ethers, providers } from "ethers";
import { ResultAsync } from "neverthrow";
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
      autoConnect: false,
      connectors: w3mConnectors({ chains, projectId }),
      publicClient,
    });
    this.ethereumClient = new EthereumClient(wagmiConfig, chains);

    this.web3Modal = new Web3Modal(web3ModalConfig, this.ethereumClient);
  }
  public startWalletConnect(): ResultAsync<Signer, Error> {
    this.web3Modal.openModal();
    return this.setupEventListeners();
  }

  protected setupEventListeners(): ResultAsync<Signer, Error> {
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
  ): ethers.providers.JsonRpcProvider | ethers.providers.FallbackProvider {
    const publicClient = getPublicClient({ chainId });
    return this.publicClientToProvider(publicClient);
  }
  protected publicClientToProvider(
    publicClient: PublicClient,
  ): ethers.providers.FallbackProvider | ethers.providers.JsonRpcProvider {
    const { chain, transport } = publicClient;
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    };
    if (transport.type === "fallback") {
      return new providers.FallbackProvider(
        (transport.transports as ReturnType<HttpTransport>[]).map(
          ({ value }) => new providers.JsonRpcProvider(value?.url, network),
        ),
      );
    }
    return new providers.JsonRpcProvider(transport.url, network);
  }

  protected walletClientToSigner(
    walletClient: WalletClient,
  ): ethers.providers.JsonRpcSigner {
    const { account, chain, transport } = walletClient;
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new providers.Web3Provider(transport, network);
    const signer = provider.getSigner(account.address);
    return signer;
  }

  public getEthersSigner(chainId?: number): ResultAsync<Signer, Error> {
    return ResultAsync.fromPromise(
      getWalletClient({ chainId: chainId || 1 }),
      (error) => new Error(`Error getting wallet client: ${error}`),
    ).map((walletClient) => {
      return this.walletClientToSigner(walletClient!);
    });
  }
  protected sign(signer: Signer, message: string): ResultAsync<string, Error> {
    return ResultAsync.fromPromise(
      signer.signMessage(message),
      (error) => new Error(`Error during signMessage: ${error}`),
    );
  }
}
