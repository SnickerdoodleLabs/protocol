import { Brand, make } from "ts-brand";

export type Base64String = Brand<string, "Base64String">;
export const Base64String = make<Base64String>();
