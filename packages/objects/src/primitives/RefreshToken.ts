import { Brand, make } from "ts-brand";

export type RefreshToken = Brand<string, "RefreshToken">;
export const RefreshToken = make<RefreshToken>();
