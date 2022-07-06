import { Brand, make } from "ts-brand";

export type Age = Brand<number, "Age">;
export const Age = make<Age>();
