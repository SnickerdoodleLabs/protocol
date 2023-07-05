import { Brand, make } from "ts-brand";

export type Username = Brand<string, "Username">;
export const Username = make<Username>();
