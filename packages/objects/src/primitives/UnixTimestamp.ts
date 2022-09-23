import { Brand, make } from "ts-brand";

export type UnixTimestamp = Brand<number, "UnixTimestamp">;
export const UnixTimestamp = make<UnixTimestamp>();
export function toUnixTimestamp(date: Date): UnixTimestamp {
  return UnixTimestamp(date.getTime() / 1000);
}
