import { Brand, make } from "ts-brand";

export type JSONString = Brand<string, "JSONString">;
export const JSONString = make<JSONString>();
