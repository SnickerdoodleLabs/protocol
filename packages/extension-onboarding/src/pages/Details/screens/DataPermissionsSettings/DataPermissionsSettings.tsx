import PermissionSelection from "@extension-onboarding/components/PermissionSelection";
import Typography from "@extension-onboarding/components/Typography";
import { useStyles } from "@extension-onboarding/pages/Details/screens/DataPermissionsSettings/DataPermissionsSettings.style";
import { Box } from "@material-ui/core";
import React, { FC } from "react";

const DataPermissionsSettings: FC = () => {
  const classes = useStyles();

  return (
    <Box>
      <Typography variant="pageTitle">Data Permissions</Typography>
      <Box mt={1}>
        <Typography variant="pageDescription">
          Consent to share aggregate, anonymized insights derived from your
          data. You can set permissions individually, for each item.
        </Typography>
      </Box>
      <PermissionSelection />
    </Box>
  );
};

export default DataPermissionsSettings;
