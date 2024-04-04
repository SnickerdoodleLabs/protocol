import { Brand, make } from "ts-brand";

// A PoseidonHash is a bigint
export type PoseidonHash = Brand<bigint, "PoseidonHash">;
export const PoseidonHash = make<PoseidonHash>();
