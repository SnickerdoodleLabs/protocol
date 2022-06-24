import { Brand, make } from "ts-brand";

export type BlockNumber = Brand<number, "BlockNumber">;
export const BlockNumber = make<BlockNumber>();
