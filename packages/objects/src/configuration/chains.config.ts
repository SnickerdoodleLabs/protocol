import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  ChainInformation,
  ControlChainInformation,
  LinkedAccount,
  NativeCurrencyInformation,
} from "@objects/businessObjects";
import { EChain, EChainTechnology, EChainType } from "@objects/enum/index.js";
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

export const chainConfig = new Map<EChain, ChainInformation>([
  [
    EChain.DevDoodle,
    new ControlChainInformation(
      "Dev Env Doodle Chain",
      ChainId(EChain.DevDoodle),
      EChain.DevDoodle,
      EChainTechnology.EVM,
      true,
      "doodlechain",
      4000,
      new NativeCurrencyInformation("DOODLE", 18, "DOODLE"),
      EChainType.Hardhat,
      "",
      EVMContractAddress("0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"), // Consent Contract Factory
      EVMContractAddress("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"), // Governance Token Contract
    ),
  ],
  [
    EChain.EthereumMainnet,
    new ChainInformation(
      "Ethereum",
      ChainId(EChain.EthereumMainnet),
      EChain.EthereumMainnet,
      EChainTechnology.EVM,
      true,
      "mainnet",
      10000,
      new NativeCurrencyInformation("ETH", 18, "ETH", "ethereum"),
      EChainType.Mainnet,
      "https://etherscan.io/tx/",
      getExplorerUrl,
      URLString("https://api.etherscan.io/"),
    ),
  ],
  [
    EChain.Sepolia,
    new ChainInformation(
      "Sepolia",
      ChainId(EChain.Sepolia),
      EChain.Sepolia,
      EChainTechnology.EVM,
      true,
      "sepolia",
      10000,
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
  //     new NativeCurrencyInformation("ETH", 18, "ETH"),
  //     EChainType.Testnet,
  //     "https://kovan.etherscan.io/tx/",
  //     getExplorerUrl,
  //   ),
  // ],
  [
    EChain.Mumbai,
    new ChainInformation(
      "Mumbai",
      ChainId(EChain.Mumbai),
      EChain.Mumbai,
      EChainTechnology.EVM,
      true,
      "polygon-mumbai",
      10000,
      new NativeCurrencyInformation("MATIC", 18, "MATIC", "matic-network"),
      EChainType.Testnet,
      "https://mumbai.polygonscan.com/tx/",
      getExplorerUrl,
      URLString("https://api-testnet.polygonscan.com/"),
    ),
  ],
  [
    EChain.Polygon,
    new ChainInformation(
      "Polygon",
      ChainId(EChain.Polygon),
      EChain.Polygon,
      EChainTechnology.EVM,
      true,
      "polygon-mainnet",
      10000,
      new NativeCurrencyInformation("MATIC", 18, "MATIC", "matic-network"),
      EChainType.Mainnet,
      "https://polygonscan.com/tx/",
      getExplorerUrl,
      URLString("https://api.polygonscan.com/"),
    ),
  ],
  [
    EChain.Avalanche,
    new ChainInformation(
      "Avalanche",
      ChainId(EChain.Avalanche),
      EChain.Avalanche,
      EChainTechnology.EVM,
      true,
      "avalanche-mainnet",
      4000,
      new NativeCurrencyInformation("AVAX", 18, "AVAX", "avalanche-2"),
      EChainType.Mainnet,
      "https://snowtrace.io/tx/",
      getExplorerUrl,
      URLString("https://api.snowtrace.io/"),
    ),
  ],
  [
    EChain.Fuji,
    new ControlChainInformation(
      "Fuji",
      ChainId(EChain.Fuji),
      EChain.Fuji,
      EChainTechnology.EVM,
      true,
      "avalanche-fuji",
      4000,
      new NativeCurrencyInformation("AVAX", 18, "AVAX", "avalanche-2"),
      EChainType.Testnet,
      "https://testnet.snowtrace.io/tx/",
      EVMContractAddress("0x5540122e78241679Da8d07A04A74D3a7f52aED97"), // Consent Contract Factory
      EVMContractAddress("0x5540122e78241679Da8d07A04A74D3a7f52aED97"), // TODO: Governance Token Contract 
      URLString("https://api-testnet.snowtrace.io/"),
    ),
  ],
  [
    EChain.Solana,
    new ChainInformation(
      "Solana",
      ChainId(EChain.Solana),
      EChain.Solana,
      EChainTechnology.Solana,
      true,
      "solana",
      400,
      new NativeCurrencyInformation("Sol", 9, "SOL", "solana"),
      EChainType.Mainnet,
      "https://explorer.solana.com/tx/",
      getExplorerUrl,
      undefined,
      CoinGeckoAssetPlatformID("solana"), // coing gecko chain slug
    ),
  ],
  [
    EChain.SolanaTestnet,
    new ChainInformation(
      "Solana",
      ChainId(EChain.SolanaTestnet),
      EChain.SolanaTestnet,
      EChainTechnology.Solana,
      true,
      "solana",
      400,
      new NativeCurrencyInformation("Sol", 9, "SOL", "solana"),
      EChainType.Testnet,
      "https://explorer.solana.com/tx/",
      getExplorerUrl,
      undefined,
      undefined,
    ),
  ],
  [
    EChain.Gnosis,
    new ChainInformation(
      "Gnosis",
      ChainId(EChain.Gnosis),
      EChain.Gnosis,
      EChainTechnology.EVM,
      true,
      "Gnosis",
      10000, // average block mining time
      new NativeCurrencyInformation("xDAI", 18, "xDAI", "xdai"),
      EChainType.Mainnet,
      "https://gnosisscan.io/tx/",
      getExplorerUrl,
      URLString("https://api.gnosisscan.io/"),
    ),
  ],
  [
    EChain.Binance,
    new ChainInformation(
      "Binance",
      ChainId(EChain.Binance),
      EChain.Binance,
      EChainTechnology.EVM,
      true,
      "binance",
      10000, // average block mining time
      new NativeCurrencyInformation("BNB", 18, "BNB", "binancecoin"),
      EChainType.Mainnet,
      "https://bscscan.com/tx/",
      getExplorerUrl,
      URLString("https://bscscan.com/"),
    ),
  ],
  [
    EChain.BinanceTestnet,
    new ChainInformation(
      "Binance",
      ChainId(EChain.BinanceTestnet),
      EChain.BinanceTestnet,
      EChainTechnology.EVM,
      true,
      "binance",
      10000, // average block mining time
      new NativeCurrencyInformation("BNB", 18, "BNB", "binancecoin"),
      EChainType.Testnet,
      "https://testnet.bscscan.com/tx/",
      getExplorerUrl,
      URLString("https://testnet.bscscan.com/"),
    ),
  ],
  [
    EChain.Moonbeam,
    new ChainInformation(
      "Moonbeam",
      ChainId(EChain.Moonbeam),
      EChain.Moonbeam,
      EChainTechnology.EVM,
      true,
      "moonbeam",
      10000, // average block mining time
      new NativeCurrencyInformation("GLMR", 18, "GLMR", "moonbeam"),
      EChainType.Mainnet,
      "https://moonscan.io/tx/",
      getExplorerUrl,
      URLString("https://api-moonbeam.moonscan.io/"),
    ),
  ],
  [
    EChain.Arbitrum,
    new ChainInformation(
      "Arbitrum",
      ChainId(EChain.Arbitrum),
      EChain.Arbitrum,
      EChainTechnology.EVM,
      true,
      "arbitrum",
      10000, // average block mining time
      new NativeCurrencyInformation("ETH", 18, "ARB", "ethereum"),
      EChainType.Mainnet,
      "https://arbiscan.io/tx/",
      getExplorerUrl,
      URLString("https://arbiscan.io/"),
    ),
  ],
  [
    EChain.Optimism,
    new ChainInformation(
      "Optimism",
      ChainId(EChain.Optimism),
      EChain.Optimism,
      EChainTechnology.EVM,
      true,
      "optimism",
      10000, // average block mining time
      new NativeCurrencyInformation("ETH", 18, "OP", "ethereum"),
      EChainType.Mainnet,
      "https://optimistic.etherscan.io/tx/",
      getExplorerUrl,
      URLString("https://api-optimistic.etherscan.io/"),
    ),
  ],
  [
    EChain.Astar,
    new ChainInformation(
      "Astar",
      ChainId(EChain.Astar),
      EChain.Astar,
      EChainTechnology.EVM,
      true,
      "astar",
      10000, // average block mining time
      new NativeCurrencyInformation("ASTR", 18, "ASTR", "astar"),
      EChainType.Mainnet,
      "https://astar.subscan.io/extrinsic/",
      getExplorerUrl,
      URLString("https://astar.subscan.io/"),
    ),
  ],
  [
    EChain.Sui,
    new ChainInformation(
      "Sui",
      ChainId(EChain.Sui),
      EChain.Sui,
      EChainTechnology.Sui,
      true,
      "sui",
      10000, // average block mining time
      new NativeCurrencyInformation("SUI", 9, "SUI", "sui"),
      EChainType.Mainnet,
      "https://suiexplorer.com/",
      getExplorerUrl,
      URLString("https://suiscan.xyz/"),
    ),
  ],
  [
    EChain.Shibuya,
    new ChainInformation(
      "Shibuya",
      ChainId(EChain.Shibuya),
      EChain.Shibuya,
      EChainTechnology.EVM,
      true,
      "shibuya",
      10000, // average block mining time
      new NativeCurrencyInformation("SBY", 18, "ASTR", "shibuya"),
      EChainType.Testnet,
      "https://shibuya.subscan.io/extrinsic/",
      getExplorerUrl,
      URLString("https://shibuya.subscan.io/"),
    ),
  ],
  [
    EChain.ZkSyncEra,
    new ChainInformation(
      "zkSync Era",
      ChainId(EChain.ZkSyncEra),
      EChain.ZkSyncEra,
      EChainTechnology.EVM,
      true,
      "zksync-era",
      10000, // average block mining time
      new NativeCurrencyInformation("ETH", 18, "ETH", "ethereum"),
      EChainType.Mainnet,
      "https://explorer.zksync.io/tx/",
      getExplorerUrl,
      URLString("https://block-explorer-api.mainnet.zksync.io/"),
    ),
  ],
  [
    EChain.Base,
    new ChainInformation(
      "Base",
      ChainId(EChain.Base),
      EChain.Base,
      EChainTechnology.EVM,
      true,
      "base",
      10000, // average block mining time
      new NativeCurrencyInformation("ETH", 18, "ETH", "ethereum"),
      EChainType.Mainnet,
      "https://basescan.org/tx/",
      getExplorerUrl,
      URLString("https://api.basescan.org/api"),
    ),
  ],
  [
    EChain.Chiliz,
    new ChainInformation(
      "Chiliz",
      ChainId(EChain.Chiliz),
      EChain.Chiliz,
      EChainTechnology.EVM,
      true,
      "chiliz",
      10000, // average block mining time
      new NativeCurrencyInformation("CHZ", 18, "CHZ", "chiliz"),
      EChainType.Mainnet,
      "https://scan.chiliz.com/tx/",
      getExplorerUrl,
      URLString("https://scan.chiliz.com/api/eth-rpc"),
    ),
  ],
]);

export function getChainInfoByChain(chain: EChain): ChainInformation {
  const chainInfo = chainConfig.get(chain);
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

export function isAccountValidForChainId(
  chainId: ChainId,
  account: LinkedAccount,
): boolean {
  // Goerli is deprecated, but still supported (exists). Will throw an error while
  // A query being processed.
  if (chainId === 5) return false;
  const targetChainInfo = getChainInfoByChainId(chainId);
  const accountChainInfo = getChainInfoByChain(account.sourceChain);
  return targetChainInfo.chainTechnology == accountChainInfo.chainTechnology;
}

export function isAccountValidForChain(
  chain: EChain,
  account: LinkedAccount,
): boolean {
  const targetChainInfo = getChainInfoByChain(chain);
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
