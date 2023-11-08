import { Box, Grid, IconButton, makeStyles } from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { SDTypography, colors } from "@snickerdoodlelabs/shared-components";
import clsx from "clsx";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import React, { FC, useRef } from "react";

interface IYearSelectorProps {
  onSelect: (year: number) => void;
  defaultYear?: number;
}

const useStyles = makeStyles((theme) => ({
  pointer: {
    cursor: "pointer",
  },
  selectable: {
    "&:hover": {
      backgroundColor: colors.MAINPURPLE50,
    },
  },
}));

const currentYear = new Date().getFullYear();

const YearSelector: FC<IYearSelectorProps> = ({ onSelect }) => {
  // 12 pages and 10 years per page
  const years = useRef<number[][]>(
    [...Array(12).keys()]
      .reverse()
      .map((i) =>
        [...Array(10).keys()].reverse().map((j) => currentYear - (i * 10 + j)),
      ),
  );
  const classes = useStyles();
  const [currentRangeIndex, setCurrentRangeIndex] = React.useState(9);
  const [rangeSelectOpen, setRangeSelectOpen] = React.useState(false);

  const indexValue = useMotionValue(9);
  const translateX = useTransform(indexValue, [0, 11], ["0%", "-1100%"]);
  const handleRangeSelect = (index: number) => {
    rangeSelectOpen && setRangeSelectOpen(false);
    indexValue.set(index);
    setCurrentRangeIndex(index);
  };

  return (
    <Box bgcolor="white" width={300} position="relative" borderRadius={8} p={2}>
      {rangeSelectOpen && (
        <Box
          position="absolute"
          bgcolor="white"
          zIndex={1}
          width="100%"
          height="100%"
          overflow="auto"
          top={0}
          left={0}
          py={3}
        >
          <motion.div
            onClick={(e) => {
              e.stopPropagation();
              setRangeSelectOpen(false);
            }}
            initial={{
              opacity: 0.5,
            }}
            animate={{
              opacity: 1,
              transition: {
                ease: "easeOut",
                duration: 0.3,
              },
            }}
          >
            {[...years.current].reverse().map((dateRange, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent="center"
                mb={1}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRangeSelect(11 - index);
                }}
              >
                <SDTypography
                  color="textHeading"
                  variant="bodyLg"
                  fontWeight="regular"
                  className={classes.pointer}
                >{`${dateRange[0]}-${dateRange[9]}`}</SDTypography>
              </Box>
            ))}
          </motion.div>
        </Box>
      )}
      <Box mb={0.5} display="flex" boxSizing="border-box" alignItems="center">
        <Box
          onClick={() => {
            setRangeSelectOpen(true);
          }}
        >
          <SDTypography
            color="textHeading"
            variant="bodyLg"
            fontWeight="medium"
            className={classes.pointer}
          >
            {years.current[currentRangeIndex][0]}-
            {years.current[currentRangeIndex][9]}
          </SDTypography>
        </Box>
        <Box ml="auto">
          <IconButton
            disabled={currentRangeIndex === 0}
            onClick={() => {
              animate(indexValue, currentRangeIndex - 1, {
                duration: 0.3,
                onComplete: () => {
                  setCurrentRangeIndex(currentRangeIndex - 1);
                },
              });
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            disabled={currentRangeIndex === 11}
            onClick={() => {
              animate(indexValue, currentRangeIndex + 1, {
                duration: 0.3,
                onComplete: () => {
                  setCurrentRangeIndex(currentRangeIndex + 1);
                },
              });
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>
      <div style={{ overflow: "hidden", position: "relative" }}>
        <motion.div
          style={{
            display: "flex",
            x: translateX,
          }}
        >
          {years.current.map((dateRange, index) => (
            <Box
              key={index}
              display="flex"
              width="100%"
              boxSizing="border-box"
              style={{ flexBasis: "100%", maxWidth: "100%", flexShrink: 0 }}
            >
              <Grid key={index} container spacing={1}>
                {dateRange.map((year, subIndex) => (
                  <Grid key={`${index}${subIndex}`} item xs={4}>
                    <Box
                      py={0.5}
                      px={1.5}
                      borderRadius={40}
                      onClick={() => {
                        onSelect(year);
                      }}
                      display="flex"
                      className={clsx(classes.pointer, classes.selectable)}
                      justifyContent="center"
                    >
                      <SDTypography
                        color="textHeading"
                        variant="bodyLg"
                        fontWeight="regular"
                      >
                        {year}
                      </SDTypography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </motion.div>
      </div>
    </Box>
  );
};

export default YearSelector;
