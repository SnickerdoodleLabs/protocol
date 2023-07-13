import { Box } from "@material-ui/core";
import React, { FC, useMemo, useState } from "react";

import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import Typography from "@extension-onboarding/components/Typography";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import InfoCard from "@extension-onboarding/pages/Details/screens/PersonalInfo/components/InfoCard";
import UpdateForm from "@extension-onboarding/pages/Details/screens/PersonalInfo/components/UpdateForm";
import { useStyles } from "@extension-onboarding/pages/Details/screens/PersonalInfo/Personalnfo.style";

enum EMode {
  DISPLAY,
  EDIT,
}

const PersonalInfo: FC = () => {
  const [mode, setMode] = useState<EMode>(EMode.DISPLAY);
  const classes = useStyles();
  const { setAlert } = useNotificationContext();

  const component = useMemo(() => {
    switch (mode) {
      case EMode.DISPLAY:
        return (
          <InfoCard
            onEditClick={() => {
              setMode(EMode.EDIT);
            }}
          />
        );
      case EMode.EDIT:
        return (
          <UpdateForm
            onCancelClicked={() => {
              setMode(EMode.DISPLAY);
            }}
            onSubmitted={() => {
              setMode(EMode.DISPLAY);
              setAlert({
                severity: EAlertSeverity.SUCCESS,
                message: "Your change has been successfully saved!",
              });
            }}
          />
        );
    }
  }, [mode]);

  return (
    <>
      <Typography variant="pageTitle">Personal Info Settings</Typography>
      <Box mt={1} mb={6.5}>
        <Typography variant="pageDescription">
          Add or Remove demographic information to control what you stored in
          your data wallet. Any insights you choose to share on your data is
          anonymous.
        </Typography>
      </Box>
      {component}
    </>
  );
};
export default PersonalInfo;
