import { Brand, make } from "ts-brand";

export type ChainId = Brand<number, "ChainId">;
export const ChainId = make<ChainId>();
