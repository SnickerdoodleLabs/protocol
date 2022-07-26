import { Brand, make } from "ts-brand";

export type TickerSymbol = Brand<string, "TickerSymbol">;
export const TickerSymbol = make<TickerSymbol>();
