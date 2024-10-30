import { Brand, make } from "ts-brand";

// https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts
export type LayerZeroEndpointId = Brand<number, "LayerZeroEndpointId">;
export const LayerZeroEndpointId = make<LayerZeroEndpointId>();
