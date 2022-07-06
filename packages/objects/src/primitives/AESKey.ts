import { Brand, make } from "ts-brand";

export type AESKey = Brand<string, "AESKey">;
export const AESKey = make<AESKey>();
