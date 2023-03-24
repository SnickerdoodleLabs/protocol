import Button from "@extension-onboarding/components/Button";
import { useStyles } from "@extension-onboarding/components/Modals/SubscriptionSuccessModal/SubscriptionSuccessModalstyle";

import { PERMISSION_TEXT_NAMES } from "@extension-onboarding/constants/permissions";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, Dialog, Typography, IconButton, Grid } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { EWalletDataType, PossibleReward } from "@snickerdoodlelabs/objects";
import React, { useEffect, FC, useState } from "react";

declare const window: IWindowWithSdlDataWallet;

const SubscriptionSuccessModal: FC = () => {
  const { apiGateway } = useAppContext();
  const { modalState, closeModal } = useLayoutContext();
  const {
    onPrimaryButtonClick,
    customProps: {
      campaignImage,
      eligibleRewards,
      dataTypes,
      campaignName,
    } = {},
  } = modalState;

  const getPermissionsText = () => {
    let arr: string[];
    if (dataTypes) {
      arr = (dataTypes as EWalletDataType[]).reduce((acc, dataType) => {
        const name = PERMISSION_TEXT_NAMES[dataType] as string;
        if (name) {
          acc = [...acc, name];
        }
        return acc;
      }, [] as string[]);
    } else {
      arr = Object.values(PERMISSION_TEXT_NAMES);
    }

    return arr.length > 1 ? (
      <>
        <strong>{arr.slice(0, -1).join(", ")}</strong> and{" "}
        <strong>{arr.slice(-1)[0]}</strong>
      </>
    ) : (
      <strong>{arr[0]}</strong>
    );
  };

  const classes = useStyles();
  return (
    <Dialog
      PaperProps={{
        square: true,
      }}
      open={true}
      disablePortal
      maxWidth="sm"
      fullWidth
      className={classes.container}
    >
      <Box
        display="flex"
        mb={4}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography className={classes.title}>Congratulations!</Typography>
        <IconButton
          disableFocusRipple
          disableRipple
          disableTouchRipple
          aria-label="close"
          onClick={() => {
            closeModal();
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <>
        <Box alignItems="center" display="flex">
          <Box mr={4}>
            <img
              style={{
                width: 188,
                height: 188,
                objectFit: "cover",
                borderRadius: "50%",
              }}
              src={campaignImage}
            />
          </Box>
          <Typography>
            You have successfully shared your {getPermissionsText()} in order to
            subscribe to the {campaignName} rewards program and earn the
            following rewards:
          </Typography>
        </Box>
        <Box my={3} display="flex" width="100%" borderTop="1px solid #F2F2F8" />
        <Grid spacing={2} container>
          {(eligibleRewards as PossibleReward[]).map((eligibleReward) => (
            <Grid item xs={6}>
              <Box
                display="flex"
                alignItems="center"
                key={eligibleReward.queryCID}
              >
                <Box mr={1.5}>
                  <img
                    style={{
                      width: 72,
                      height: 72,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                    src={`${apiGateway.config.ipfsFetchBaseUrl}${eligibleReward.image}`}
                  />
                </Box>
                <Box>
                  <Box mb={1}>
                    <Typography className={classes.rewardTitle}>
                      {eligibleReward.name}
                    </Typography>
                  </Box>
                  <Typography className={classes.rewardDescription}>
                    {eligibleReward.description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box mt={4} display="flex">
          <Box marginLeft="auto">
            <Button
              buttonType="primary"
              onClick={() => {
                closeModal();
              }}
            >
              Ok
            </Button>
          </Box>
        </Box>
      </>
    </Dialog>
  );
};

export default SubscriptionSuccessModal;
