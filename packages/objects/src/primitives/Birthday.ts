import { Brand, make } from "ts-brand";

// Birthday = UnixTimestamp / 1000 = # of days alive
export type Birthday = Brand<number, "Birthday">;
export const Birthday = make<Birthday>();
