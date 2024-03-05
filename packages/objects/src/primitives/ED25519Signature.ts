import { Brand, make } from "ts-brand";

export type ED25519Signature = Brand<string, "ED25519Signature">;
export const ED25519Signature = make<ED25519Signature>();
