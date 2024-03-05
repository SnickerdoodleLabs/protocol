import CardTitle from "@extension-onboarding/components/v2/CardTitle";
import Card from "@extension-onboarding/components/v2/Card";
import ToggleButtons, {
  EDISPLAY_MODE,
} from "@extension-onboarding/components/v2/DisplayModeToggle";
import Airdrops from "@extension-onboarding/components/v2/Airdrops";
import { DirectReward } from "@snickerdoodlelabs/objects";
import React, { FC, useState } from "react";
import { Box } from "@material-ui/core";

interface IProps {
  rewardItems: DirectReward[];
  urlString?: string;
}

const AirdropsSection: FC<IProps> = ({ rewardItems, urlString }) => {
  const [displayMode, setDisplayMode] = useState<EDISPLAY_MODE>(
    EDISPLAY_MODE.COMPACT,
  );

  return (
    <Card>
      <Box display="flex" alignItems="space-between" justifyContent="center">
        <CardTitle
          title="Airdrops"
          subtitle={`Airdrop you received from ${
            urlString ? urlString : "this contract."
          }`}
        />
        <ToggleButtons
          selectedDisplayMode={displayMode}
          setDisplayMode={setDisplayMode}
        />
      </Box>
      <Box mt={2} />
      <Airdrops
        compact={displayMode === EDISPLAY_MODE.COMPACT}
        rewardItems={rewardItems}
      />
    </Card>
  );
};

export default AirdropsSection;
