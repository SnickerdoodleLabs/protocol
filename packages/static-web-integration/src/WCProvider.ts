import EthereumProvider from "@walletconnect/ethereum-provider";
import { Signer, ethers, providers } from "ethers";
import { ResultAsync, okAsync } from "neverthrow";
import {
  configureChains,
  createConfig,
  getAccount,
  getPublicClient,
  getWalletClient,
  PublicClient,
  WalletClient,
} from "@wagmi/core";
import { arbitrum, avalanche, mainnet, polygon } from "@wagmi/core/chains";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";
import { HttpTransport } from "viem";
export class WCProvider {
  protected ethereumProvider?: EthereumProvider;
  protected ethereumClient: EthereumClient;
  protected web3Modal: Web3Modal;
  constructor(projectId: string) {
    const web3ModalConfig = {
      projectId,
      walletImages: {
        safe: "https://pbs.twimg.com/profile_images/1566773491764023297/IvmCdGnM_400x400.jpg",
      },
    };
    const chains = [mainnet, polygon, avalanche, arbitrum];

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

    // ethereumClient.getAccount().connector?.connect();
  }
  startWalletConnect() {
    this.web3Modal.openModal();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.ethereumClient.watchAccount((accounts) => {
      if (accounts.address) {
        getWalletClient().then((client) => {
          console.log("client", client);
          client
            ?.signMessage({
              message: "Login to your Snickerdoodle data wallet",
            })
            .then((signature) => {
              this.getEthersSigner().then((signer_) => {});
            });
        });
      }
    });
  }

  public getSigner() {
    return ResultAsync.fromPromise(this.getEthersSigner(), (e) => {
      return new Error(`Error getting signer: ${(e as Error).message}`);
    }).map((signer) => {
      console.log("adsad", signer);
      return signer;
    });
  }

  public connectWithQR(projectId: string) {
    return ResultAsync.fromPromise(
      EthereumProvider.init({
        projectId,
        showQrModal: true,
        chains: [1],
        methods: ["eth_sendTransaction", "personal_sign"],
      }),
      (e) => {
        return new Error(`User cancelled: ${(e as Error).message}`);
      },
    ).mapErr((e) => {
      console.log("WalletConnect Init Error", e);
      return new Error(`Initialization error: ${e.message}`);
    });
  }

  public checkConnection(): ResultAsync<boolean, never> {
    console.log("address", getAccount().address);
    if (getAccount().address) {
      console.log("var");
      return okAsync(true);
    } else {
      return okAsync(false);
    }
  }

  public getEthersProvider({ chainId }: { chainId?: number } = {}) {
    const publicClient = getPublicClient({ chainId });
    return this.publicClientToProvider(publicClient);
  }
  public publicClientToProvider(publicClient: PublicClient) {
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

  public walletClientToSigner(walletClient: WalletClient) {
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

  public async getEthersSigner({ chainId }: { chainId?: number } = {}) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const walletClient = await getWalletClient({ chainId: chainId || 1 });
    return this.walletClientToSigner(walletClient!) as ethers.Signer;
  }
}
