import {
  DirectReward as DirectRewardComponent,
  LazyReward as LazyRewardComponent,
  Web2Reward as Web2RewardComponent,
} from "@extension-onboarding/components/RewardItems";
import Section, {
  useSectionStyles,
} from "@extension-onboarding/pages/Details/screens/RewardProgramDetails/components/Sections/Section";
import { Box, Grid, Typography } from "@material-ui/core";
import {
  DirectReward,
  EarnedReward,
  ERewardType,
  EVMContractAddress,
  EWalletDataType,
  LazyReward,
  PossibleReward,
  QueryTypePermissionMap,
  Web2Reward,
} from "@snickerdoodlelabs/objects";
import React, { FC, useState } from "react";

interface ICollectedRewardsProps {
  rewards: EarnedReward[];
  // temporary to read permissions
  possibleRewards: PossibleReward[];
  consentContractAddress: EVMContractAddress;
}
const CollectedRewards: FC<ICollectedRewardsProps> = ({
  rewards,
  possibleRewards,
  consentContractAddress,
}) => {
  const sectionClasses = useSectionStyles();
  const getRewardComponent = (
    reward: EarnedReward,
    permissions: EWalletDataType[],
  ) => {
    switch (true) {
      case reward.type === ERewardType.Web2:
        return (
          <Web2RewardComponent
            consentContractAddress={consentContractAddress}
            reward={reward as Web2Reward}
            permissions={permissions}
          />
        );
      case reward.type === ERewardType.Lazy:
        return (
          <LazyRewardComponent
            consentContractAddress={consentContractAddress}
            reward={reward as LazyReward}
            permissions={permissions}
          />
        );
      default:
        return (
          <DirectRewardComponent
            consentContractAddress={consentContractAddress}
            reward={reward as DirectReward}
            permissions={permissions}
          />
        );
    }
  };

  return (
    <Section>
      <Box mb={4}>
        <Typography className={sectionClasses.sectionTitle}>
          Collected Rewards
        </Typography>

        <Box mt={1}>
          <Typography className={sectionClasses.sectionDescription}>
            You were eligible to claim these rewards because you are sharing
            required permissions.
          </Typography>
        </Box>
      </Box>
      <Grid spacing={2} container>
        {rewards.map((reward) => {
          return (
            <Grid xs={2} item key={reward.queryCID}>
              {getRewardComponent(
                reward,
                // temporary to read required permissions
                (possibleRewards
                  .find((item) => item.queryCID === reward.queryCID)
                  ?.queryDependencies.map(
                    (dependency) => QueryTypePermissionMap.get(dependency)!,
                  ) ?? []) as EWalletDataType[],
              )}
            </Grid>
          );
        })}
      </Grid>
    </Section>
  );
};

export default CollectedRewards;
