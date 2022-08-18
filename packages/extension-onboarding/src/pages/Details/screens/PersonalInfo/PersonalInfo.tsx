import PersonalInfoCard from "@extension-onboarding/components/PersonalInfoCard";
import ProfileForm from "@extension-onboarding/components/ProfileForm/ProfileForm";
import { Box, Button, IconButton, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import React, { FC, useMemo, useState } from "react";
enum EMode {
  DISPLAY,
  EDIT,
}

const PersonalInfo: FC = () => {
  const [mode, setMode] = useState<EMode>(EMode.DISPLAY);

  const component = useMemo(() => {
    switch (mode) {
      case EMode.DISPLAY:
        return (
          <>
            <Box>
              <Box display="flex">
                <Box>
                  <Box>
                    <Typography
                      style={{
                        fontFamily: "Shrikhand",
                        fontSize: 36,
                        fontWeight: 400,
                        color: "#232039",
                      }}
                    >
                      Personal Info
                    </Typography>
                  </Box>
                  <Box my={4}>
                    <Typography
                      style={{
                        fontFamily: "Space Grotesk",
                        fontWeight: 400,
                        fontSize: 18,
                        lineHeight: "23px",
                      }}
                    >
                      This information is for your data wallet. No one has
                      access to this
                      <br></br> or any other information in your data wallet
                      unless you choose to <br></br> share it with them!
                    </Typography>
                  </Box>
                  <PersonalInfoCard
                    topRightContent={
                      <Button
                        style={{
                          fontFamily: "Space Grotesk",
                          fontSize: 16,
                          fontWeight: 500,
                          color: "#8079B4",
                        }}
                        onClick={() => {
                          setMode(EMode.EDIT);
                        }}
                        startIcon={<EditIcon />}
                      >
                        Edit
                      </Button>
                    }
                  />
                </Box>
              </Box>
            </Box>
          </>
        );

      case EMode.EDIT:
        return (
          <>
            <ProfileForm
              onSubmitted={() => {
                setMode(EMode.DISPLAY);
              }}
            />
            <Button
              onClick={() => {
                setMode(EMode.DISPLAY);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" form="profile-create-form">
              Submit
            </Button>
          </>
        );
    }
  }, [mode]);

  return <>{component}</>;
};
export default PersonalInfo;
