import {
  ChainInformation,
  ControlChainInformation,
} from "@objects/businessObjects";
import { EIndexer } from "@objects/enum";
import { ChainId, EVMContractAddress, ProviderUrl } from "@objects/primitives";

export const chainConfig = new Map<ChainId, ChainInformation>([
  [
    ChainId(31337),
    new ControlChainInformation(
      "Local Doodle Chain",
      ChainId(31337),
      true,
      [ProviderUrl("http://127.0.0.1:8545")],
      4000,
      EIndexer.Simulator,
      EVMContractAddress("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"), // Consent Contract Factory
      EVMContractAddress("0x0165878A594ca255338adfa4d48449f69242Eb8F"), // Crumbs Contract
      EVMContractAddress("0x5FbDB2315678afecb367f032d93F642f64180aa3"), // Metatransaction Forwarder Contract
    ),
  ],
  [
    ChainId(42),
    new ChainInformation("Kovan", ChainId(42), true, [], 10000, EIndexer.EVM),
  ],
  [
    ChainId(43113),
    new ChainInformation("Fuji", ChainId(43113), true, [], 4000, EIndexer.EVM),
  ],
]);
