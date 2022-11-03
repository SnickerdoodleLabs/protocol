import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import {
  DirectReward,
  EarnedReward,
  ERewardType,
  IpfsCID,
  LazyReward,
  Web2Reward,
} from "@snickerdoodlelabs/objects";
import React, { FC, useEffect, useState } from "react";

import emptyReward from "@extension-onboarding/assets/images/empty-reward.svg";
import DirectRewardItem from "@extension-onboarding/pages/Details/screens/EarnedRewards/components/DirectReward";
import LazyRewardItem from "@extension-onboarding/pages/Details/screens/EarnedRewards/components/LazyReward";
import Web2RewardItem from "@extension-onboarding/pages/Details/screens/EarnedRewards/components/Web2Reward";
import { useStyles } from "@extension-onboarding/pages/Details/screens/EarnedRewards/EarnedRewards.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";

declare const window: IWindowWithSdlDataWallet;

const EarnedRewards: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rewards, setRewards] = useState<EarnedReward[]>([
    {
      queryCID: IpfsCID("3432"),
      type: ERewardType.Direct,
    },
    {
      queryCID: IpfsCID("3432"),
      type: ERewardType.Direct,
    },
  ]);

  useEffect(() => {
    getRewards();
  }, []);

  useEffect(() => {
    if (rewards) {
      setIsLoading(false);
    }
  }, [JSON.stringify(rewards)]);

  const getRewards = () => {
    window.sdlDataWallet.getEarnedRewards().map((rewards) => {
      // setRewards(rewards);
    });
  };

  const classes = useStyles();

  return (
    <Box>
      <Box mb={4}>
        <Typography className={classes.title}>Owned Rewards</Typography>
        <Typography className={classes.description}>
          See what you've earned from sharing insights!
        </Typography>
      </Box>
      {isLoading ? (
        <Box display="flex" alignItems="center" justifyContent="center" mt={15}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {rewards?.length ? (
            rewards?.map((reward, index) => {
              let rewardComponent;
              if (reward.type === ERewardType.Direct) {
                rewardComponent = (
                  <DirectRewardItem
                    key={index}
                    reward={reward as DirectReward}
                  />
                );
              }
              if (reward.type === ERewardType.Lazy) {
                rewardComponent = (
                  <LazyRewardItem key={index} reward={reward as LazyReward} />
                );
              }
              if (reward.type === ERewardType.Web2) {
                rewardComponent = (
                  <Web2RewardItem key={index} reward={reward as Web2Reward} />
                );
              }
              return rewardComponent;
            })
          ) : (
            <Box width="100%" display="flex">
              <Box
                justifyContent="center"
                alignItems="center"
                width="100%"
                display="flex"
                pt={20}
              >
                <img style={{ width: 330, height: "auto" }} src={emptyReward} />
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
export default EarnedRewards;
