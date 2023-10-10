import { EVMAccountAddress } from "@objects/primitives/EVMAccountAddress.js";
import { SolanaAccountAddress } from "@objects/primitives/SolanaAccountAddress.js";
import { SuiAccountAddress } from "@objects/primitives/SuiAccountAddress.js";

export type AccountAddress =
  | EVMAccountAddress
  | SolanaAccountAddress
  | SuiAccountAddress;
