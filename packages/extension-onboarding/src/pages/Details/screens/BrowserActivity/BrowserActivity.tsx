import Table from "@extension-onboarding/components/v2/Table";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useAccordionStyles } from "@extension-onboarding/styles/accordion.style";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  SiteVisit,
  UnixTimestamp,
  URLString,
} from "@snickerdoodlelabs/objects";
import { SDTypography, colors } from "@snickerdoodlelabs/shared-components";
import clsx from "clsx";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";

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
  [ETimeInterval.THIRTY_MINS]: "30min",
  [ETimeInterval.HOUR]: "1h",
  [ETimeInterval.SIX_HOURS]: "6h",
  [ETimeInterval.TWELVE_HOURS]: "12h",
  [ETimeInterval.ONE_DAY]: "24h",
  [ETimeInterval.ONE_WEEK]: "7d",
};

interface IndividualVisit {
  startTime: UnixTimestamp;
  duration: number;
}

interface VisitData {
  url: URLString;
  visits: number;
  totalVisitTime: number;
  individualVisits: IndividualVisit[];
}
const formatDateTimeToDdMmYyHhMmAmPm = (date: Date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  const hours = date.getHours();
  const amPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${formattedHours}:${minutes} ${amPm}`;
};
const getTimeString = (second: number) => {
  if (second < 60) {
    return `${second}s`;
  }
  const minutes = Math.floor(second / 60);
  const seconds = second % 60;
  if (minutes < 60) {
    return `${minutes}m ${seconds}s`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours < 24) {
    return `${hours}h ${mins}m`;
  }
  const days = Math.floor(hours / 24);
  const hrs = hours % 24;
  return `${days}d ${hrs}h`;
};

const useStyles = makeStyles((theme) => ({
  accordionButton: {
    "& .MuiIconButton-edgeEnd": {
      position: "absolute",
      left: 24,
      top: 12,
      marginRight: 0,
      marginLeft: 0,
      [theme.breakpoints.down("xs")]: {
        position: "absolute",
        left: "unset",
        right: 24,
        top: 12,
        marginRight: 0,
        marginLeft: 0,
      },
    },
  },
  pointer: {
    cursor: "pointer",
  },
}));

const columns = [
  {
    label: "Last Visit",
    render: (value: IndividualVisit) => (
      <SDTypography variant="bodyLg" fontWeight="medium" color="textHeading">
        {formatDateTimeToDdMmYyHhMmAmPm(new Date(value.startTime * 1000))}
      </SDTypography>
    ),
  },
  {
    label: "Duration",
    sortKey: "duration" as const,
    render: (value: IndividualVisit) => (
      <SDTypography variant="bodyLg" fontWeight="medium" color="textHeading">
        {getTimeString(value.duration)}
      </SDTypography>
    ),
  },
];

interface IInfoCard {
  label: string;
  value: string | number;
}
const InfoCard: FC<IInfoCard> = ({ label, value }) => {
  return (
    <Box
      bgcolor={colors.MAINPURPLE50}
      borderRadius={8}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={1.5}
    >
      <SDTypography variant="titleXs" fontWeight="medium" color="textHeading">
        {label}
      </SDTypography>
      <SDTypography variant="titleMd" fontWeight="bold">
        {value}
      </SDTypography>
    </Box>
  );
};

export default () => {
  const classes = useStyles();
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>();
  const [selectedInterval, setSelectedInterval] = useState<ETimeInterval>(
    ETimeInterval.ONE_WEEK,
  );
  const { sdlDataWallet } = useDataWalletContext();

  const getSiteVisits = () => {
    sdlDataWallet.getSiteVisits().map((res) => {
      setSiteVisits(res);
    });
  };

  const getUnixTime = useCallback((hour: number) => {
    const todayMs = Date.now();
    return UnixTimestamp(
      Math.floor(new Date(todayMs - hour * hourMs).getTime() / 1000),
    );
  }, []);

  const accordionClasses = useAccordionStyles();

  const renderData = useMemo(() => {
    if (!siteVisits) {
      return undefined;
    }
    const urlGroups: Map<URLString, VisitData> = new Map();
    const initialTime = getUnixTime(selectedInterval);
    const filteredVisits = siteVisits.filter(
      (siteVisit) => siteVisit.startTime >= initialTime,
    );
    filteredVisits.forEach((visit) => {
      const { url, startTime, endTime } = visit;
      const duration = endTime - startTime;

      if (urlGroups.has(url)) {
        const group = urlGroups.get(url)!;
        urlGroups.set(url, {
          ...group,
          visits: group.visits + 1,
          totalVisitTime: group.totalVisitTime + duration,
          individualVisits: [
            ...group.individualVisits,
            { startTime, duration },
          ],
        });
      } else {
        urlGroups.set(url, {
          url,
          visits: 1,
          totalVisitTime: duration,
          individualVisits: [{ startTime, duration }],
        });
      }
    });
    return urlGroups;
  }, [siteVisits, selectedInterval]);

  useEffect(() => {
    getSiteVisits();
  }, []);

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        flexDirection="row-reverse"
        justifyContent={{ xs: "center", sm: "flex-start" }}
        mb={3}
      >
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
                  bgcolor: colors.MAINPURPLE50,
                })}
                key={index}
                onClick={() => {
                  setSelectedInterval(ETimeInterval[key]);
                }}
                className={classes.pointer}
              >
                <SDTypography
                  variant="bodyLg"
                  fontWeight="bold"
                  color="textHeading"
                >
                  {DISPLAY_NAMES[ETimeInterval[key]]}
                </SDTypography>
              </Box>
            );
          })}
      </Box>

      {renderData &&
        renderData.size > 0 &&
        Array.from(renderData.values())
          .sort((a, b) => b.totalVisitTime - a.totalVisitTime)
          .map((value) => {
            return (
              <Box key={value.url} mb={2}>
                <Accordion
                  classes={{
                    root: clsx(accordionClasses.accordionRoot),
                  }}
                  elevation={0}
                  className={clsx(
                    accordionClasses.accordion,
                    classes.accordionButton,
                  )}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box width="100%">
                      <Box ml={{ xs: 0, sm: 3 }}>
                        <SDTypography
                          variant="titleMd"
                          fontWeight="medium"
                          style={{ wordBreak: "break-word" }}
                        >
                          {value.url
                            .replace("https://", "")
                            .replace("http://", "")
                            .replace("www.", "")}
                        </SDTypography>
                      </Box>
                      <Box mt={1.2} />
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} md={4}>
                          <InfoCard
                            label="Number of Visit"
                            value={value.visits}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <InfoCard
                            label="Avarage Time Per Visit"
                            value={getTimeString(
                              Math.floor(value.totalVisitTime / value.visits),
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <InfoCard
                            label="Total Time"
                            value={getTimeString(value.totalVisitTime)}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box mb={2} width="100%">
                      <Table
                        data={value.individualVisits.sort(
                          (a, b) => b.startTime - a.startTime,
                        )}
                        columns={columns}
                      />
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            );
          })}
    </>
  );
};
