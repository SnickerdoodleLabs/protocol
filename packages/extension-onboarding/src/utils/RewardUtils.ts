import {
  PossibleReward,
  EarnedReward,
  QueryTypePermissionMap,
  EWalletDataType,
  IpfsCID,
} from "@snickerdoodlelabs/objects";

export const isSameReward = (
  reward1: PossibleReward | EarnedReward,
  reward2: PossibleReward | EarnedReward,
): boolean => {
  return (
    reward1.queryCID === reward2.queryCID &&
    reward1.image === reward2.image &&
    reward1.description === reward2.description &&
    reward1.type === reward2.type
  );
};

export const getRewardsAfterRewardsWereDeliveredFromIP = (
  possibleRewards: PossibleReward[],
  earnedRewards: EarnedReward[],
  consentPermissions: EWalletDataType[],
): {
  rewardsThatWereEarned: EarnedReward[];
  rewardsThatWereNotEarned: PossibleReward[];
  rewardsThatTheUserWereUnableToGet: PossibleReward[];
} => {
  const { rewardsThatCanBeEarned, rewardsThatCannotBeEarned } =
    getRewardsBeforeRewardsWereDeliveredFromIP(
      possibleRewards,
      consentPermissions,
    );

  return rewardsThatCanBeEarned.reduce<{
    rewardsThatWereEarned: EarnedReward[];
    rewardsThatWereNotEarned: PossibleReward[];
    rewardsThatTheUserWereUnableToGet: PossibleReward[];
  }>(
    (acc, possibleReward) => {
      const matchedReward = earnedRewards.find((reward) =>
        isSameReward(reward, possibleReward),
      );
      if (matchedReward) {
        acc.rewardsThatWereEarned.push(matchedReward);
      } else {
        acc.rewardsThatTheUserWereUnableToGet.push(possibleReward);
      }
      return acc;
    },
    {
      rewardsThatWereEarned: [],
      rewardsThatWereNotEarned: rewardsThatCannotBeEarned,
      rewardsThatTheUserWereUnableToGet: [],
    },
  );
};

export const getRewardsBeforeRewardsWereDeliveredFromIP = (
  possibleRewards: PossibleReward[],
  consentPermissions: EWalletDataType[],
): {
  rewardsThatCanBeEarned: PossibleReward[];
  rewardsThatCannotBeEarned: PossibleReward[];
} => {
  return possibleRewards.reduce<{
    rewardsThatCanBeEarned: PossibleReward[];
    rewardsThatCannotBeEarned: PossibleReward[];
  }>(
    (acc, reward) => {
      const requiredDataTypes = reward.estimatedQueryDependencies.map(
        (queryType) => QueryTypePermissionMap.get(queryType)!,
      );
      const permissionsMatched = requiredDataTypes.every((reward) =>
        consentPermissions.includes(reward),
      );
      if (permissionsMatched) {
        acc.rewardsThatCanBeEarned.push(reward);
      } else {
        acc.rewardsThatCannotBeEarned.push(reward);
      }
      return acc;
    },
    { rewardsThatCanBeEarned: [], rewardsThatCannotBeEarned: [] },
  );
};
