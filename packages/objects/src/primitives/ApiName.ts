import { Brand, make } from "ts-brand";

export type ApiName = Brand<string, "ApiName">;
export const ApiName = make<ApiName>();
