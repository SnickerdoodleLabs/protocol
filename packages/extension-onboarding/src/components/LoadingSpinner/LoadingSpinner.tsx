import * as defaultLoading from "@extension-onboarding/assets/lotties/loading.json";
import { useStyles } from "@extension-onboarding/components/LoadingSpinner/LoadingSpinner.style";
import { LOTTIE_DEFAULT_OPTIONS } from "@extension-onboarding/constants/lottieDefaults";
import {
  ELoadingIndicatorType,
  useLayoutContext,
} from "@extension-onboarding/context/LayoutContext";
import { Box, CircularProgress } from "@material-ui/core";
import React from "react";
import Lottie from "react-lottie";

const LoadingSpinner: React.FC = () => {
  const { loading, loaderInfo } = useLayoutContext();
  const classes = useStyles();

  console.log({ loaderInfo });

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
      case ELoadingIndicatorType.LOTTIE: {
        return (
          <Box width={200}>
            <Lottie
              options={{
                ...LOTTIE_DEFAULT_OPTIONS,
                animationData: loaderInfo?.file ?? defaultLoading,
              }}
            />
          </Box>
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
