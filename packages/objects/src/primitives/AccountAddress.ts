import { EVMAccountAddress } from "@objects/primitives/EVMAccountAddress";
import { SolanaAccountAddress } from "@objects/primitives/SolanaAccountAddress";

export type AccountAddress = EVMAccountAddress | SolanaAccountAddress;
