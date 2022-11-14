import { Brand, make } from "ts-brand";

export type RecipientAddressType = Brand<string, "RecipientAddressType">;
export const RecipientAddressType = make<RecipientAddressType>();
