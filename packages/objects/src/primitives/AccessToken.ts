import { Brand, make } from "ts-brand";

export type AccessToken = Brand<string, "AccessToken">;
export const AccessToken = make<AccessToken>();
