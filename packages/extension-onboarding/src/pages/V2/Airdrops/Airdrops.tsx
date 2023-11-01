import AccountChainBar, {
  EDisplayMode,
} from "@extension-onboarding/components/AccountChainBar";
import AirdropsComponent from "@extension-onboarding/components/v2/Airdrops";
import Card from "@extension-onboarding/components/v2/Card";
import CardTitle from "@extension-onboarding/components/v2/CardTitle";
import EmptyItem from "@extension-onboarding/components/v2/EmptyItem";
import { useAppContext } from "@extension-onboarding/context/App";
import { Box } from "@material-ui/core";
import {
  AccountAddress,
  ChainId,
  DirectReward,
  ERewardType,
} from "@snickerdoodlelabs/objects";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { FC, useEffect, useMemo, useState } from "react";

interface IProps {}

const Airdrops: FC<IProps> = () => {
  const { earnedRewards } = useAppContext();

  const rewardsToRender = useMemo(() => {
    if (!earnedRewards) return undefined;
    if (earnedRewards.length === 0) return [] as DirectReward[];
    const directRewards = earnedRewards.filter(
      (item) => item.type === ERewardType.Direct,
    ) as DirectReward[];

    return directRewards;
  }, [earnedRewards]);

  if (!rewardsToRender) return null;
  return (
    <>
      <Card>
        {rewardsToRender.length ? (
          <>
            <CardTitle
              title="Airdrops"
              subtitle="See the airdrops you received from our partners."
            />
            <Box mt={3} />
            <AirdropsComponent rewardItems={rewardsToRender} />
          </>
        ) : (
          <EmptyItem />
        )}
      </Card>
    </>
  );
};

export default Airdrops;
