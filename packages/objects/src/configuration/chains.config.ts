import {
  ChainInformation,
  ControlChainInformation,
  LinkedAccount,
  NativeCurrencyInformation,
} from "@objects/businessObjects";
import { EChain, EChainTechnology, EIndexer, EChainType } from "@objects/enum";
import { ChainId, EVMContractAddress, ProviderUrl, URLString } from "@objects/primitives";

const getExplorerUrl = function (this: ChainInformation, txHash: string) {
  return this.explorerURL + txHash;
};

export const chainConfig = new Map<ChainId, ChainInformation>([
  [
    ChainId(EChain.DevDoodle),
    new ControlChainInformation(
      "Dev Env Doodle Chain",
      ChainId(EChain.DevDoodle),
      EChain.DevDoodle,
      EChainTechnology.EVM,
      true,
      [ProviderUrl("https://doodlechain.dev.snickerdoodle.dev")],
      4000,
      EIndexer.Simulator,
      new NativeCurrencyInformation("DOODLE", 18, "DOODLE"),
      EChainType.Hardhat,
      "",
      EVMContractAddress("0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"), // Consent Contract Factory
      EVMContractAddress("0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e"), // Crumbs Contract
      EVMContractAddress("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"), // Metatransaction Forwarder Contract
      EVMContractAddress("0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0"), // Sift Contract
    ),
  ],
  [
    ChainId(EChain.LocalDoodle),
    new ControlChainInformation(
      "Local Doodle Chain",
      ChainId(EChain.LocalDoodle),
      EChain.LocalDoodle,
      EChainTechnology.EVM,
      true,
      [ProviderUrl("http://127.0.0.1:8545")],
      4000,
      EIndexer.Simulator,
      new NativeCurrencyInformation("DOODLE", 18, "DOODLE"),
      EChainType.Hardhat,
      "",
      EVMContractAddress("0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"), // Consent Contract Factory
      EVMContractAddress("0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e"), // Crumbs Contract
      EVMContractAddress("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"), // Metatransaction Forwarder Contract
      EVMContractAddress("0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0"), // Sift Contract
    ),
  ],
  [
    ChainId(EChain.EthereumMainnet),
    new ChainInformation(
      "Ethereum",
      ChainId(EChain.EthereumMainnet),
      EChain.EthereumMainnet,
      EChainTechnology.EVM,
      true,
      [],
      10000,
      EIndexer.Ethereum,
      new NativeCurrencyInformation("ETH", 18, "ETH", "ethereum"),
      EChainType.Mainnet,
      "https://etherscan.io/tx/",
      getExplorerUrl,
      URLString("https://api.etherscan.io/"),
    ),
  ],
  [
    ChainId(EChain.Goerli),
    new ChainInformation(
      "Goerli",
      ChainId(EChain.Goerli),
      EChain.Goerli,
      EChainTechnology.EVM,
      true,
      [],
      10000,
      EIndexer.Ethereum,
      new NativeCurrencyInformation("ETH", 18, "ETH"),
      EChainType.Testnet,
      "https://goerli.etherscan.io/tx/",
      getExplorerUrl,
      URLString("https://api-goerli.etherscan.io/"),
    ),
  ],
  [
    ChainId(EChain.Kovan),
    new ChainInformation(
      "Kovan",
      ChainId(EChain.Kovan),
      EChain.Kovan,
      EChainTechnology.EVM,
      true,
      [],
      10000,
      EIndexer.EVM,
      new NativeCurrencyInformation("ETH", 18, "ETH"),
      EChainType.Testnet,
      "https://kovan.etherscan.io/tx/",
      getExplorerUrl,
    ),
  ],
  [
    ChainId(EChain.Mumbai),
    new ChainInformation(
      "Mumbai Testnet",
      ChainId(EChain.Mumbai),
      EChain.Mumbai,
      EChainTechnology.EVM,
      true,
      [
        ProviderUrl(
          "https://polygon-mumbai.infura.io/v3/aa563c4a004d4a219e5134fab06b7fd7",
        ),
      ],
      10000,
      EIndexer.EVM,
      new NativeCurrencyInformation("MATIC", 18, "MATIC"),
      EChainType.Testnet,
      "https=//mumbai.polygonscan.com/tx/",
      getExplorerUrl,
    ),
  ],
  [
    ChainId(EChain.Polygon),
    new ChainInformation(
      "Polygon",
      ChainId(EChain.Polygon),
      EChain.Polygon,
      EChainTechnology.EVM,
      true,
      [
        ProviderUrl(
          "https://polygon-mainnet.infura.io/v3/aa563c4a004d4a219e5134fab06b7fd7",
        ),
      ],
      10000,
      EIndexer.EVM,
      new NativeCurrencyInformation("MATIC", 18, "MATIC"),
      EChainType.Mainnet,
      "https=//polygonscan.com/tx/",
      getExplorerUrl,
    ),
  ],

  [
    ChainId(EChain.Avalanche),
    new ChainInformation(
      "Avalanche",
      ChainId(EChain.Avalanche),
      EChain.Avalanche,
      EChainTechnology.EVM,
      true,
      [
        ProviderUrl(
          "https://avalanche-mainnet.infura.io/v3/aa563c4a004d4a219e5134fab06b7fd7",
        ),
      ],
      4000,
      EIndexer.EVM,
      new NativeCurrencyInformation("AVAX", 18, "AVAX"),
      EChainType.Mainnet,
      "https=//snowtrace.io/block/",
      getExplorerUrl,
    ),
  ],

  [
    ChainId(EChain.Fuji),
    new ControlChainInformation(
      "Fuji",
      ChainId(EChain.Fuji),
      EChain.Fuji,
      EChainTechnology.EVM,
      true,
      [ProviderUrl("https://fuji.snickerdoodle.dev/rpc")],
      4000,
      EIndexer.EVM,
      new NativeCurrencyInformation("AVAX", 18, "AVAX"),
      EChainType.Testnet,
      "https://testnet.snowtrace.io/block/",
      EVMContractAddress("0xF891204124eb67e64b5AF6b36FcFa55E0885a301"), // Consent Contract Factory
      EVMContractAddress("0x97464F3547510fb430448F5216eC7D8e71D7C4eF"), // Crumbs Contract
      EVMContractAddress("0x53B638B1615Ea061098b10CA1E97F5BFC395f0D3"), // Metatransaction Forwarder Contract
      EVMContractAddress("0x1007D88962A3c0c4A11649480168B6456355d91a"), // Sift Contract
    ),
  ],
  [
    ChainId(EChain.Solana),
    new ChainInformation(
      "Solana",
      ChainId(EChain.Solana),
      EChain.Solana,
      EChainTechnology.Solana,
      true,
      [],
      400,
      EIndexer.Solana,
      new NativeCurrencyInformation("Sol", 9, "SOL", "solana"),
      EChainType.Mainnet,
      "https://explorer.solana.com/tx/",
      getExplorerUrl,
    ),
  ],
]);

export function getChainInfoByChain(chain: EChain): ChainInformation {
  const chainInfo = chainConfig.get(ChainId(chain));
  if (chainInfo == null) {
    throw new Error(`Unknown chain ${chain}`);
  }

  return chainInfo;
}

export function getChainInfoByChainId(chainId: ChainId): ChainInformation {
  const chainInfo = chainConfig.get(chainId);
  if (chainInfo == null) {
    throw new Error(`Unknown chain id ${chainId}`);
  }

  return chainInfo;
}

export function isAccountValidForChain(
  chainId: ChainId,
  account: LinkedAccount,
): boolean {
  const targetChainInfo = getChainInfoByChainId(chainId);
  const accountChainInfo = getChainInfoByChain(account.sourceChain);
  return targetChainInfo.chainTechnology == accountChainInfo.chainTechnology;
}
