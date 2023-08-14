import { Badge, Box } from "@material-ui/core";
import {
  EVMContractAddress,
  EWalletDataType,
  PossibleReward,
  QueryTypePermissionMap,
  QueryTypes,
} from "@snickerdoodlelabs/objects";
import {
  isSameReward,
  PossibleRewardComponent,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, Fragment, useCallback, useState } from "react";

import rewardsCollectedImg from "@extension-onboarding/assets/images/rewards-collected.png";
import DisplayModeToggle, {
  EDISPLAY_MODE,
} from "@extension-onboarding/components/DisplayModeToggle/DisplayModeToggle";
import Typography from "@extension-onboarding/components/Typography";
import { useAppContext } from "@extension-onboarding/context/App";
import { EBadgeType } from "@extension-onboarding/objects";
import Section, {
  useSectionStyles,
} from "@extension-onboarding/pages/Details/screens/RewardProgramDetails/components/Sections/Section";

interface IProgramRewardsProps {
  rewardsThatCanBeAcquired: PossibleReward[];
  rewardsThatTheUserWasIneligible: PossibleReward[];
  rewardsThatRequireMorePermission: PossibleReward[];
  consentContractAddress: EVMContractAddress;
  currentPermissions: EWalletDataType[];
  isSubscribed: boolean;
}
const ProgramRewards: FC<IProgramRewardsProps> = ({
  rewardsThatCanBeAcquired,
  rewardsThatTheUserWasIneligible,
  rewardsThatRequireMorePermission,
  consentContractAddress,
  currentPermissions,
  isSubscribed,
}) => {
  const sectionClasses = useSectionStyles();
  const [displayMode, setDisplayMode] = useState<EDISPLAY_MODE>(
    EDISPLAY_MODE.COZY,
  );
  const { apiGateway } = useAppContext();
  const getPossibleRewardComponent = (
    reward: PossibleReward,
    badge: EBadgeType,
    index: number,
  ) => (
    <Box
      {...(displayMode === EDISPLAY_MODE.COZY && {
        flexBasis: "calc(20% - 8px)",
      })}
      {...(displayMode === EDISPLAY_MODE.COMPACT && {
        flexBasis: "calc(100%/9 - 12px*8/9)",
      })}
      {...(displayMode === EDISPLAY_MODE.LIST && {
        component: Fragment,
      })}
      key={`${JSON.stringify(reward)}-${displayMode}-${index}`}
    >
      <PossibleRewardComponent
        ipfsBaseUrl={apiGateway.config.ipfsFetchBaseUrl}
        displayType={
          displayMode === EDISPLAY_MODE.LIST
            ? "list"
            : displayMode === EDISPLAY_MODE.COMPACT
            ? "compact"
            : "default"
        }
        consentContractAddress={consentContractAddress}
        badgeType={badge}
        reward={reward}
      />
    </Box>
  );

  return (
    <Section>
      <Box mb={4} display="flex" alignItems="center">
        <Box>
          <Typography className={sectionClasses.sectionTitle}>
            {isSubscribed
              ? "Rent more data, unlock more rewards!"
              : "Rewards you can earn now"}
          </Typography>
          <Box mt={1}>
            <Typography className={sectionClasses.sectionDescription}>
              You are eligible to earn the following rewards based on your data
              permissions. Unlock more rewards by changing your data
              permissions.
            </Typography>
          </Box>
        </Box>
        <Box ml="auto">
          <DisplayModeToggle
            selectedDisplayMode={displayMode}
            setDisplayMode={setDisplayMode}
          />
        </Box>
      </Box>
      {rewardsThatCanBeAcquired.length > 0 ||
      rewardsThatTheUserWasIneligible.length > 0 ||
      rewardsThatRequireMorePermission.length > 0 ? (
        <Box
          {...(displayMode === EDISPLAY_MODE.COZY && {
            display: "flex",
            flexWrap: "wrap",
            gridColumnGap: 10,
            gridRowGap: 24,
          })}
          {...(displayMode === EDISPLAY_MODE.COMPACT && {
            display: "flex",
            flexWrap: "wrap",
            gridColumnGap: 12,
            gridRowGap: 12,
          })}
        >
          {displayMode === EDISPLAY_MODE.LIST && (
            <Box
              display="flex"
              py={3}
              borderRadius="12px 12px 0 0"
              bgcolor="#FAFAFA"
              px={2}
              borderBottom="1px solid #f0f0f0"
            >
              <Box flex={2}>
                <Typography variant="tableTitle">Reward Name</Typography>
              </Box>
              <Box flex={2}>
                <Typography variant="tableTitle">Price</Typography>
              </Box>
              <Box flex={1}>
                <Typography variant="tableTitle">Eligibility Status</Typography>
              </Box>
            </Box>
          )}
          {rewardsThatCanBeAcquired.map((reward, index) =>
            getPossibleRewardComponent(reward, EBadgeType.Available, index),
          )}
          {rewardsThatRequireMorePermission.map((reward, index) =>
            getPossibleRewardComponent(
              reward,
              EBadgeType.MorePermissionRequired,
              index,
            ),
          )}
          {rewardsThatTheUserWasIneligible.map((reward, index) =>
            getPossibleRewardComponent(
              reward,
              EBadgeType.UserWasInEligible,
              index,
            ),
          )}
        </Box>
      ) : (
        <Box display="flex" alignItems="center" flexDirection="column">
          <img width={162} src={rewardsCollectedImg} />
          <Box my={1.25} textAlign="center">
            <Typography className={sectionClasses.successTitle}>
              Congratulations!
            </Typography>
            <Typography className={sectionClasses.sectionDescription}>
              You've earned all rewards in this campaign.
              <br />
              Explore more rewards programs in the Marketplace.
            </Typography>
          </Box>
        </Box>
      )}
    </Section>
  );
};

export default ProgramRewards;
