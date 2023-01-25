import { ERecordKey } from "@persistence/ELocalStorageKey.js";
import { VolatileTableIndex } from "@persistence/volatile/VolatileTableIndex.js";

export const volatileStorageSchema = [
  new VolatileTableIndex(ERecordKey.ACCOUNT, "sourceAccountAddress", false, [
    ["sourceChain", false],
  ]),
  new VolatileTableIndex(
    ERecordKey.TRANSACTIONS,
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
  new VolatileTableIndex(ERecordKey.SITE_VISITS, "id", true, [
    ["url", false],
    ["startTime", false],
    ["endTime", false],
  ]),
  new VolatileTableIndex(ERecordKey.CLICKS, "id", true, [
    ["url", false],
    ["timestamp", false],
    ["element", false],
  ]),
  new VolatileTableIndex(ERecordKey.LATEST_BLOCK, "contract", false),
  new VolatileTableIndex(ERecordKey.EARNED_REWARDS, "queryCID", false, [
    ["type", false],
  ]),
  new VolatileTableIndex(ERecordKey.ELIGIBLE_ADS, ["queryCID", "key"], false, [
    ["type", false],
  ]),
  new VolatileTableIndex(
    ERecordKey.AD_SIGNATURES,
    ["queryCID", "adKey"],
    false,
    [["type", false]],
  ),
  new VolatileTableIndex(ERecordKey.COIN_INFO, ["chain", "address"], false),
  new VolatileTableIndex(
    ERecordKey.RESTORED_BACKUPS,
    "id",
    false,
    undefined,
    true,
  ),
];
