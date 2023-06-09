import { PossibleReward, EarnedReward } from "@snickerdoodlelabs/objects";

export const isSameReward = (
  reward1: PossibleReward | EarnedReward,
  reward2: PossibleReward | EarnedReward,
): boolean => {
  return (
    reward1.queryCID === reward2.queryCID &&
    reward1.image === reward2.image &&
    reward1.description === reward2.description &&
    reward1.name === reward2.name &&
    reward1.type === reward2.type
  );
};
