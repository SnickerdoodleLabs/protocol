import { Brand, make } from "ts-brand";

export type Month = Brand<number, "Month">;
export const Month = make<Month>();
