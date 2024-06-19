import { EVMContractAddress } from "@objects/primitives/EVMContractAddress.js";
import { SolanaProgramAddress } from "@objects/primitives/SolanaProgramAddress.js";
import { SuiContractAddress } from "@objects/primitives/SuiContractAddress.js";

export type ContractAddress =
  | EVMContractAddress
  | SolanaProgramAddress
  | SuiContractAddress;
