import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";

import { useStyles } from "@synamint-extension-sdk/content/components/screens/ShoppingDataProcess/ShoppingDataProcess.style";

interface IShoppingDataProcessProps {
  onCloseClick: () => void;
}

export const ShoppingDataProcess: React.FC<IShoppingDataProcessProps> = ({
  onCloseClick,
}: IShoppingDataProcessProps) => {
  const classes = useStyles();

  return (
    <Box width={445} bgcolor="#FFFFFF" className={classes.container}>
      <Box display="flex" justifyContent="flex-end">
        <Box>
          <IconButton
            disableFocusRipple
            disableRipple
            disableTouchRipple
            aria-label="close"
            onClick={onCloseClick}
          >
            <CloseIcon style={{ fontSize: 24 }} />
          </IconButton>
        </Box>
      </Box>
      <Box mt={1.5}>
        <Typography className={classes.title}>
          Adding your data to your Data Wallet
        </Typography>
      </Box>
      <Box
        mt={1.5}
        my={2}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
      <Box mt={1.5}>
        <Typography className={classes.subText}>
          please wait for the process!
        </Typography>
      </Box>
    </Box>
  );
};
