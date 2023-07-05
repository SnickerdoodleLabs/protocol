import { Grid, Box, Typography, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Button } from "@shared-components/components/Button";
import { PermissionBar } from "@shared-components/components/PermissionBar";
import { useStyles } from "@shared-components/components/PermissionSelection/PermissionSelection.style";
import { PossibleRewardComponent } from "@shared-components/components/PossibleReward";
import { UI_SUPPORTED_PERMISSIONS } from "@shared-components/constants";
import { EBadgeType } from "@shared-components/objects";
import { isSameReward } from "@shared-components/utils";
import {
  CountryCode,
  EarnedReward,
  ESocialType,
  EVMContractAddress,
  EWalletDataType,
  Gender,
  IOpenSeaMetadata,
  PossibleReward,
  QueryTypePermissionMap,
  QueryTypes,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";

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
    eligibleRewards: PossibleReward[],
    missingRewards: PossibleReward[],
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

  const getBadge = useCallback(
    (queryDependencies: QueryTypes[]) =>
      queryDependencies
        .map((dependency) => QueryTypePermissionMap.get(dependency)!)
        .every((dataType) => permissions.includes(dataType))
        ? EBadgeType.Available
        : EBadgeType.MorePermissionRequired,
    [permissions],
  );

  const { programRewards } = useMemo(() => {
    // earned rewards
    const collectedRewards = possibleRewards.reduce((acc, item) => {
      const matchedReward = earnedRewards.find((reward) =>
        isSameReward(reward, item),
      );
      if (matchedReward) {
        acc = [...acc, matchedReward];
      }
      return acc;
    }, [] as EarnedReward[]);

    const collectedRewardQueryCIDs = Array.from(
      new Set(collectedRewards.map((item) => item.queryCID)),
    );

    return {
      programRewards: possibleRewards
        .filter(
          (possibleReward) =>
            !collectedRewards.find((item) =>
              isSameReward(possibleReward, item),
            ),
        )
        // filter queries which are already replied
        .filter((item) => !collectedRewardQueryCIDs.includes(item.queryCID)),
    };
  }, [possibleRewards, earnedRewards]);

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
            {programRewards.map((rewardItem) => (
              <Grid key={JSON.stringify(rewardItem)} item xs={3}>
                <PossibleRewardComponent
                  ipfsBaseUrl={ipfsBaseUrl}
                  consentContractAddress={consentContractAddress}
                  badgeType={getBadge(rewardItem.queryDependencies)}
                  reward={rewardItem}
                />
              </Grid>
            ))}
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
            const { eligibleRewards, unEligibleRewards } =
              programRewards.reduce(
                (acc, item) => {
                  const requiredDataTypes = item.queryDependencies.map(
                    (queryType) => QueryTypePermissionMap.get(queryType)!,
                  );
                  const permissionsMatched = requiredDataTypes.every((item) =>
                    permissions.includes(item),
                  );
                  if (permissionsMatched) {
                    acc.eligibleRewards = [...acc.eligibleRewards, item];
                  } else {
                    acc.unEligibleRewards = [...acc.unEligibleRewards, item];
                  }
                  return acc;
                },
                { eligibleRewards: [], unEligibleRewards: [] } as {
                  eligibleRewards: PossibleReward[];
                  unEligibleRewards: PossibleReward[];
                },
              );

            const uniqueCIDsofEligibleRewards = Array.from(
              new Set(eligibleRewards.map((rewardItem) => rewardItem.queryCID)),
            );

            const missingRewards = unEligibleRewards.filter((item) =>
              uniqueCIDsofEligibleRewards.includes(item.queryCID),
            );

            onAcceptClick(eligibleRewards, missingRewards, permissions);
          }}
        >
          Next
        </Button>
      </Box>
    </>
  );
};
