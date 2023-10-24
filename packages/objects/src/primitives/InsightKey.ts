import { Brand, make } from "ts-brand";

export type InsightKey = Brand<string, "InsightKey">;
export const InsightKey = make<InsightKey>();
