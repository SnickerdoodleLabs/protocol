import { Brand, make } from "ts-brand";

export type SubQueryKey = Brand<string, "SubQueryKey">;
export const SubQueryKey = make<SubQueryKey>();
