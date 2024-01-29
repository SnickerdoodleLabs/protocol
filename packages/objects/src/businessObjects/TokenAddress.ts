import {
  EVMContractAddress,
  SolanaAccountAddress,
  SolanaTokenAddress,
  SuiTokenAddress,
} from "@objects/primitives/index.js";

export type TokenAddress =
  | EVMContractAddress
  | SolanaTokenAddress
  | SolanaAccountAddress
  | SuiTokenAddress;
