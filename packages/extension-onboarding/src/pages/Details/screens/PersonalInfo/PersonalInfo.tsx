import PersonalInfoCard from "@extension-onboarding/components/PersonalInfoCard";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import ProfileForm from "@extension-onboarding/components/ProfileForm/ProfileForm";
import { useStyles } from "@extension-onboarding/pages/Details/screens/PersonalInfo/Personalnfo.style";
import { Box, Button, Grid, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import React, { FC, useMemo, useState } from "react";

enum EMode {
  DISPLAY,
  EDIT,
}
const PersonalInfo: FC = () => {
  const [mode, setMode] = useState<EMode>(EMode.DISPLAY);
  const classes = useStyles();

  const component = useMemo(() => {
    switch (mode) {
      case EMode.DISPLAY:
        return (
          <>
            <Typography className={classes.title}>Personal Info</Typography>
            <Box my={4}>
              <Typography className={classes.description}>
                This information is for your data wallet. No one has access to
                this
                <br></br> or any other information in your data wallet unless
                you choose to <br></br> share it with them!
              </Typography>
            </Box>
            <Grid container>
              <Grid item sm={8}>
                <PersonalInfoCard
                  topRightContent={
                    <Button
                      className={classes.editButton}
                      onClick={() => {
                        setMode(EMode.EDIT);
                      }}
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                  }
                />
              </Grid>
            </Grid>
          </>
        );

      case EMode.EDIT:
        return (
          <Grid container>
            <Grid item sm={8}>
              <ProfileForm
                onSubmitted={() => {
                  setMode(EMode.DISPLAY);
                }}
              />
              <Box display="flex" alignItems="center">
                <Box marginLeft="auto" mr={3}>
                  <Button
                    onClick={() => {
                      setMode(EMode.DISPLAY);
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
                <PrimaryButton type="submit" form="profile-create-form">
                  Submit
                </PrimaryButton>
              </Box>
            </Grid>
          </Grid>
        );
    }
  }, [mode]);

  return <>{component}</>;
};
export default PersonalInfo;
