import { Box, Button, Typography } from "@material-ui/core";
import React, { FC, memo } from "react";

import { useStyles } from "../Amazon.style";

interface IAmazonConnectionItemProps {
  icon: string;
  providerName: string;
  handleConnectClick: () => void;
}

export const AmazonConnectItem: FC<IAmazonConnectionItemProps> = memo(
  ({ icon, providerName, handleConnectClick }: IAmazonConnectionItemProps) => {
    const classes = useStyles();
    return (
      <>
        <Box className={classes.logoProviderNameContainer}>
          <Box>
            <img className={classes.LogoImage} src={icon} />
          </Box>
          <Box>
            <Typography className={classes.providerName}>
              {providerName}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Button className={classes.Button} onClick={handleConnectClick}>
            Connect
          </Button>
        </Box>
      </>
    );
  },
);
