import { DirectRewardComponent } from "@shared-components/v2/components/RewardItems";
import { CustomSizeGrid } from "@shared-components/v2/components/CustomSizeGrid";
import { DirectReward, URLString } from "@snickerdoodlelabs/objects";

import React, { FC } from "react";

interface AirdropsProps {
  rewardItems: DirectReward[];
  compact?: boolean;
  ipfsFetchBaseUrl: URLString;
  onItemClick: (item: DirectReward) => void;
}

export const Airdrops: FC<AirdropsProps> = ({
  rewardItems,
  compact = false,
  ipfsFetchBaseUrl,
  onItemClick,
}) => {
  return (
    <CustomSizeGrid
      items={rewardItems.map((item) => (
        <DirectRewardComponent
          compact={compact}
          reward={item}
          ipfsFetchBaseUrl={ipfsFetchBaseUrl}
          onClick={() => {
            onItemClick(item);
          }}
        />
      ))}
      compact={compact}
    />
  );
};
