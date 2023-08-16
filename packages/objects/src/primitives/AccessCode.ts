import { Brand, make } from "ts-brand";

export type AccessCode = Brand<string, "AccessCode">;
export const AccessCode = make<AccessCode>();
