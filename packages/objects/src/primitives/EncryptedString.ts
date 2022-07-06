import { Brand, make } from "ts-brand";

export type EncryptedString = Brand<string, "EncryptedString">;
export const EncryptedString = make<EncryptedString>();
