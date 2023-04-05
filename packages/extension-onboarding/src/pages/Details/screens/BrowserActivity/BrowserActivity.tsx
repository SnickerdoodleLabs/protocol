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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

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
      return [];
    }
    const initialTime = getUnixTime(selectedInterval);
    return Object.entries(
      siteVisits
        .filter((siteVisit) => siteVisit.startTime >= initialTime)
        .reduce((acc, val) => {
          if (acc[val.domain || val.url]) {
            acc[val.domain || val.url] += 1;
          } else {
            acc[val.domain || val.url] = 1;
          }
          return acc;
        }, {} as Record<URLString, number>),
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [siteVisits, selectedInterval]);

  const data = {
    labels: filteredSiteVisits.map((i) => i[0]),
    datasets: [
      {
        data: filteredSiteVisits.map((i) => i[1]),
        backgroundColor: "#7F79B0",
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    indexAxis: "y" as const,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          precision: 0,
        },
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
    elements: {
      bar: {},
    },
    responsive: true,
  };

  useEffect(() => {
    getSiteVisits();
  }, []);

  return (
    <>
      <Box mb={2}>
        <Box display="flex" mb={1} alignItems="center">
          <Typography className={classes.title}>
            Most Visited Domains
          </Typography>
        </Box>
      </Box>
      {siteVisits && (
        <Box display="flex" flexDirection="row-reverse">
          {Object.keys(ETimeInterval)
            .filter((key) => isNaN(Number(key)))
            .map((key, index) => {
              return (
                <Box
                  borderRadius={16}
                  py={0.5}
                  px={1.5}
                  mx={1}
                  {...(ETimeInterval[key] === selectedInterval && {
                    bgcolor: "#F2F2F8",
                  })}
                  className={classes.btn}
                  key={index}
                  onClick={() => {
                    setSelectedInterVal(ETimeInterval[key]);
                  }}
                >
                  <Typography className={classes.btnText}>
                    {DISPLAY_NAMES[ETimeInterval[key]]}
                  </Typography>
                </Box>
              );
            })}
        </Box>
      )}
      <Box height={300}>
        <Bar options={options} data={data} />
      </Box>
    </>
  );
};
