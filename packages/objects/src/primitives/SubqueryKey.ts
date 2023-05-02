import { Brand, make } from "ts-brand";

export type SubqueryKey = Brand<string, "SubqueryKey">;
export const SubqueryKey = make<SubqueryKey>();
