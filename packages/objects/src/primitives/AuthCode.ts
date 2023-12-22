import { Brand, make } from "ts-brand";

export type AuthCode = Brand<string, "AuthCode">;
export const AuthCode = make<AuthCode>();
