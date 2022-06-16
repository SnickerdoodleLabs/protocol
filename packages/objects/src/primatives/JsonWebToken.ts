import { Brand, make } from "ts-brand";

export type JsonWebToken = Brand<string, "JsonWebToken">;
export const JsonWebToken = make<JsonWebToken>();
