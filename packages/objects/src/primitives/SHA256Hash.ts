import { Brand, make } from "ts-brand";

export type SHA256Hash = Brand<string, "SHA256Hash">;
export const SHA256Hash = make<SHA256Hash>();
