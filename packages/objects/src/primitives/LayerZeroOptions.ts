import { Brand, make } from "ts-brand";

// https://docs.layerzero.network/v2/developers/evm/protocol-gas-settings/options
export type LayerZeroOptions = Brand<string, "LayerZeroOptions">;
export const LayerZeroOptions = make<LayerZeroOptions>();
