import { Brand, make } from "ts-brand";

export type AuthenticatorData = Brand<string, "AuthenticatorData">;
export const AuthenticatorData = make<AuthenticatorData>();
