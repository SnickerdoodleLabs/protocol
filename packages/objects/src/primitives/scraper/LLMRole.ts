import { Brand, make } from "ts-brand";

export type LLMRole = Brand<string, "LLMRole">;
export const LLMRole = make<LLMRole>();
