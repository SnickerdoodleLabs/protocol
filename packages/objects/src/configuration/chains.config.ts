import { ChainId } from "@objects/ChainId";
import { ChainInformation } from "@objects/ChainInformation";
import { EthereumContractAddress } from "@objects/EthereumContractAddress";

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
