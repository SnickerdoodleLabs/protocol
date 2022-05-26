import { Brand, make } from "ts-brand";

export type EmailAddressString = Brand<string, "EmailAddressString">;
export const EmailAddressString = make<EmailAddressString>();
