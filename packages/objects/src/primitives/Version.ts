import { Brand, make } from "ts-brand";

export type Version = Brand<string, "Version">;
export const Version = make<Version>();
