import { AccountAddress } from "@snickerdoodlelabs/objects";

export const getAccountAddressText = (
  accountAddress: AccountAddress,
): string => {
  return `${accountAddress.slice(0, 5)}................${accountAddress.slice(
    -4,
  )}`;
};
