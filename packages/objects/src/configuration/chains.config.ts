import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  ChainInformation,
  ControlChainInformation,
  LinkedAccount,
  NativeCurrencyInformation,
} from "@objects/businessObjects";
import {
  EChain,
  EChainTechnology,
  EIndexer,
  EChainType,
} from "@objects/enum/index.js";
import { AccountIndexingError } from "@objects/errors/index.js";
import {
  ChainId,
  CoinGeckoAssetPlatformID,
  EVMContractAddress,
  URLString,
} from "@objects/primitives/index.js";

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
      "doodlechain",
      4000,
      EIndexer.Simulator,
      new NativeCurrencyInformation("DOODLE", 18, "DOODLE"),
      EChainType.Hardhat,
      "",
      EVMContractAddress("0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"), // Consent Contract Factory
      EVMContractAddress("0x610178dA211FEF7D417bC0e6FeD39F05609AD788"), // Crumbs Contract
      EVMContractAddress("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"), // Metatransaction Forwarder Contract
      EVMContractAddress("0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e"), // Sift Contract
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
      "mainnet",
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
    ChainId(EChain.Sepolia),
    new ChainInformation(
      "Sepolia",
      ChainId(EChain.Sepolia),
      EChain.Sepolia,
      EChainTechnology.EVM,
      true,
      "sepolia",
      10000,
      EIndexer.Ethereum,
      new NativeCurrencyInformation("ETH", 18, "ETH", "ethereum"),
      EChainType.Testnet,
      "https://sepolia.etherscan.io/tx/",
      getExplorerUrl,
      URLString("https://api-sepolia.etherscan.io/"),
    ),
  ],
  // [
  //   ChainId(EChain.Kovan),
  //   new ChainInformation(
  //     "Kovan",
  //     ChainId(EChain.Kovan),
  //     EChain.Kovan,
  //     EChainTechnology.EVM,
  //     true,
  //     [],
  //     10000,
  //     EIndexer.EVM,
  //     new NativeCurrencyInformation("ETH", 18, "ETH"),
  //     EChainType.Testnet,
  //     "https://kovan.etherscan.io/tx/",
  //     getExplorerUrl,
  //   ),
  // ],
  [
    ChainId(EChain.Mumbai),
    new ChainInformation(
      "Mumbai",
      ChainId(EChain.Mumbai),
      EChain.Mumbai,
      EChainTechnology.EVM,
      true,
      "polygon-mumbai",
      10000,
      EIndexer.Polygon,
      new NativeCurrencyInformation("MATIC", 18, "MATIC", "matic-network"),
      EChainType.Testnet,
      "https://mumbai.polygonscan.com/tx/",
      getExplorerUrl,
      URLString("https://api-testnet.polygonscan.com/"),
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
      "polygon-mainnet",
      10000,
      EIndexer.Polygon,
      new NativeCurrencyInformation("MATIC", 18, "MATIC", "matic-network"),
      EChainType.Mainnet,
      "https=//polygonscan.com/tx/",
      getExplorerUrl,
      URLString("https://api.polygonscan.com/"),
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
      "avalanche-mainnet",
      4000,
      EIndexer.EVM,
      new NativeCurrencyInformation("AVAX", 18, "AVAX", "avalanche-2"),
      EChainType.Mainnet,
      "https=//snowtrace.io/block/",
      getExplorerUrl,
      URLString("https://api.snowtrace.io/"),
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
      "avalanche-fuji",
      4000,
      EIndexer.EVM,
      new NativeCurrencyInformation("AVAX", 18, "AVAX", "avalanche-2"),
      EChainType.Testnet,
      "https://testnet.snowtrace.io/block/",
      EVMContractAddress("0x5540122e78241679Da8d07A04A74D3a7f52aED97"), // Consent Contract Factory
      EVMContractAddress("0x49a04d6545b1511742033b0ddF6a2Ba880A69287"), // Crumbs Contract
      EVMContractAddress("0xdB5c885944d903Ac5c146eef400D2ee20572d357"), // Metatransaction Forwarder Contract
      EVMContractAddress("0x1007D88962A3c0c4A11649480168B6456355d91a"), // Sift Contract
      URLString("https://api-testnet.snowtrace.io/"),
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
      "solana",
      400,
      EIndexer.Solana,
      new NativeCurrencyInformation("Sol", 9, "SOL", "solana"),
      EChainType.Mainnet,
      "https://explorer.solana.com/tx/",
      getExplorerUrl,
      undefined,
      CoinGeckoAssetPlatformID("solana"), // coing gecko chain slug
    ),
  ],
  [
    ChainId(EChain.Gnosis),
    new ChainInformation(
      "Gnosis",
      ChainId(EChain.Gnosis),
      EChain.Gnosis,
      EChainTechnology.EVM,
      true,
      "Gnosis",
      10000, // average block mining time
      EIndexer.Gnosis,
      new NativeCurrencyInformation("xDAI", 18, "xDAI", "xdai"),
      EChainType.Mainnet,
      "https://gnosisscan.io/",
      getExplorerUrl,
      URLString("https://api.gnosisscan.io/"),
    ),
  ],
  [
    ChainId(EChain.Binance),
    new ChainInformation(
      "Binance",
      ChainId(EChain.Binance),
      EChain.Binance,
      EChainTechnology.EVM,
      true,
      "binance",
      10000, // average block mining time
      EIndexer.Binance,
      new NativeCurrencyInformation("BNB", 18, "BNB", "binancecoin"),
      EChainType.Mainnet,
      "https://api.bscscan.com/api",
      getExplorerUrl,
      URLString("https://api.bscscan.com/"),
    ),
  ],
  [
    ChainId(EChain.Moonbeam),
    new ChainInformation(
      "Moonbeam",
      ChainId(EChain.Moonbeam),
      EChain.Moonbeam,
      EChainTechnology.EVM,
      true,
      "moonbeam",
      10000, // average block mining time
      EIndexer.Moonbeam,
      new NativeCurrencyInformation("GLMR", 18, "GLMR", "moonbeam"),
      EChainType.Mainnet,
      "https://api-moonbeam.moonscan.io/api",
      getExplorerUrl,
      URLString("https://api-moonbeam.moonscan.io/"),
    ),
  ],
  [
    ChainId(EChain.Arbitrum),
    new ChainInformation(
      "Arbitrum",
      ChainId(EChain.Arbitrum),
      EChain.Arbitrum,
      EChainTechnology.EVM,
      true,
      "arbitrum",
      10000, // average block mining time
      EIndexer.Arbitrum,
      new NativeCurrencyInformation("ARB", 18, "ARB", "arbitrum"),
      EChainType.Mainnet,
      "https://api.arbiscan.io/api",
      getExplorerUrl,
      URLString("https://api.arbiscan.io/"),
    ),
  ],
  [
    ChainId(EChain.Optimism),
    new ChainInformation(
      "Optimism",
      ChainId(EChain.Optimism),
      EChain.Optimism,
      EChainTechnology.EVM,
      true,
      "optimism",
      10000, // average block mining time
      EIndexer.Optimism,
      new NativeCurrencyInformation("OP", 18, "OP", "optimism"),
      EChainType.Mainnet,
      "https://api-optimistic.etherscan.io/api",
      getExplorerUrl,
      URLString("https://api-optimistic.etherscan.io/"),
    ),
  ],
  [
    ChainId(EChain.Astar),
    new ChainInformation(
      "Astar",
      ChainId(EChain.Astar),
      EChain.Astar,
      EChainTechnology.EVM,
      true,
      "astar",
      10000, // average block mining time
      EIndexer.Astar,
      new NativeCurrencyInformation("ASTR", 18, "ASTR", "astar"),
      EChainType.Mainnet,
      "https://astar.subscan.io/api",
      getExplorerUrl,
      URLString("https://astar.subscan.io/"),
    ),
  ],
  [
    ChainId(EChain.Shibuya),
    new ChainInformation(
      "Shibuya",
      ChainId(EChain.Shibuya),
      EChain.Astar,
      EChainTechnology.EVM,
      true,
      "shibuya",
      10000, // average block mining time
      EIndexer.Astar,
      new NativeCurrencyInformation("SBY", 18, "SBY", "shibuya"),
      EChainType.Testnet,
      "https://shibuya.subscan.io/api",
      getExplorerUrl,
      URLString("https://shibya.subscan.io/"),
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

export function getEtherscanBaseURLForChain(
  chain: EChain,
): ResultAsync<string, AccountIndexingError> {
  try {
    const chainInfo = getChainInfoByChain(chain);
    if (chainInfo.etherscanEndpointURL == undefined) {
      return errAsync(
        new AccountIndexingError("no etherscan endpoint for chainID", chain),
      );
    }
    return okAsync(chainInfo.etherscanEndpointURL);
  } catch (e) {
    return errAsync(
      new AccountIndexingError("error fetching chain information", e),
    );
  }
}
