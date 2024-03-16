import { Brand, make } from "ts-brand";

export type LLMData = Brand<string, "LLMData">;
export const LLMData = make<LLMData>();
