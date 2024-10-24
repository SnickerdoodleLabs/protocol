import { Brand, make } from "ts-brand";

export type PasskeyId = Brand<string, "PasskeyId">;
export const PasskeyId = make<PasskeyId>();
