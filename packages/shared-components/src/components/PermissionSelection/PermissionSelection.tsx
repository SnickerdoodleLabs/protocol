import { Grid, Box, Typography, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import {
  CountryCode,
  EarnedReward,
  EQueryProcessingStatus,
  ESocialType,
  EVMContractAddress,
  EWalletDataType,
  Gender,
  IOpenSeaMetadata,
  PossibleReward,
  QueryStatus,
  QueryTypePermissionMap,
  QueryTypes,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@shared-components/components/Button";
import { PermissionBar } from "@shared-components/components/PermissionBar";
import { useStyles } from "@shared-components/components/PermissionSelection/PermissionSelection.style";
import { PossibleRewardComponent } from "@shared-components/components/PossibleReward";
import { UI_SUPPORTED_PERMISSIONS } from "@shared-components/constants";
import { EBadgeType } from "@shared-components/objects";
import {
  getRewardsAfterRewardsWereDeliveredFromIP,
  getRewardsBeforeRewardsWereDeliveredFromIP,
} from "@shared-components/utils";

interface IPermissionSelectionProps {
  setBirthday(birthday: UnixTimestamp): ResultAsync<void, unknown>;
  setLocation(location: CountryCode): ResultAsync<void, unknown>;
  setGender(gender: Gender): ResultAsync<void, unknown>;
  isSafe: (dataType: EWalletDataType) => boolean;
  generateAllPermissions: () => ResultAsync<EWalletDataType[], unknown>;
  campaignInfo: IOpenSeaMetadata;
  possibleRewards: PossibleReward[];
  earnedRewards: EarnedReward[];
  consentContractAddress: EVMContractAddress;
  onCancelClick(): void;
  onAcceptClick(
    rewardsThatCanBeAcquired: PossibleReward[],
    rewardsThatRequireMorePermission: PossibleReward[],
    dataTypes: EWalletDataType[],
  ): void;
  ipfsBaseUrl: string;
  isUnlocked: boolean;
  onPermissionClickWhenLocked(): void;
  onSocialConnect(socialType: ESocialType): void;
}

export const PermissionSelection: FC<IPermissionSelectionProps> = ({
  isSafe,
  generateAllPermissions,
  possibleRewards,
  earnedRewards,
  consentContractAddress,
  setBirthday,
  setLocation,
  setGender,
  onCancelClick,
  onAcceptClick,
  ipfsBaseUrl,
  isUnlocked,
  onPermissionClickWhenLocked,
  onSocialConnect,
}) => {
  const [permissions, setPermissions] = useState<EWalletDataType[]>([]);
  const classes = useStyles();
  const handlePermissionSelect = (permission: EWalletDataType) => {
    permissions.includes(permission)
      ? setPermissions((permissions) =>
          permissions.filter((_permission) => _permission != permission),
        )
      : setPermissions((permissions) => [...permissions, permission]);
  };

  const {
    rewardsThatCanBeAcquired,
    rewardsThatTheUserWasIneligible,
    rewardsThatRequireMorePermission,
  } = useMemo(() => {
    let rewardsThatCanBeAcquired: PossibleReward[] = [];
    let rewardsThatTheUserWasIneligible: PossibleReward[] = [];
    let rewardsThatRequireMorePermission: PossibleReward[] = [];

    const { queryBeingProcessed, queryProcessed, queryNotJoined } =
      possibleRewards.reduce<{
        queryBeingProcessed: PossibleReward[];
        queryProcessed: PossibleReward[];
        queryNotJoined: PossibleReward[];
      }>(
        (queryStates, reward) => {
          if (reward.queryStatus) {
            if (reward.queryStatus < 4) {
              queryStates.queryBeingProcessed.push(reward);
            } else {
              queryStates.queryProcessed.push(reward);
            }
          } else {
            queryStates.queryNotJoined.push(reward);
          }
          return queryStates;
        },
        { queryBeingProcessed: [], queryProcessed: [], queryNotJoined: [] },
      );

    const { rewardsThatWereNotEarned, rewardsThatTheUserWereUnableToGet } =
      getRewardsAfterRewardsWereDeliveredFromIP(
        queryProcessed,
        earnedRewards,
        permissions,
      );
    rewardsThatRequireMorePermission = rewardsThatRequireMorePermission.concat(
      rewardsThatWereNotEarned,
    );
    rewardsThatTheUserWasIneligible = rewardsThatTheUserWereUnableToGet;

    const { rewardsThatCannotBeEarned: rewardsThatCannotBeEarnedInProcess } =
      getRewardsBeforeRewardsWereDeliveredFromIP(
        queryBeingProcessed,
        permissions,
      );
    rewardsThatRequireMorePermission = rewardsThatRequireMorePermission.concat(
      rewardsThatCannotBeEarnedInProcess,
    );

    const { rewardsThatCanBeEarned, rewardsThatCannotBeEarned } =
      getRewardsBeforeRewardsWereDeliveredFromIP(queryNotJoined, permissions);
    rewardsThatCanBeAcquired = rewardsThatCanBeEarned;
    rewardsThatRequireMorePermission = rewardsThatRequireMorePermission.concat(
      rewardsThatCannotBeEarned,
    );

    return {
      rewardsThatCanBeAcquired,
      rewardsThatTheUserWasIneligible,
      rewardsThatRequireMorePermission,
    };
  }, [possibleRewards, earnedRewards, permissions]);

  const getPossibleRewardComponent = (
    reward: PossibleReward,
    badge: EBadgeType,
  ) => (
    <Grid key={JSON.stringify(reward)} item xs={3}>
      <PossibleRewardComponent
        ipfsBaseUrl={ipfsBaseUrl}
        consentContractAddress={consentContractAddress}
        badgeType={badge}
        reward={reward}
      />
    </Grid>
  );

  useEffect(() => {
    if (isUnlocked) {
      generateAllPermissions().map((perms) => setPermissions(perms));
    }
  }, [isUnlocked]);

  return (
    <>
      <Box mb={1.5}>
        <Box display="flex">
          <Typography className={classes.title}>
            Manage Your Data Permissions
          </Typography>
          <Box ml="auto">
            <IconButton
              disableFocusRipple
              disableRipple
              disableTouchRipple
              aria-label="close"
              onClick={onCancelClick}
            >
              <CloseIcon style={{ fontSize: 24 }} />
            </IconButton>
          </Box>
        </Box>
        <Typography className={classes.subtitle}>
          You are eligible to earn the following rewards based on your data
          permissions. Unlock more rewards by changing your data permissions.
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <PermissionBar
            setBirthday={setBirthday}
            setLocation={setLocation}
            setGender={setGender}
            isSafe={isSafe}
            permissions={permissions}
            onClick={handlePermissionSelect}
            handleSelectAllClick={() => {
              setPermissions(UI_SUPPORTED_PERMISSIONS);
            }}
            isUnlocked={isUnlocked}
            onClickWhenLocked={onPermissionClickWhenLocked}
            onSocialClick={onSocialConnect}
          />
        </Grid>
        <Grid item xs={9}>
          <Grid container spacing={3}>
            {rewardsThatCanBeAcquired.map((reward) =>
              getPossibleRewardComponent(reward, EBadgeType.Available),
            )}
            {rewardsThatRequireMorePermission.map((reward) =>
              getPossibleRewardComponent(
                reward,
                EBadgeType.MorePermissionRequired,
              ),
            )}
            {rewardsThatTheUserWasIneligible.map((reward) =>
              getPossibleRewardComponent(reward, EBadgeType.UserWasInEligible),
            )}
          </Grid>
        </Grid>
      </Grid>
      <Box mt={4} display="flex">
        <Box marginLeft="auto" mr={2}>
          <Button buttonType="secondary" onClick={onCancelClick}>
            Cancel
          </Button>
        </Box>
        <Button
          buttonType="primary"
          onClick={() => {
            if (!isUnlocked) {
              return onPermissionClickWhenLocked();
            }

            onAcceptClick(
              rewardsThatCanBeAcquired,
              rewardsThatRequireMorePermission,
              permissions,
            );
          }}
        >
          Next
        </Button>
      </Box>
    </>
  );
};
