import {
  ChainInformation,
  ControlChainInformation,
} from "@objects/businessObjects";
import { ChainId, EVMContractAddress, ProviderUrl } from "@objects/primitives";

export const chainConfig = new Map<ChainId, ChainInformation>([
  [
    ChainId(1337),
    new ControlChainInformation(
      "Local Development Chain",
      ChainId(1337),
      true,
      [ProviderUrl("http://localhost:8545")],
      4000,
      EVMContractAddress("todo"),
    ),
  ],
  [
    ChainId(1338),
    new ChainInformation(
      "Local Development Chain",
      ChainId(1337),
      true,
      [ProviderUrl("http://localhost:8545")],
      4000,
    ),
  ],
]);
