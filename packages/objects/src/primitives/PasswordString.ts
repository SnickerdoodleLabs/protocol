import { Brand, make } from "ts-brand";

export type PasswordString = Brand<string, "PasswordString">;
export const PasswordString = make<PasswordString>();
