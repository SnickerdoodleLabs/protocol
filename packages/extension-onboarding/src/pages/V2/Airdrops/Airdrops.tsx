import { EModalSelectors } from "@extension-onboarding/components/Modals";
import EmptyItem from "@extension-onboarding/components/v2/EmptyItem";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { Box } from "@material-ui/core";
import { DirectReward, ERewardType } from "@snickerdoodlelabs/objects";
import {Airdrops as AirdropsComponent, Card, CardTitle } from "@snickerdoodlelabs/shared-components";
import React, { FC, useMemo } from "react";

interface IProps {}

const Airdrops: FC<IProps> = () => {
  const { earnedRewards, apiGateway } = useAppContext();
  const { setModal } = useLayoutContext();

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
            <AirdropsComponent
              rewardItems={rewardsToRender}
              ipfsFetchBaseUrl={apiGateway.config.ipfsFetchBaseUrl}
              onItemClick={(item: DirectReward) => {
                setModal({
                  modalSelector: EModalSelectors.AIRDROP_DETAIL_MODAL,
                  onPrimaryButtonClick: () => {},
                  customProps: {
                    item,
                  },
                });
              }}
            />
          </>
        ) : (
          <EmptyItem />
        )}
      </Card>
    </>
  );
};

export default Airdrops;
