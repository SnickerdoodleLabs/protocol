import artboardImage from "@extension-onboarding/assets/images/artboard.png";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import ProfileForm from "@extension-onboarding/components/ProfileForm/ProfileForm";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { useStyles } from "@extension-onboarding/pages/Onboarding/ProfileCreation/ProfileCreation.style";
import { Button, Box, Typography, Grid } from "@material-ui/core";
import React, { FC } from "react";
import { useNavigate } from "react-router-dom";

const ProfileCreation: FC = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  return (
    <Box mt={15}>
      <Grid container>
        <Grid item sm={7}>
          <Typography className={classes.title}>Build your Profile</Typography>
          <Box mb={5} mt={4}>
            <Typography className={classes.description}>
              This information is for your data wallet. No one has access to
              this
              <br></br> or any other information in your data wallet unless you
              choose to <br></br> share it with them!
            </Typography>
            <ProfileForm
              onSubmitted={() => {
                navigate(EPaths.ONBOARDING_VIEW_DATA);
              }}
            />
          </Box>
        </Grid>
        <Grid item sm={5}>
          <img src={artboardImage} style={{ width: "100%" }} />
        </Grid>
      </Grid>
      <Box className={classes.buttonContainer}>
        <Button
          onClick={() => {
            navigate(EPaths.ONBOARDING_LINK_ACCOUNT);
          }}
        >
          Back
        </Button>
        <Box>
          <PrimaryButton type="submit" form="profile-create-form">
            Next
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};
export default ProfileCreation;
