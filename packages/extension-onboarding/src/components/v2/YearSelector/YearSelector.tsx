import { Box, Grid, IconButton, makeStyles } from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { SDTypography, colors } from "@snickerdoodlelabs/shared-components";
import clsx from "clsx";
import React, { FC, useRef, useState } from "react";

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
  slideTransition: {
    transition: "transform 0.3s ease-in-out",
  },
}));

const currentYear = new Date().getFullYear();
const yearsPerPage = 10;
const totalPages = 10;
const itemPercentage = 100 / yearsPerPage;

const YearSelector: FC<IYearSelectorProps> = ({ onSelect }) => {
  const years = useRef<number[][]>(
    [...Array(totalPages).keys()]
      .reverse()
      .map((i) =>
        [...Array(yearsPerPage).keys()]
          .reverse()
          .map((j) => currentYear - (i * yearsPerPage + j)),
      ),
  );
  const classes = useStyles();
  const [currentPage, setCurrentPage] = useState(totalPages - 2);
  const [rangeSelectOpen, setRangeSelectOpen] = useState(false);

  return (
    <Box bgcolor="white" width={300} position="relative" borderRadius={8} p={2}>
      {rangeSelectOpen && (
        <Box
          className={clsx(classes.slideTransition, "fade-in")}
          onClick={() => {
            setRangeSelectOpen(false);
          }}
          position="absolute"
          bgcolor="white"
          zIndex={1}
          width="100%"
          height="100%"
          overflow="auto"
          display="flex"
          flexDirection="column-reverse"
          top={0}
          left={0}
          py={3}
        >
          {years.current.map((dateRange, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent="center"
              mb={1}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentPage(index);
                setRangeSelectOpen(false);
              }}
            >
              <SDTypography
                color="textHeading"
                variant="bodyLg"
                fontWeight="regular"
                className={classes.pointer}
              >{`${dateRange[0]}-${dateRange[yearsPerPage - 1]}`}</SDTypography>
            </Box>
          ))}
        </Box>
      )}

      <Box mb={0.5} display="flex" boxSizing="border-box" alignItems="center">
        <SDTypography
          color="textHeading"
          variant="bodyLg"
          fontWeight="medium"
          onClick={() => setRangeSelectOpen(true)}
          className={classes.pointer}
        >
          {years.current[currentPage][0]}-
          {years.current[currentPage][yearsPerPage - 1]}
        </SDTypography>
        <Box ml="auto">
          <IconButton
            disabled={currentPage === 0}
            onClick={() =>
              setCurrentPage((currentPage + totalPages - 1) % totalPages)
            }
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            disabled={currentPage === totalPages - 1}
            onClick={() => setCurrentPage((currentPage + 1) % totalPages)}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>

      <div style={{ overflow: "hidden", position: "relative" }}>
        <div
          className={clsx(classes.slideTransition)}
          style={{
            transform: `translateX(-${currentPage * itemPercentage}%)`,
            display: "flex",
            width: `${totalPages * 100}%`,
          }}
        >
          {years.current.map((dateRange, index) => (
            <Box
              key={index}
              display="flex"
              boxSizing="border-box"
              style={{
                flexBasis: `${itemPercentage}%`,
                maxWidth: `${itemPercentage}%`,
                flexShrink: 0,
              }}
            >
              <Grid key={index} container spacing={1}>
                {dateRange.map((year, subIndex) => (
                  <Grid key={`${index}${subIndex}`} item xs={4}>
                    <Box
                      py={0.5}
                      px={1.5}
                      borderRadius={40}
                      onClick={() => onSelect(year)}
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
        </div>
      </div>
    </Box>
  );
};

export default YearSelector;
