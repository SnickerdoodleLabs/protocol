import { ELocalStorageKey } from "@persistence/ELocalStorageKey.js";
import { VolatileTableIndex } from "@persistence/volatile/VolatileTableIndex.js";

export const volatileStorageSchema = [
  new VolatileTableIndex(
    ELocalStorageKey.ACCOUNT,
    "sourceAccountAddress",
    false,
    [["sourceChain", false]],
  ),
  new VolatileTableIndex(
    ELocalStorageKey.TRANSACTIONS,
    "hash",
    false,
    [
      ["timestamp", false],
      ["chainId", false],
      ["value", false],
      ["to", false],
      ["from", false],
    ],
    false, // TODO: Re-enable backups of transactions!
  ),
  new VolatileTableIndex(ELocalStorageKey.SITE_VISITS, "id", true, [
    ["url", false],
    ["startTime", false],
    ["endTime", false],
  ]),
  new VolatileTableIndex(ELocalStorageKey.CLICKS, "id", true, [
    ["url", false],
    ["timestamp", false],
    ["element", false],
  ]),
  new VolatileTableIndex(ELocalStorageKey.LATEST_BLOCK, "contract", false),
  new VolatileTableIndex(ELocalStorageKey.EARNED_REWARDS, "queryCID", false, [
    ["type", false],
  ]),
  new VolatileTableIndex(ELocalStorageKey.ELIGIBLE_ADS, ["queryCID", "key"], false, [
    ["type", false],
  ]),
  new VolatileTableIndex(ELocalStorageKey.AD_SIGNATURES, ["queryCID", "adKey"], false, [
    ["type", false],
  ]),
  new VolatileTableIndex(
    ELocalStorageKey.COIN_INFO,
    ["chain", "address"],
    false,
  ),
  new VolatileTableIndex(
    ELocalStorageKey.RESTORED_BACKUPS,
    "id",
    false,
    undefined,
    true,
  ),
];
