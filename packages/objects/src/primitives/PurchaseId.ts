import { Brand, make } from "ts-brand";

export type PurchaseId = Brand<string, "PurchaseId">;
export const PurchaseId = make<PurchaseId>();
