import { Airdrops } from "@shared-components/v2/components/Airdrops";
import { Card } from "@shared-components/v2/components/Card";
import { CardTitle } from "@shared-components/v2/components/CardTitle";
import { DisplayModeToggleButtons, EToggleDisplayMode } from "@shared-components/v2/components/DisplayModeToggle";
import { DirectReward, URLString } from "@snickerdoodlelabs/objects";
import React, { FC, useMemo, useState } from "react";
import { Box } from "@material-ui/core";
interface IProps {
  rewardItems: DirectReward[];
  urls?: URLString[];
  ipfsFetchBaseUrl: URLString;
  onItemClick: (item: DirectReward) => void;
}

export const AudienceDetailsAirdropsSection: FC<IProps> = ({
  rewardItems,
  urls,
  onItemClick,
  ipfsFetchBaseUrl,
}) => {
  const [displayMode, setDisplayMode] = useState<EToggleDisplayMode>(
    EToggleDisplayMode.COMPACT,
  );
  const urlString = useMemo(() => {
    if (!urls) {
      return "";
    }
    return urls.join(", ");
  }, [urls]);

  return (
    <Card>
      <Box display="flex" alignItems="space-between" justifyContent="center">
        <CardTitle
          title="Airdrops"
          subtitle={`Airdrop you received from ${
            urlString ? urlString : "this contract."
          }`}
        />
        <DisplayModeToggleButtons
          selectedDisplayMode={displayMode}
          setDisplayMode={setDisplayMode}
        />
      </Box>
      <Box mt={2} />
      <Airdrops
        compact={displayMode === EToggleDisplayMode.COMPACT}
        rewardItems={rewardItems}
        ipfsFetchBaseUrl={ipfsFetchBaseUrl}
        onItemClick={onItemClick}
      />
    </Card>
  );
};
