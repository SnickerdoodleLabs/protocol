import { Brand } from "ts-brand";

import { TokenAddress } from "@objects/businessObjects/TokenAddress.js";
import { BigNumberString } from "@objects/primitives/BigNumberString.js";
import { SolanaTokenAddress } from "@objects/primitives/SolanaTokenAddress.js";

export type NftTokenAddressWithTokenId = Brand<
  string,
  "NftTokenAddressWithTokenId"
>;
export const NftTokenAddressWithTokenId = (
  tokenAddress: TokenAddress,
  tokenId: BigNumberString | SolanaTokenAddress,
): NftTokenAddressWithTokenId => {
  const id = `${tokenAddress}|#|${tokenId.toString()}`;
  return id as NftTokenAddressWithTokenId;
};
