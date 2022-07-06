import { Brand, make } from "ts-brand";

/**
 * This is just a very specific Ethereum Account Address; it's the
 * derived address that represents your Data Wallet
 */
export type DataWalletAddress = Brand<string, "DataWalletAddress">;
export const DataWalletAddress = make<DataWalletAddress>();
