import { Box, Typography } from "@material-ui/core";
import React, { FC } from "react";

import emptyAccountIcon from "@extension-onboarding/assets/icons/empty-account.svg";
import { useStyles } from "@extension-onboarding/components/AccountsCard/components/EmptyContent/EmptyContent.style";

const EmptyContent: FC = () => {
  const classes = useStyles();
  return (
    <Box
      mt={15}
      textAlign="center"
      alignItems="center"
      justifyContent="center"
      display="flex"
      flexDirection="column"
    >
      <img src={emptyAccountIcon} className={classes.icon} />
      <Typography className={classes.description}>
        You don’t have any linked account
      </Typography>
    </Box>
  );
};

export default EmptyContent;
