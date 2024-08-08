import { TypedDataField } from "ethers";
import { Brand, make } from "ts-brand";

export type FarcasterKeyGatewayEIP712AddTypes = Brand<Record<string, TypedDataField[]>, "FarcasterKeyGatewayEIP712AddTypes">;
export const FarcasterKeyGatewayEIP712AddTypes = make<FarcasterKeyGatewayEIP712AddTypes>();
