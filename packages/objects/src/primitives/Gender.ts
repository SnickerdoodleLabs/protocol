import { Brand, make } from "ts-brand";

export type Gender = Brand<string, "Gender">;
export const Gender = make<Gender>();
