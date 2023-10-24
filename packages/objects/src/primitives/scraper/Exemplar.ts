import { Brand, make } from "ts-brand";

export type Exemplar = Brand<string, "Exemplar">;
export const Exemplar = make<Exemplar>();
