import Button from "@app/Content/components/Button";
import BasicModal from "@app/Content/components/Modals/BasicModal";
import { useStyles } from "@app/Content/components/Screens/PermissionSelection/PermissionSelection.style";
import { EAPP_STATE } from "@app/Content/constants";
import { Box, Typography } from "@material-ui/core";
import { JsonRpcError } from "json-rpc-engine";
import { ResultAsync } from "neverthrow";
import React, { FC } from "react";

interface IPermissionSelectionProps {
  emptyReward: () => void;
  changeAppState: (state: EAPP_STATE) => void;
  acceptInvitation: () => ResultAsync<void, JsonRpcError>;
}

const PermissionSelection: FC<IPermissionSelectionProps> = ({
  emptyReward,
  changeAppState,
  acceptInvitation,
}: IPermissionSelectionProps) => {
  const classes = useStyles();
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
              onClick={async (e) => {
                e.currentTarget.disabled = true;
                try {
                  await acceptInvitation();
                } catch (err) {
                  console.log("Error happened while accepting invitation: ", e);
                } finally {
                  e.currentTarget.disabled = false;
                }
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
