import { Box, Grid, Typography } from "@material-ui/core";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
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

declare const window: IWindowWithSdlDataWallet;
interface IWaitingRewardsProps {
  rewards: PossibleReward[];
  type: EPossibleRewardDisplayType;
  consentContractAddress: EVMContractAddress;
}
const WaitingRewards: FC<IWaitingRewardsProps> = ({
  rewards,
  type,
  consentContractAddress,
}) => {
  const sectionClasses = useSectionStyles();
  const [defaultPermissions, setDefaultPermissions] = useState<
    EWalletDataType[]
  >([]);

  useEffect(() => {
    if (type === EPossibleRewardDisplayType.ProgramRewards) {
      getDefaultPermissions();
    }
  }, [type]);

  const getDefaultPermissions = () => {
    window.sdlDataWallet.getDefaultPermissions().map((dataTypes) => {
      setDefaultPermissions(dataTypes);
    });
  };

  const getBadge = useCallback(
    (estimatedQueryDependencies: QueryTypes[]) =>
      estimatedQueryDependencies
        .map((dependency) => QueryTypePermissionMap.get(dependency)!)
        .every((dataType) => defaultPermissions.includes(dataType))
        ? EBadgeType.Available
        : EBadgeType.MorePermissionRequired,
    [defaultPermissions],
  );

  const { badge, title, subtitle } = useMemo(() => {
    switch (true) {
      case type === EPossibleRewardDisplayType.MorePermissionRequiered:
        return {
          badge: EBadgeType.MorePermissionRequired,
          title: "Rent More Data, Get More Rewards",
          subtitle:
            "Share the data specified below, and you will be eligible to claim these additional rewards!",
        };
      case type === EPossibleRewardDisplayType.Waiting:
        return {
          badge: EBadgeType.Waiting,
          title: "Waiting Rewards",
          subtitle: "",
        };
      // Program Rewards
      default:
        return {
          badge: EBadgeType.Available,
          title: "Collect These Rewards Now",
          subtitle: "",
        };
    }
  }, [type]);

  return (
    <Section>
      <Box mb={4}>
        <Typography className={sectionClasses.sectionTitle}>{title}</Typography>
        {subtitle && (
          <Box mt={1}>
            <Typography className={sectionClasses.sectionDescription}>
              {subtitle}
            </Typography>
          </Box>
        )}
      </Box>
      <Grid spacing={2} container>
        {rewards.map((reward) => {
          return (
            <Grid xs={2} item key={reward.queryCID}>
              <PossibleRewardComponent
                consentContractAddress={consentContractAddress}
                badgeType={
                  type === EPossibleRewardDisplayType.ProgramRewards
                    ? getBadge(reward.estimatedQueryDependencies)
                    : badge
                }
                reward={reward}
              />
            </Grid>
          );
        })}
      </Grid>
    </Section>
  );
};

export default WaitingRewards;
