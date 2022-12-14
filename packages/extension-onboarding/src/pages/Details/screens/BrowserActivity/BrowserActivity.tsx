import Button from "@extension-onboarding/components/Button";
import { useAppContext } from "@extension-onboarding/context/App";
import { useStyles } from "@extension-onboarding/pages/Details/screens/BrowserActivity/BrowserActivity.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, Typography } from "@material-ui/core";
import {
  SiteVisit,
  UnixTimestamp,
  URLString,
} from "@snickerdoodlelabs/objects";
import React, { useCallback, useEffect, useMemo, useState } from "react";

declare const window: IWindowWithSdlDataWallet;

const hourMs = 60 * 60 * 1000;

enum ETimeInterval {
  THIRTY_MINS = 0.5,
  HOUR = 1,
  SIX_HOURS = 6,
  TWELVE_HOURS = 12,
  ONE_DAY = 24,
  ONE_WEEK = 168,
}

const DISPLAY_NAMES = {
  [ETimeInterval.THIRTY_MINS]: "30mins",
  [ETimeInterval.HOUR]: "1h",
  [ETimeInterval.SIX_HOURS]: "6h",
  [ETimeInterval.TWELVE_HOURS]: "12h",
  [ETimeInterval.ONE_DAY]: "24h",
  [ETimeInterval.ONE_WEEK]: "7d",
};

export default () => {
  const classes = useStyles();
  const {} = useAppContext();
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>();
  const [selectedInterval, setSelectedInterVal] = useState<ETimeInterval>(
    ETimeInterval.ONE_WEEK,
  );

  const getSiteVisits = () => {
    window.sdlDataWallet.getSiteVisits().map((res) => {
      setSiteVisits(res);
    });
  };

  const getUnixTime = useCallback((hour: number) => {
    const todayMs = Date.now();
    return UnixTimestamp(
      Math.floor(new Date(todayMs - hour * hourMs).getTime() / 1000),
    );
  }, []);

  const filteredSiteVisits = useMemo(() => {
    if (!siteVisits) {
      return null;
    }
    const initialTime = getUnixTime(selectedInterval);
    return siteVisits
      .filter((siteVisit) => siteVisit.startTime >= initialTime)
      .reduce((acc, val) => {
        if (acc[val.domain || val.url]) {
          acc[val.domain || val.url] += 1;
        } else {
          acc[val.domain || val.url] = 1;
        }
        return acc;
      }, {} as Record<URLString, number>);
  }, [siteVisits, selectedInterval]);

  // console.log(filteredSiteVisits);

  useEffect(() => {
    getSiteVisits();
  }, []);

  return (
    <>
      {siteVisits && (
        <Box display="flex" flexDirection="row-reverse">
          {Object.keys(ETimeInterval)
            .filter((key) => isNaN(Number(key)))
            .map((key, index) => {
              return (
                <Button
                  key={index}
                  onClick={() => {
                    setSelectedInterVal(ETimeInterval[key]);
                  }}
                >
                  {DISPLAY_NAMES[ETimeInterval[key]]}
                </Button>
              );
            })}
        </Box>
      )}
      <Box>
        <p>{JSON.stringify(filteredSiteVisits, null, 4)}</p>
      </Box>
    </>
  );
};
