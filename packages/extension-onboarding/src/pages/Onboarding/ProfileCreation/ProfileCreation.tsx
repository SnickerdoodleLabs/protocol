import snickerDoodleLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import artboardImage from "@extension-onboarding/assets/images/artboard.svg";
import { Button } from "@snickerdoodlelabs/shared-components";
import ProfileForm from "@extension-onboarding/components/ProfileForm/ProfileForm";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { useStyles } from "@extension-onboarding/pages/Onboarding/ProfileCreation/ProfileCreation.style";
import { Box, Typography, Grid, CircularProgress } from "@material-ui/core";
import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfileCreation: FC = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <img src={snickerDoodleLogo} />
      <Box mt={4}>
        <Grid container alignItems="flex-start">
          <Grid item sm={8}>
            <Box pr={8}>
              <Typography className={classes.title}>
                More Information = More Rewards!
              </Typography>
              <Box mb={5} mt={4}>
                <Typography className={classes.description}>
                  No one can access this personal information, not even
                  Snickerdoodle.<br></br>
                  YOU use Snickerdoodle to anonymize your data and rent it out
                  to<br></br>
                  brands of your choice, directly.
                  <br />
                  <br />
                  Add more information to maximize reward opportunities while
                  keeping<br></br>
                  your data securely in one place.
                </Typography>
                <ProfileForm
                  onSubmitted={() => {
                    setIsLoading(false);
                    navigate(EPaths.ONBOARDING_TAG_SELECTION);
                    
                  }}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item sm={4}>
            <Box mb={3}>
              <img src={artboardImage} style={{ width: "100%" }} />
            </Box>
            <Button
              disabled={isLoading}
              fullWidth
              onClickCapture={(e) => {
                document?.forms["profile-create-form"]?.requestSubmit?.();
                setIsLoading(true);
              }}
            >
              Next
              {isLoading && (
                <span>
                  <Box ml={2}>
                    <CircularProgress size={16} />
                  </Box>
                </span>
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default ProfileCreation;
