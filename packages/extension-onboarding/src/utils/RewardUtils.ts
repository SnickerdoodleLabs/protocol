import {
  PossibleReward,
  EarnedReward,
  QueryTypePermissionMap,
  EWalletDataType,
  EQueryProcessingStatus,
  QueryStatus,
  IpfsCID,
} from "@snickerdoodlelabs/objects";

export type PossibleRewardWithQueryStatus = PossibleReward & {
  queryStatus: EQueryProcessingStatus | undefined;
};

export const addQueryStatusToPossibleReward = (
  possibleRewards: PossibleReward[],
  queryStatuses: QueryStatus[],
): PossibleRewardWithQueryStatus[] => {
  const queryCIDToStatusMap = getQueryCIDToStatusMap(queryStatuses);
  return possibleRewards.reduce<PossibleRewardWithQueryStatus[]>(
    (arr, possibleReward) => {
      arr.push({
        ...possibleReward,
        queryStatus: queryCIDToStatusMap.get(possibleReward.queryCID),
      });
      return arr;
    },
    [],
  );
};

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

export const categorizePossibleRewardsBasedOnStatus = (
  possibleRewardWithQueryStatus: PossibleRewardWithQueryStatus[],
): {
  queryBeingProcessed: PossibleReward[];
  queryProcessed: PossibleReward[];
  queryNotReceived: PossibleReward[];
} => {
  return possibleRewardWithQueryStatus.reduce<{
    queryBeingProcessed: PossibleReward[];
    queryProcessed: PossibleReward[];
    queryNotReceived: PossibleReward[];
  }>(
    (queryStates, reward) => {
      if (reward.queryStatus) {
        if (reward.queryStatus < 4) {
          queryStates.queryBeingProcessed.push(reward);
        } else {
          queryStates.queryProcessed.push(reward);
        }
      } else {
        queryStates.queryNotReceived.push(reward);
      }
      return queryStates;
    },
    { queryBeingProcessed: [], queryProcessed: [], queryNotReceived: [] },
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

const getQueryCIDToStatusMap = (
  queryStatuses: QueryStatus[],
): Map<IpfsCID, EQueryProcessingStatus> => {
  return queryStatuses.reduce<Map<IpfsCID, EQueryProcessingStatus>>(
    (cidsWithStatusMap, queryStatus) => {
      cidsWithStatusMap.set(queryStatus.queryCID, queryStatus.status);
      return cidsWithStatusMap;
    },
    new Map(),
  );
};
