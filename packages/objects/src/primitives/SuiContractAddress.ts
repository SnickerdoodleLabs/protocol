import { Brand, make } from "ts-brand";

export type SuiContractAddress = Brand<string, "SuiContractAddress">;
export const SuiContractAddress = make<SuiContractAddress>();
