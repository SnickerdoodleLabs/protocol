import { ChainInformation } from "@objects/businessObjects";
import { ChainId, EthereumContractAddress } from "@objects/primatives";

export const chainConfig = new Map<ChainId, ChainInformation>([
  [
    ChainId(1337),
    new ChainInformation(
      "Local Development Chain",
      ChainId(1337),
      true,
      true,
      EthereumContractAddress("todo"),
      EthereumContractAddress("todo"),
    ),
  ],
]);
