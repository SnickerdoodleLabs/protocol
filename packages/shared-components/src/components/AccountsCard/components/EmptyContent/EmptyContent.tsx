import { Box, Typography } from "@material-ui/core";
import { useStyles } from "@shared-components/components/AccountsCard/components/EmptyContent/EmptyContent.style";
import React, { FC } from "react";

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
      <img
        src={
          "https://storage.googleapis.com/dw-assets/shared/icons/empty-account.svg"
        }
        className={classes.icon}
      />
      <Typography className={classes.description}>
        You don’t have any linked account
      </Typography>
    </Box>
  );
};

export default EmptyContent;
