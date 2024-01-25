import { config } from "process";

import {
  ERecordKey,
  ClickDataMigrator,
  EBackupPriority,
  VersionedObject,
} from "@snickerdoodlelabs/objects";

import { VolatileTableIndex } from "@persistence/volatile";

export const dummyClickData = [
  {
    data: {
      url: "https://example.com/page/47",
      timestamp: 1706029216,
      element: "element_16",
      version2Element: "element_9",
    },
    lastUpdate: 1706029216,
    version: 2,
    deleted: 0,
  },
  {
    data: {
      url: "https://example.com/page/84",
      timestamp: 1706029216,
      element: "element_4",
      version2Element: "element_10",
      version3Element: 15,
    },
    lastUpdate: 1706029216,
    version: 3,
    deleted: 0,
  },
  {
    data: {
      url: "https://example.com/page/38",
      timestamp: 1706029216,
      element: "element_26",
    },
    lastUpdate: 1706029216,
    deleted: 0,
  },
  {
    data: {
      url: "https://example.com/page/31",
      timestamp: 1706029216,
      element: "element_24",
    },
    lastUpdate: 1706029216,
    deleted: 0,
  },
  {
    data: {
      url: "https://example.com/page/54",
      timestamp: 1706029216,
      element: "element_28",
      version2Element: "element_46",
    },
    lastUpdate: 1706029216,
    version: 2,
    deleted: 0,
  },
  {
    data: {
      url: "https://example.com/page/46",
      timestamp: 1706029216,
      element: "element_1",
    },
    lastUpdate: 1706029216,
    version: 1,
    deleted: 0,
  },
  {
    data: {
      url: "https://example.com/page/88",
      timestamp: 1706029216,
      element: "element_30",
      version2Element: "element_7",
      version3Element: 7,
    },
    lastUpdate: 1706029216,
    version: 3,
    deleted: 0,
  },
  {
    data: {
      url: "https://example.com/page/86",
      timestamp: 1706029216,
      element: "element_34",
    },
    lastUpdate: 1706029216,
    version: 1,
    deleted: 0,
  },
  {
    data: {
      url: "https://example.com/page/42",
      timestamp: 1706029216,
      element: "element_28",
      version2Element: "element_19",
      version3Element: 41,
    },
    lastUpdate: 1706029216,
    version: 3,
    deleted: 0,
  },
  {
    data: {
      url: "https://example.com/page/81",
      timestamp: 1706029216,
      element: "element_48",
      version2Element: "element_38",
    },
    lastUpdate: 1706029216,
    version: 2,
    deleted: 0,
  },
];

export const dummyIndex = ERecordKey.CLICKS;
export const dummyTable = new VolatileTableIndex(
  ERecordKey.CLICKS,
  ["url", "timestamp"],
  false,
  new ClickDataMigrator(),
  EBackupPriority.NORMAL,
  10000,
  10000,
  [
    ["url", false],
    ["timestamp", false],
    ["element", false],
  ],
);
