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
      EIndexer.EVM,
      EVMContractAddress("todo"),
      EVMContractAddress("todo"),
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
