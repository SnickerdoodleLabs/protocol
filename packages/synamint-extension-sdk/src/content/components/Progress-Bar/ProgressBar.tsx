import {
  Box,
  LinearProgress,
  LinearProgressProps,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";

import { useStyles } from "@synamint-extension-sdk/content/components/Progress-Bar/ProgressBar.style";

const LinearProgressBar = (props: LinearProgressProps & { value: number }) => {
  const classes = useStyles();

  const [position, setPosition] = useState("0%");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (props.value >= 100) {
        setPosition("90%");
      } else if (props.value >= 75) {
        setPosition("70%");
      } else if (props.value >= 50) {
        setPosition("45%");
      } else if (props.value >= 25) {
        setPosition("20%");
      } else {
        setPosition("0%");
      }
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [props.value]);

  return (
    <Box>
      {props.value > 0 && (
        <Box
          sx={{
            position: "relative",
            left: position,
            minWidth: 35,
          }}
        >
          <Typography className={classes.percentText}>{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      )}
      <Box>
        <LinearProgress
          className={classes.bar}
          variant="determinate"
          {...props}
        />
      </Box>
    </Box>
  );
};

const ProgressBar = () => {
  const [progress, setProgress] = useState(25);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return prevProgress;
        }
        return prevProgress + 25;
      });
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box display="flex" justifyContent="center">
      <LinearProgressBar value={progress} />
    </Box>
  );
};

export default ProgressBar;
