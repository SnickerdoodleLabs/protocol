import {
  EVMContractAddress,
  SolanaTokenAddress,
} from "@objects/primitives/index.js";

export type TokenAddress =
  | EVMContractAddress
  | SolanaTokenAddress
  | string
  | "NATIVE";
