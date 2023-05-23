import { Box } from "@material-ui/core";
import React from "react";
import ReactGA from "react-ga4";

import { useStyles } from "@extension-onboarding/App/App.style";
import MainContainer from "@extension-onboarding/containers/MainContainer";

const App = () => {
  const TRACKING_ID = "UA-219658390-3";
  ReactGA.initialize(TRACKING_ID);
  ReactGA.send(document.location.pathname);

  const classes = useStyles();
  return (
    <Box className={classes.appWrapper}>
      <MainContainer />
    </Box>
  );
};

export default App;
