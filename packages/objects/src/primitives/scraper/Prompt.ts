import { Brand, make } from "ts-brand";

export type Prompt = Brand<string, "Prompt">;
export const Prompt = make<Prompt>();
