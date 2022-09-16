import {
  ChainInformation,
  ControlChainInformation,
  NativeCurrencyInformation,
} from "@objects/businessObjects";
import { EIndexer } from "@objects/enum";
import { ChainId, EVMContractAddress, ProviderUrl } from "@objects/primitives";

export const chainConfig = new Map<ChainId, ChainInformation>([
  [
    ChainId(31337),
    new ControlChainInformation(
      "Dev Env Doodle Chain",
      ChainId(31337),
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
    ChainId(31338),
    new ControlChainInformation(
      "Local Doodle Chain",
      ChainId(31338),
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
    ChainId(1),
    new ChainInformation(
      "Ether mainnet",
      ChainId(1),
      true,
      [],
      10000,
      EIndexer.EVM,
      new NativeCurrencyInformation("ETH", 18, "ETH"),
    ),
  ],
  [
    ChainId(42),
    new ChainInformation(
      "Kovan",
      ChainId(42),
      true,
      [],
      10000,
      EIndexer.EVM,
      new NativeCurrencyInformation("ETH", 18, "ETH"),
    ),
  ],
  [
    ChainId(43113),
    new ControlChainInformation(
      "Fuji",
      ChainId(43113),
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
]);
