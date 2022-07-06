import { Brand, make } from "ts-brand";

export type Argon2Hash = Brand<string, "Argon2Hash">;
export const Argon2Hash = make<Argon2Hash>();
