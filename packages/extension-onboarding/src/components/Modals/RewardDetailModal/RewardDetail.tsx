import { useStyles } from "@extension-onboarding/components/Modals/RewardDetailModal/RewardDetail.style";
import { Permissions } from "@snickerdoodlelabs/shared-components";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, Grid, Modal, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import {
  PossibleReward,
  EarnedReward,
  EWalletDataType,
  QueryTypePermissionMap,
} from "@snickerdoodlelabs/objects";
import React, { FC, useState } from "react";
declare const window: IWindowWithSdlDataWallet;

const RewardDetail: FC = () => {
  const { modalState, closeModal } = useLayoutContext();
  const { apiGateway } = useAppContext();
  const { onPrimaryButtonClick, customProps } = modalState;
  const { reward, permissions } = (customProps || {}) as {
    reward: PossibleReward | EarnedReward;
    permissions: EWalletDataType[] | undefined;
  };
  const classes = useStyles();

  const _permissions = permissions
    ? permissions
    : (reward as PossibleReward)?.queryDependencies.map(
        (queryType) => QueryTypePermissionMap.get(queryType)!,
      );

  return (
    <>
      <Modal disablePortal open hideBackdrop className={classes.modal}>
        <Box>
          <Box
            width="100%"
            display="flex"
            alignItems="center"
            height={42}
            bgcolor="#8079B4"
          >
            <Box ml="auto" pr={2}>
              <CloseIcon
                onClick={closeModal}
                style={{ color: "#fff", cursor: "pointer" }}
              />
            </Box>
          </Box>
          <Box mt={4.5} px={22.5} display="flex">
            <Grid spacing={3} container>
              <Grid xs={5} item>
                <img
                  width="100%"
                  src={`${apiGateway.config.ipfsFetchBaseUrl}${reward.image}`}
                />
                <Box mt={2}>
                  <Typography className={classes.descriptionTitle}>
                    Description
                  </Typography>
                  <Box mt={1}>
                    <Typography className={classes.description}>
                      {reward.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid xs={7} item>
                <Typography className={classes.name}>{reward.name}</Typography>
                <Box
                  display="flex"
                  flexDirection="column"
                  mt={2}
                  px={3}
                  py={7}
                  borderRadius={12}
                  bgcolor="#FAFAFA"
                >
                  <Typography className={classes.price}>Price:</Typography>
                  <Permissions
                    permissions={_permissions}
                    rowItemProps={{ width: 64, mr: 1.5 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
export default RewardDetail;
