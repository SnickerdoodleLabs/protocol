import {
  ChainInformation,
  ControlChainInformation,
} from "@objects/businessObjects";
import {
  ChainId,
  EthereumContractAddress,
  ProviderUrl,
} from "@objects/primatives";

export const chainConfig = new Map<ChainId, ChainInformation>([
  [
    ChainId(1337),
    new ControlChainInformation(
      "Local Development Chain",
      ChainId(1337),
      true,
      EthereumContractAddress("todo"),
      [ProviderUrl("http://localhost:8545")],
    ),
  ],
  [
    ChainId(1338),
    new ChainInformation("Local Development Chain", ChainId(1337), true, [
      ProviderUrl("http://localhost:8545"),
    ]),
  ],
]);
