import {
  ChainInformation,
  ControlChainInformation,
  NativeCurrencyInformation,
} from "@objects/businessObjects";
import { EChain, EChainTechnology, EIndexer } from "@objects/enum";
import { ChainId, EVMContractAddress, ProviderUrl } from "@objects/primitives";

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
      EVMContractAddress("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"), // Consent Contract Factory
      EVMContractAddress("0x0165878A594ca255338adfa4d48449f69242Eb8F"), // Crumbs Contract
      EVMContractAddress("0x5FbDB2315678afecb367f032d93F642f64180aa3"), // Metatransaction Forwarder Contract
      EVMContractAddress("0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"), // Sift Contract
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
      EVMContractAddress("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"), // Consent Contract Factory
      EVMContractAddress("0x0165878A594ca255338adfa4d48449f69242Eb8F"), // Crumbs Contract
      EVMContractAddress("0x5FbDB2315678afecb367f032d93F642f64180aa3"), // Metatransaction Forwarder Contract
      EVMContractAddress("0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"), // Sift Contract
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
      EIndexer.EVM,
      new NativeCurrencyInformation("ETH", 18, "ETH"),
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
      EIndexer.EVM,
      new NativeCurrencyInformation("ETH", 18, "ETH"),
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
      [ProviderUrl("https://avalanche-mainnet.infura.io/v3/aa563c4a004d4a219e5134fab06b7fd7")],
      4000,
      EIndexer.EVM,
      new NativeCurrencyInformation("AVAX", 18, "AVAX"),
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
      EVMContractAddress("0xC44C9B4375ab43D7974252c37bccb41F99910fA5"), // Consent Contract Factory
      EVMContractAddress("0x97464F3547510fb430448F5216eC7D8e71D7C4eF"), // Crumbs Contract
      EVMContractAddress("0xF7c6dC708550D89558110cAecD20a8A6a184427E"), // Metatransaction Forwarder Contract
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
      10000,
      EIndexer.Solana,
      new NativeCurrencyInformation("Sol", 9, "SOL"),
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
