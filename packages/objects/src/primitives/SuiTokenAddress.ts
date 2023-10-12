import { Brand, make } from "ts-brand";

export type SuiTokenAddress = Brand<string, "SuiTokenAddress">;
export const SuiTokenAddress = make<SuiTokenAddress>();
