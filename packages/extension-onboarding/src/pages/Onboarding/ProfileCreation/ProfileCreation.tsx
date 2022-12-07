import snickerDoodleLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import artboardImage from "@extension-onboarding/assets/images/artboard.png";
import sdlCircle from "@extension-onboarding/assets/images/sdl-circle.svg";
import Button from "@extension-onboarding/components/Button";
import ProfileForm from "@extension-onboarding/components/ProfileForm/ProfileForm";
import { useAppContext } from "@extension-onboarding/context/App";
import { useStyles } from "@extension-onboarding/pages/Onboarding/ProfileCreation/ProfileCreation.style";
import { Box, Typography, Grid } from "@material-ui/core";
import React, { FC } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ProfileCreation: FC = () => {
  const navigate = useNavigate();
  const { campaignName, campaignImg } = useLocation().state || {};
  const { invitationInfo } = useAppContext();
  const classes = useStyles();
  return (
    <>
      <img src={snickerDoodleLogo} />
      <Box mt={4}>
        <Grid container alignItems={campaignImg ? "flex-end" : "flex-start"}>
          <Grid item sm={8}>
            <Box pr={8}>
              <Typography className={classes.title}>
                More Information = More Rewards!
              </Typography>
              <Box mb={5} mt={4}>
                <Typography className={classes.description}>
                  No one can access this personal information until you use
                  Snickerdoodle to anonymize it and rent it out to brands of
                  your choice.
                  <br />
                  <br />
                  Add more information to maximize reward opportunities while
                  keeping your data securely in one place.
                </Typography>
                <ProfileForm
                  onSubmitted={() => {
                    sessionStorage.removeItem("appMode");
                    window.location.reload();
                  }}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item sm={4}>
            {campaignImg ? (
              <Box
                mb={12}
                width="100%"
                alignItems="center"
                display="flex"
                flexDirection="column"
              >
                {invitationInfo.brandIcon && (
                  <Box mb={4}>
                    <img
                      width={120}
                      height={120}
                      src={invitationInfo.brandIcon}
                    />
                    <img
                      width={120}
                      style={{ marginLeft: -15 }}
                      height={120}
                      src={sdlCircle}
                    />
                  </Box>
                )}
                <img width="60%" src={campaignImg} />
                {campaignName && (
                  <Typography className={classes.itemName}>
                    {campaignName}
                  </Typography>
                )}
              </Box>
            ) : (
              <Box mb={8}>
                <img src={artboardImage} style={{ width: "100%" }} />
              </Box>
            )}
            <Box mb={1.5}>
              <Typography className={classes.infoText}>
                Last Step On The Way to Your Data Safe...
              </Typography>
            </Box>
            <Button fullWidth type="submit" form="profile-create-form">
              Go to Data Safe
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default ProfileCreation;
