import { Brand, make } from "ts-brand";

// Twitter's snowflake format for uniquely identifiable descriptors (IDs)

export type SocialPrimaryKey = Brand<string, "SocialPrimaryKey">;
export const SocialPrimaryKey = make<SocialPrimaryKey>();
