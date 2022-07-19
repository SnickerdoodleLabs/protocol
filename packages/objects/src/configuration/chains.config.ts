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
      [ProviderUrl("http://localhost:8545")],
      4000,
      EIndexer.Simulator,
      EVMContractAddress("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"), // Consent Contract Factory
      EVMContractAddress("0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"), // Crumbs Contract
    ),
  ],
  [
    ChainId(1338),
    new ChainInformation(
      "Local Development Chain",
      ChainId(1338),
      true,
      [ProviderUrl("http://localhost:8545")],
      4000,
      EIndexer.EVM,
    ),
  ],
]);
