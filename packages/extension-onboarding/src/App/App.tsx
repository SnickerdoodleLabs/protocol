import { Box } from "@material-ui/core";
import React from "react";

import { useStyles } from "@extension-onboarding/App/App.style";
import MainContainer from "@extension-onboarding/containers/MainContainer";

const App = () => {
  const classes = useStyles();
  return (
    <Box className={classes.appWrapper}>
      <MainContainer />
    </Box>
  );
};

export default App;
