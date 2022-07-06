import { Brand, make } from "ts-brand";

export type InitializationVector = Brand<string, "InitializationVector">;
export const InitializationVector = make<InitializationVector>();
