import Button from "@synamint-extension-sdk/content/components/Button";
import BasicModal from "@synamint-extension-sdk/content/components/Modals/BasicModal";
import { useStyles } from "@synamint-extension-sdk/content/components/Screens/PermissionSelection/PermissionSelection.style";
import { EAPP_STATE } from "@synamint-extension-sdk/content/constants";
import { Box, Typography } from "@material-ui/core";
import React, { FC, useState } from "react";
import { CircularProgress } from "@material-ui/core";

interface IPermissionSelectionProps {
  emptyReward: () => void;
  changeAppState: (state: EAPP_STATE) => void;
  acceptInvitation: () => void;
}

const PermissionSelection: FC<IPermissionSelectionProps> = ({
  emptyReward,
  changeAppState,
  acceptInvitation,
}: IPermissionSelectionProps) => {
  const classes = useStyles();
  const [isClicked, setIsClicked] = useState(false);
  return (
    <BasicModal
      title="Your Data Permissions "
      onCloseButtonClick={emptyReward}
      content={
        <>
          <Typography className={classes.contentSubtitle}>
            By clicking “Accept All” you are giving permission for the use of
            your demographic info and wallet activity.
          </Typography>
          <Box mt={4} display="flex">
            <Box marginLeft="auto" mr={2}>
              <Button buttonType="secondary" onClick={emptyReward}>
                Cancel
              </Button>
            </Box>
            <Box mr={2}>
              <Button
                buttonType="secondary"
                onClick={() => {
                  changeAppState(EAPP_STATE.MANAGE_PERMISSIONS);
                }}
              >
                Manage Settings
              </Button>
            </Box>
            <Button
              buttonType="primary"
              {...(isClicked && {
                startIcon: <CircularProgress size={15} />,
                disabled: true,
              })}
              onClick={() => {
                setIsClicked(true);
                acceptInvitation();
              }}
            >
              Accept All
            </Button>
          </Box>
        </>
      }
    />
  );
};

export default PermissionSelection;
