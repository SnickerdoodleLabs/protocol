import { Brand, make } from "ts-brand";

export type FarcasterId = Brand<bigint, "FarcasterId">;
export const FarcasterId = make<FarcasterId>();
