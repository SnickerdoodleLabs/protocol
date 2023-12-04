import { Box, CircularProgress } from "@material-ui/core";
import React, { FC } from "react";

interface ILoadingIndicatorProps {}

export const LoadingIndicator: FC<ILoadingIndicatorProps> = ({}) => {
  return (
    <Box
      position="fixed"
      zIndex={1}
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#00000022"
      top={0}
      left={0}
    >
      <CircularProgress />
    </Box>
  );
};
