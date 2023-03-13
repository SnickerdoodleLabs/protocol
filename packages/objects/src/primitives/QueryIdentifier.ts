import { Brand, make } from "ts-brand";

export type QueryIdentifier = Brand<string, "QueryIdentifier">;
export const QueryIdentifier = make<QueryIdentifier>();
