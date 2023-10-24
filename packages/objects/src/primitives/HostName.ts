import { Brand, make } from "ts-brand";

export type HostName = Brand<string, "HostName">;
export const HostName = make<HostName>();
