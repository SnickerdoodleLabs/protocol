import { Brand, make } from "ts-brand";

export type Location = Brand<string, "Location">;
export const Location = make<Location>();
