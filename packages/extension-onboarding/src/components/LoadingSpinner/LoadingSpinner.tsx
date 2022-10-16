import { useStyles } from "@extension-onboarding/components/LoadingSpinner/LoadingSpinner.style";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { Box, CircularProgress } from "@material-ui/core";
import React from "react";

const LoadingSpinner: React.FC = () => {
  const { loading } = useLayoutContext();
  const classes = useStyles();

  return (
    <>
      {loading && (
        <Box className={classes.loadingWrapper}>
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default LoadingSpinner;
