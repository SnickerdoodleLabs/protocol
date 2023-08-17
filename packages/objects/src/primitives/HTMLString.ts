import { Brand, make } from "ts-brand";

export type HTMLString = Brand<string, "HTMLString">;
export const HTMLString = make<HTMLString>();
