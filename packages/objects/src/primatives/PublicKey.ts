import { Brand, make } from "ts-brand";

export type PublicKey = Brand<string, "PublicKey">;
export const PublicKey = make<PublicKey>();
