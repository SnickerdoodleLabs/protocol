import { Brand, make } from "ts-brand";

export type BackupFileName = Brand<string, "BackupFileName">;
export const BackupFileName = make<BackupFileName>();
