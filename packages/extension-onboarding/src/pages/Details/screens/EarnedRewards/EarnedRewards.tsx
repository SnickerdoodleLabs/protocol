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
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import DirectRewardItem from "@extension-onboarding/pages/Details/screens/EarnedRewards/components/DirectReward";
import LazyRewardItem from "@extension-onboarding/pages/Details/screens/EarnedRewards/components/LazyReward";
import Web2RewardItem from "@extension-onboarding/pages/Details/screens/EarnedRewards/components/Web2Reward";
import { useStyles } from "@extension-onboarding/pages/Details/screens/EarnedRewards/EarnedRewards.style";

const EarnedRewards: FC = () => {
  const { sdlDataWallet } = useDataWalletContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rewards, setRewards] = useState<EarnedReward[]>();

  useEffect(() => {
    getRewards();
  }, []);

  useEffect(() => {
    if (rewards) {
      setIsLoading(false);
    }
  }, [JSON.stringify(rewards)]);

  const getRewards = () => {
    sdlDataWallet.getEarnedRewards().map((rewards) => {
      setRewards(rewards);
    });
  };

  const classes = useStyles();

  return (
    <Box>
      <Box mb={5}>
        <Typography className={classes.title}>My Rewards</Typography>
      </Box>
      <Box mb={2}>
        <Typography className={classes.subTitle}>Earned Rewards</Typography>
      </Box>
      <Box mb={2}>
        <Typography className={classes.description}>
          Your NFTs, from linked accounts and newly earned rewards.
        </Typography>
      </Box>
      {isLoading ? (
        <Box display="flex" alignItems="center" justifyContent="center" mt={15}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {rewards?.length ? (
              Array.from(
                rewards?.reduce((acc, reward) => {
                  const selector =
                    reward.name + reward.image + reward.description;
                  if (acc.has(selector)) {
                    const prev = acc.get(selector);
                    prev!.count++;
                    acc.set(selector, prev!);
                  } else {
                    acc.set(selector, { reward, count: 1 });
                  }

                  return acc;
                }, new Map<string, { reward: EarnedReward; count: number }>()),
              ).map(([selector, rewardToCount], index) => {
                const reward = rewardToCount.reward;
                const count = rewardToCount.count;

                let rewardComponent;
                if (reward.type === ERewardType.Direct) {
                  rewardComponent = (
                    <Grid item xs={3}>
                      <DirectRewardItem
                        count={count}
                        key={index}
                        reward={reward as DirectReward}
                      />
                    </Grid>
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
                  pt={5}
                >
                  <img
                    style={{ width: 300, height: "auto" }}
                    src={emptyReward}
                  />
                </Box>
              </Box>
            )}
          </Grid>
        </>
      )}
    </Box>
  );
};
export default EarnedRewards;
