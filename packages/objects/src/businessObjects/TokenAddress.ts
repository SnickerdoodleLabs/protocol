import {
  EVMContractAddress,
  SolanaTokenAddress,
  SuiTokenAddress,
} from "@objects/primitives/index.js";

export type TokenAddress =
  | EVMContractAddress
  | SolanaTokenAddress
  | SuiTokenAddress;
