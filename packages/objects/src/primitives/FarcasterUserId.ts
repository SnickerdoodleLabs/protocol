import { Brand, make } from "ts-brand";

/**
 * A user id in the Farcaster system, usually called FID
 */
export type FarcasterUserId = Brand<number, "FarcasterUserId">;
export const FarcasterUserId = make<FarcasterUserId>();
