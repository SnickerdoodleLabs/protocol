import { useStyles } from "@synamint-extension-sdk/content/components/Screens/Loading/Loading.style";
import { CircularProgress, Box, Dialog } from "@material-ui/core";
import React, { FC } from "react";
const Loading: FC = () => {
  const classes = useStyles();
  return (
    <Dialog
      open={true}
      disablePortal
      maxWidth="xs"
      fullWidth
      className={classes.container}
    >
      <Box py={12} display="flex" justifyContent="center">
        <CircularProgress size={40} />
      </Box>
    </Dialog>
  );
};

export default Loading;
