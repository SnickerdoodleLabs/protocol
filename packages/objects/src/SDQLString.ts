import { Brand, make } from "ts-brand";

export type SDQLString = Brand<string, "SDQLString">;
export const SDQLString = make<SDQLString>();
