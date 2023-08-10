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
import { PossibleRewardComponent } from "@snickerdoodlelabs/shared-components";
import React, { FC, useState } from "react";

import {
  DirectReward as DirectRewardComponent,
  LazyReward as LazyRewardComponent,
  Web2Reward as Web2RewardComponent,
} from "@extension-onboarding/components/RewardItems";
import { useAppContext } from "@extension-onboarding/context/App";
import { EBadgeType } from "@extension-onboarding/objects";
import Section, {
  useSectionStyles,
} from "@extension-onboarding/pages/Details/screens/RewardProgramDetails/components/Sections/Section";
import { isSameReward } from "@extension-onboarding/utils";

interface ICollectedRewardsProps {
  rewards: EarnedReward[];
  // temporary to read permissions
  possibleRewards: PossibleReward[];
  consentContractAddress: EVMContractAddress;
  rewardsThatAreBeingProcessed: PossibleReward[];
}
const CollectedRewards: FC<ICollectedRewardsProps> = ({
  rewards,
  possibleRewards,
  consentContractAddress,
  rewardsThatAreBeingProcessed,
}) => {
  const sectionClasses = useSectionStyles();
  const { apiGateway } = useAppContext();
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
          Earned Rewards
        </Typography>

        <Box mt={1}>
          <Typography className={sectionClasses.sectionDescription}>
            You've earned these rewards because you rented, required
            permissions.
          </Typography>
        </Box>
      </Box>
      <Box display="flex" flexWrap="wrap" gridColumnGap={10} gridRowGap={24}>
        {rewards.map((reward, index) => {
          return (
            <Box
              flexBasis="calc(20% - 8px)"
              key={`${JSON.stringify(reward)}--${index}`}
            >
              {getRewardComponent(
                reward,
                // temporary to read required permissions
                (possibleRewards
                  .find((item) => isSameReward(item, reward))
                  ?.estimatedQueryDependencies.map(
                    (dependency) => QueryTypePermissionMap.get(dependency)!,
                  ) ?? []) as EWalletDataType[],
              )}
            </Box>
          );
        })}
        {rewardsThatAreBeingProcessed.map((reward, index) => {
          return (
            <Box
              flexBasis="calc(20% - 8px)"
              key={`${JSON.stringify(reward)}--${index}`}
            >
              <PossibleRewardComponent
                ipfsBaseUrl={apiGateway.config.ipfsFetchBaseUrl}
                reward={reward}
                consentContractAddress={consentContractAddress}
                badgeType={EBadgeType.Waiting}
              />
            </Box>
          );
        })}
      </Box>
    </Section>
  );
};

export default CollectedRewards;
