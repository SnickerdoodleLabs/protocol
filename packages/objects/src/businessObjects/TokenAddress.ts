import { EVMContractAddress, SolanaTokenAddress } from "@objects/primitives";

export type TokenAddress =
  | EVMContractAddress
  | SolanaTokenAddress
  | string
  | "NATIVE";
