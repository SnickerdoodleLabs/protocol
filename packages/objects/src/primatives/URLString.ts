import { Brand, make } from "ts-brand";

export type URLString = Brand<string, "URLString">;
export const URLString = make<URLString>();
