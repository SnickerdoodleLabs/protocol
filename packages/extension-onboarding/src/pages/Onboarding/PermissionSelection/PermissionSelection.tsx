import snickerDoodleLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import Button from "@extension-onboarding/components/Button";
import PermissionSelectionComponent from "@extension-onboarding/components/PermissionSelection";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { useAppContext } from "@extension-onboarding/context/App";
import { useStyles } from "@extension-onboarding/pages/Onboarding/PermissionSelection/PermissionSelection.style";
import { Box, Typography } from "@material-ui/core";
import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
const PermissionSelection: FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { invitationInfo } = useAppContext();
  return (
    <>
      <img src={snickerDoodleLogo} />
      <Box mt={4}>
        <Typography className={classes.title}>
          Set Your Data Permissions
        </Typography>
        <Typography className={classes.description}>
          Consent to share aggregate, anonymized insights derived from your
          data. You can set permissions individually, for each item.
        </Typography>
        <PermissionSelectionComponent showDefaultsSettings={false} />
        <Box
          display="flex"
          flexDirection="column"
          marginLeft="auto"
          alignItems="center"
          width="30%"
        >
          <Button
            onClick={() => {
              if (invitationInfo.consentAddress) {
                navigate(EPaths.ONBOARDING_OPT_IN);
              } else {
                navigate(EPaths.ONBOARDING_TAG_SELECTION);
              }
            }}
            fullWidth
          >
            Next
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default PermissionSelection; 
