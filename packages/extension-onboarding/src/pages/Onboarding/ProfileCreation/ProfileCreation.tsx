import snickerDoodleLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import ProfileForm from "@extension-onboarding/pages/Onboarding/ProfileCreation/ProfileForm";
import { Box } from "@material-ui/core";
import React, { FC } from "react";

const ProfileCreation: FC = () => {
  return (
    <>
      <img src={snickerDoodleLogo} />
      <Box mt={4}>
        <ProfileForm />
      </Box>
    </>
  );
};
export default ProfileCreation;
