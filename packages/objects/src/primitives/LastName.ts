import { Brand, make } from "ts-brand";

export type LastName = Brand<string, "LastName">;
export const LastName = make<LastName>();
