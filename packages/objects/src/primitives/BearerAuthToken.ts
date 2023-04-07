import { Brand, make } from "ts-brand";

export type BearerAuthToken = Brand<string, "BearerAuthToken">;
export const BearerAuthToken = make<BearerAuthToken>();
