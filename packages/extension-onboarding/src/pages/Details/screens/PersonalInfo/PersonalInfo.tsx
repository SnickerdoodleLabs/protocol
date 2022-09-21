import PersonalInfoCard from "@extension-onboarding/components/PersonalInfoCard";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import ProfileForm from "@extension-onboarding/components/ProfileForm/ProfileForm";
import InfoCard from "@extension-onboarding/pages/Details/screens/PersonalInfo/components/InfoCard";
import UpdateForm from "@extension-onboarding/pages/Details/screens/PersonalInfo/components/UpdateForm";
import { useStyles } from "@extension-onboarding/pages/Details/screens/PersonalInfo/Personalnfo.style";
import { Box, Button, Divider, Grid, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import React, { FC, useMemo, useState } from "react";

enum EMode {
  DISPLAY,
  EDIT,
}

const PersonalInfo: FC = () => {
  const [mode, setMode] = useState<EMode>(EMode.EDIT);
  const classes = useStyles();

  const component = useMemo(() => {
    switch (mode) {
      case EMode.DISPLAY:
        return (
          <>
            <Box
              mt={4}
              bgcolor="#FCFCFC"
              p={3}
              pt={12}
              border="1px solid #ECECEC"
              borderRadius={8}
            >
              <InfoCard />
            </Box>
          </>
        );

      case EMode.EDIT:
        return <UpdateForm />;
    }
  }, [mode]);

  return (
    <>
      <Typography className={classes.title}>Web 2 Info Settings</Typography>
      <Box my={4}>
        <Typography className={classes.description}>
          Add or Remove demographic information to control what you store in
          your data wallet.
        </Typography>
      </Box>
      {component}
    </>
  );
};
export default PersonalInfo;
