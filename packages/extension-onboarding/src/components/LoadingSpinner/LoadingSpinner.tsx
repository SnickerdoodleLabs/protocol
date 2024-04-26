import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import React from "react";

import { useStyles } from "@extension-onboarding/components/LoadingSpinner/LoadingSpinner.style";
import {
  ELoadingIndicatorType,
  useLayoutContext,
} from "@extension-onboarding/context/LayoutContext";

const LoadingSpinner: React.FC = () => {
  const { loading, loaderInfo } = useLayoutContext();
  const classes = useStyles();
  const getLoadingComponent = () => {
    switch (loaderInfo?.type) {
      case ELoadingIndicatorType.DEFAULT: {
        return <CircularProgress />;
      }
      case ELoadingIndicatorType.COMPONENT: {
        return loaderInfo?.component ? (
          loaderInfo.component
        ) : (
          <CircularProgress />
        );
      }
      default: {
        return <CircularProgress />;
      }
    }
  };

  return (
    <>
      {loading && (
        <Box className={classes.loadingWrapper}>{getLoadingComponent()}</Box>
      )}
    </>
  );
};

export default LoadingSpinner;
