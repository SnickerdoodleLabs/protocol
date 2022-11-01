import { Brand, make } from "ts-brand";

export type ContractName = Brand<string, "ContractName">;
export const ContractName = make<ContractName>();
