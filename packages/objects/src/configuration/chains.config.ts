import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  ChainInformation,
  ControlChainInformation,
  LinkedAccount,
  NativeCurrencyInformation,
} from "@objects/businessObjects";
import { EChain, EChainTechnology, EIndexer, EChainType } from "@objects/enum";
import { AccountIndexingError } from "@objects/errors";
import {
  ChainId,
  CoinGeckoAssetPlatformID,
  EVMContractAddress,
  ProviderUrl,
  URLString,
} from "@objects/primitives";

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
      EIndexer.Polygon,
      new NativeCurrencyInformation("MATIC", 18, "MATIC"),
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
      [
        ProviderUrl(
          "https://polygon-mainnet.infura.io/v3/aa563c4a004d4a219e5134fab06b7fd7",
        ),
      ],
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
      [
        ProviderUrl(
          "https://avalanche-mainnet.infura.io/v3/a8ae124ed6aa44bb97a7166cda30f1bc",
        ),
      ],
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
      [
        ProviderUrl(
          "https://avalanche-fuji.infura.io/v3/a8ae124ed6aa44bb97a7166cda30f1bc",
        ),
      ],
      4000,
      EIndexer.EVM,
      new NativeCurrencyInformation("AVAX", 18, "AVAX"),
      EChainType.Testnet,
      "https://testnet.snowtrace.io/block/",
      EVMContractAddress("0x2231A160C7a7bba5a9dDbaF6a44A7EF76Ef74C77"), // Consent Contract Factory
      EVMContractAddress("0x49a04d6545b1511742033b0ddF6a2Ba880A69287"), // Crumbs Contract
      EVMContractAddress("0xdB5c885944d903Ac5c146eef400D2ee20572d357"), // Metatransaction Forwarder Contract
      EVMContractAddress("0x1007D88962A3c0c4A11649480168B6456355d91a"), // Sift Contract
      URLString("https://api.snowtrace.io/"),
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
      [],
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
      [],
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
      [],
      10000, // average block mining time
      EIndexer.Moonbeam,
      new NativeCurrencyInformation("GLMR", 18, "GLMR", "moonbeam"),
      EChainType.Mainnet,
      "https://api-moonbeam.moonscan.io/api",
      getExplorerUrl,
      URLString("https://api-moonbeam.moonscan.io/"),
    ),
  ],
  // [
  //   ChainId(EChain.Arbitrum),
  //   new ChainInformation(
  //     "Arbitrum",
  //     ChainId(EChain.Arbitrum),
  //     EChain.Arbitrum,
  //     EChainTechnology.EVM,
  //     true,
  //     [],
  //     10000, // average block mining time
  //     EIndexer.Arbitrum,
  //     new NativeCurrencyInformation("ETH", 18, "ETH", "arbitrum"),
  //     EChainType.Mainnet,
  //     "https://api.arbiscan.io/api",
  //     getExplorerUrl,
  //     URLString("https://api.arbiscan.io/"),
  //   ),
  // ],
  [
    ChainId(EChain.Optimism),
    new ChainInformation(
      "Optimism",
      ChainId(EChain.Optimism),
      EChain.Optimism,
      EChainTechnology.EVM,
      true,
      [],
      10000, // average block mining time
      EIndexer.Optimism,
      new NativeCurrencyInformation("Ether", 18, "Ether", "optimism"),
      EChainType.Mainnet,
      "https://api-optimistic.etherscan.io/api",
      getExplorerUrl,
      URLString("https://api-optimistic.etherscan.io/"),
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
  // console.log("chainConfig: ", chainConfig);
  const chainInfo = chainConfig.get(chainId);
  console.log("chainId: ", chainId + " and chainInfo: ", chainInfo);
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
  chain: ChainId,
): ResultAsync<string, AccountIndexingError> {
  try {
    const chainInfo = getChainInfoByChainId(chain);
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
