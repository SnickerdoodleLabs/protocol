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
      EthereumContractAddress("0xF12b5dd4EAD5F743C6BaA640B0216200e89B60Da"),
    ),
  ],
]);
