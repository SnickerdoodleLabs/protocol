import { EVMAccountAddress } from "@objects/primitives/EVMAccountAddress.js";
import { SolanaAccountAddress } from "@objects/primitives/SolanaAccountAddress.js";

export type AccountAddress = EVMAccountAddress | SolanaAccountAddress;
