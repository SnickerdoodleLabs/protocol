import { Brand, make } from "ts-brand";

export type DiscordRefreshToken = Brand<string, "DiscordRefreshToken">;
export const DiscordRefreshToken = make<DiscordRefreshToken>();
