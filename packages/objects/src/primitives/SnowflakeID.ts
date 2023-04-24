import { Brand, make } from "ts-brand";

// Twitter's snowflake format for uniquely identifiable descriptors (IDs)

export type SnowflakeID = Brand<string, "SnowflakeID">;
export const SnowflakeID = make<SnowflakeID>();
