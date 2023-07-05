import Breadcrumb from "@extension-onboarding/components/Breadcrumb";
import { useAppContext } from "@extension-onboarding/context/App";
import { useStyles } from "@extension-onboarding/pages/Details/screens/RewardDetail/RewardDetail.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, Grid, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import {
  PossibleReward,
  EVMContractAddress,
  EarnedReward,
  EWalletDataType,
  QueryTypePermissionMap,
  IConsentCapacity,
  ISdlDataWallet,
} from "@snickerdoodlelabs/objects";
import React, { FC, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
declare const window: IWindowWithSdlDataWallet;

const RewardDetail: FC = () => {
  const { reward, consentContractAddress, permissions } = (useLocation()
    .state || {}) as {
    reward: PossibleReward | EarnedReward;
    consentContractAddress: EVMContractAddress;
    permissions: EWalletDataType[] | undefined;
  };
  const { apiGateway, optedInContracts } = useAppContext();
  const [capacityInfo, setCapacityInfo] = useState<IConsentCapacity>();
  const classes = useStyles();
  useEffect(() => {
    getCapacityInfo();
  }, []);

  const getCapacityInfo = () => {
    window.sdlDataWallet
      ?.getConsentCapacity(consentContractAddress)
      .map((capacity) => {
        setCapacityInfo(capacity);
      });
  };
  const isSubscribed = useMemo(
    () => optedInContracts.includes(consentContractAddress),
    [optedInContracts],
  );
  const _permissions = permissions
    ? permissions
    : (reward as PossibleReward).queryDependencies.map(
        (queryType) => QueryTypePermissionMap.get(queryType)!,
      );
  return (
    <>
      <Breadcrumb currentPathName={reward?.name} />
      <Box display="flex" width="100%">
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
              p={3}
              borderRadius={12}
              bgcolor="#FAFAFA"
            >
              <Typography className={classes.infoTitle}>
                To Collect This Reward
              </Typography>
              <Box mt={1.75}>
                <Typography className={classes.infoSubtitle}>
                  You are renting your:
                </Typography>
              </Box>
              <Box mt={1.5} display="flex">
                <Box marginLeft="auto">
                  <Typography className={classes.subscriptionCount}>
                    {!capacityInfo ? (
                      <Skeleton height={22.54} animation="wave" />
                    ) : (
                      <span>
                        <b>
                          {capacityInfo?.maxCapacity -
                            capacityInfo?.availableOptInCount}
                        </b>{" "}
                        Subscribed
                      </span>
                    )}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default RewardDetail;
