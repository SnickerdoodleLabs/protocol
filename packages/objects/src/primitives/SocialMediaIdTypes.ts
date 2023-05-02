import { Brand, make } from "ts-brand";

export type DiscordID = Brand<string, "DiscordID">;
export const DiscordID = make<DiscordID>();

export type TwitterID = Brand<string, "TwitterID">;
export const TwitterID = make<TwitterID>();

export type SocialMediaID = TwitterID | DiscordID;
