import { Brand, make } from "ts-brand";

export type OAuthAuthorizationCode = Brand<string, "OAuthAuthorizationCode">;
export const OAuthAuthorizationCode = make<OAuthAuthorizationCode>();
