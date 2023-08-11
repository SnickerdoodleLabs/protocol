import { Backdrop, Box, CircularProgress } from "@material-ui/core";
import React from "react";

const Loading = () => {
  return (
    <Box
      display="flex"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress />
    </Box>
  );
};

export default Loading;
