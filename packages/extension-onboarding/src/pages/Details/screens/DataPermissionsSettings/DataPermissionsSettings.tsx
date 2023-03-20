import PermissionSelection from "@extension-onboarding/components/PermissionSelection";
import { useStyles } from "@extension-onboarding/pages/Details/screens/DataPermissionsSettings/DataPermissionsSettings.style";
import { Box, Typography } from "@material-ui/core";
import React, { FC } from "react";

const DataPermissionsSettings: FC = () => {
  const classes = useStyles();

  return (
    <Box>
      <Typography className={classes.title}>Data Permissions</Typography>
      <Typography className={classes.description}>
        You can set permission for every data that you have in your data wallet
        individually.
      </Typography>
      <PermissionSelection />
    </Box>
  );
};

export default DataPermissionsSettings;
