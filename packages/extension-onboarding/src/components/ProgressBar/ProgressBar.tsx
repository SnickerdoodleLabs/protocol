import { Box, makeStyles, Typography } from "@material-ui/core";
import React, { FC } from "react";
import ProgressBarDot from "@extension-onboarding/components/ProgressBar/components/ProgressBarDot";
import { useStyles } from "@extension-onboarding/components/ProgressBar/ProgressBar.style";

export interface IProgressBarProps {
  progressStatus: number;
}

const ProgressBar: FC<IProgressBarProps> = ({ progressStatus }) => {
  const classes = useStyles();
  return (
    <Box className={classes.container} mt={5}>
      <Box className={classes.columnContainer}>
        <ProgressBarDot number={1} status={progressStatus} />
        <Typography className={progressStatus == 1 ? classes.text : classes.textFaded }>Link your Accounts</Typography>
      </Box>
      <Box className={classes.lineData} mt={3.25} />
      <Box className={classes.columnContainer}>
        <ProgressBarDot number={2} status={progressStatus} />
        <Typography className={progressStatus == 2 ? classes.text : classes.textFaded}>Build your Profile</Typography>
      </Box>
      <Box className={classes.lineData} mt={3.25} />
      <Box className={classes.columnContainer}>
        <ProgressBarDot number={3} status={progressStatus} />
        <Typography className={progressStatus == 3 ? classes.text : classes.textFaded}>View your Data</Typography>
      </Box>
    </Box>
  );
};

export default ProgressBar;
