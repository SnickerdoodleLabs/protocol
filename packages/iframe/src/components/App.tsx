import { Box } from "@material-ui/core";
import React from "react";

import { useStyles } from "@core-iframe/components/App.style";

const App = () => {
  const classes = useStyles();
  return <Box className={classes.appWrapper}>Hello!</Box>;
};

export default App;
