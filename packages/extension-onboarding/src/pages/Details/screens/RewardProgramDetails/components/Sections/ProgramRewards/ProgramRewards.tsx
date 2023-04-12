import { Box } from "@material-ui/core";
import React, {
  FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Section, {
  useSectionStyles,
} from "@extension-onboarding/pages/Details/screens/RewardProgramDetails/components/Sections/Section";
import {
  EVMContractAddress,
  EWalletDataType,
  PossibleReward,
  QueryTypePermissionMap,
  QueryTypes,
} from "@snickerdoodlelabs/objects";
import { PossibleReward as PossibleRewardComponent } from "@extension-onboarding/components/RewardItems";
import { EBadgeType } from "@extension-onboarding/objects";
import { EPossibleRewardDisplayType } from "@extension-onboarding/objects/enums/EPossibleRewardDisplayType";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import DisplayModeToggle, {
  EDISPLAY_MODE,
} from "@extension-onboarding/components/DisplayModeToggle/DisplayModeToggle";
import Typography from "@extension-onboarding/components/Typography";

declare const window: IWindowWithSdlDataWallet;
interface IProgramRewardsProps {
  rewards: PossibleReward[];
  consentContractAddress: EVMContractAddress;
  currentPermissions: EWalletDataType[];
}
const ProgramRewards: FC<IProgramRewardsProps> = ({
  rewards,
  consentContractAddress,
  currentPermissions,
}) => {
  const sectionClasses = useSectionStyles();
  const [displayMode, setDisplayMode] = useState<EDISPLAY_MODE>(
    EDISPLAY_MODE.COZY,
  );

  const getBadge = useCallback(
    (queryDependencies: QueryTypes[]) =>
      queryDependencies
        .map((dependency) => QueryTypePermissionMap.get(dependency)!)
        .every((dataType) => currentPermissions.includes(dataType))
        ? EBadgeType.Available
        : EBadgeType.MorePermissionRequired,
    [currentPermissions],
  );

  return (
    <Section>
      <Box mb={4} display="flex" alignItems="center">
        <Box>
          <Typography className={sectionClasses.sectionTitle}>
            Rewards you can earn now
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
        {rewards.map((reward) => {
          return (
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
              key={`${reward.queryCID}-${displayMode}`}
            >
              <PossibleRewardComponent
                displayType={
                  displayMode === EDISPLAY_MODE.LIST
                    ? "list"
                    : displayMode === EDISPLAY_MODE.COMPACT
                    ? "compact"
                    : "default"
                }
                consentContractAddress={consentContractAddress}
                badgeType={getBadge(reward.queryDependencies)}
                reward={reward}
              />
            </Box>
          );
        })}
      </Box>
    </Section>
  );
};

export default ProgramRewards;
