import { Box } from "@material-ui/core";
import React from "react";

import { useStyles } from "@web-integration-test/components/App.style";

const App = () => {
  const classes = useStyles();
  return (
    <Box className={classes.appWrapper}>
      Hello! This is DApp.com your source of Dappy Goodness
    </Box>
  );
};

export default App;
