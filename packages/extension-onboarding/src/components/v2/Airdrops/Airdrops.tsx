import CustomSizeGrid from "@extension-onboarding/components/v2/CustomSizeGrid";
import DirectRewardComponent from "@extension-onboarding/components/v2/RewardItems/DirectReward";
import { DirectReward } from "@snickerdoodlelabs/objects";
import React, { FC } from "react";

interface AirdropsProps {
  rewardItems: DirectReward[];
  compact?: boolean;
}

const Airdrops: FC<AirdropsProps> = ({ rewardItems, compact = false }) => {
  return (
    <CustomSizeGrid
      items={rewardItems.map((item) => (
        <DirectRewardComponent compact={compact} reward={item} />
      ))}
      compact={compact}
    />
  );
};

export default Airdrops;
