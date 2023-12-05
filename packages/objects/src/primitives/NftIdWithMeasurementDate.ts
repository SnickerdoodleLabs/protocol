import { Brand } from "ts-brand";

import { NftTokenAddressWithTokenId } from "@objects/primitives/NftTokenAddressWithTokenId.js";
import { UnixTimestamp } from "@objects/primitives/UnixTimestamp.js";

export type NftIdWithMeasurementDate = Brand<
  string,
  "NftIdWithMeasurementDate"
>;
export const NftIdWithMeasurementDate = (
  tokenAddress: NftTokenAddressWithTokenId,
  measurementDate: UnixTimestamp,
): NftIdWithMeasurementDate => {
  const id = `${tokenAddress}{-}${measurementDate.toString()}`;
  return id as NftIdWithMeasurementDate;
};
