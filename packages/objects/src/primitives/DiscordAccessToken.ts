import { Brand, make } from "ts-brand";

export type DiscordAccessToken = Brand<string, "DiscordAccessToken">;
export const DiscordAccessToken = make<DiscordAccessToken>();
