import { Brand, make } from "ts-brand";

export type WebauthnCredentialId = Brand<string, "WebauthnCredentialId">;
export const WebauthnCredentialId = make<WebauthnCredentialId>();