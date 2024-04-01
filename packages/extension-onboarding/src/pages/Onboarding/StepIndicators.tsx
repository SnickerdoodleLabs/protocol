import { Box, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React, { FC } from "react";

const useStyles = makeStyles((theme) => ({
  wrapper: ({ color }: { activeColor: string; color: string }) => ({
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: "transparent",
    border: `1px solid`,
    "&:hover": {
      borderColor: color,
    },
  }),
  wrapperActive: ({ activeColor }: { activeColor: string; color: string }) => ({
    cursor: "default",
    borderColor: activeColor,
    "&:hover": {
      borderColor: activeColor,
    },
    transition: "border-color 0.5s",
  }),
  item: ({ color }: { activeColor: string; color: string }) => ({
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: color,
  }),
  itemActive: ({ activeColor }: { activeColor: string; color: string }) => ({
    backgroundColor: activeColor,
    transition: "background-color 0.5s",
  }),
}));

const StepIndicators: FC<{
  steps: number;
  activeStep: number;
  activeColor: string;
  color: string;
  onClick: (index: number) => void;
}> = ({ steps, activeStep, activeColor, color, onClick }) => {
  const classes = useStyles({ activeColor, color });

  return (
    <Box display="flex" alignItems="center">
      {Array.from({ length: steps }).map((_, index) => {
        return (
          <Box
            mr={1.25}
            key={`${index}.dot`}
            onClick={() => {
              if (index != activeStep) onClick(index);
            }}
            className={clsx(classes.wrapper, {
              [classes.wrapperActive]: index == activeStep,
            })}
          >
            <Box
              className={clsx(classes.item, {
                [classes.itemActive]: index == activeStep,
              })}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default StepIndicators;
