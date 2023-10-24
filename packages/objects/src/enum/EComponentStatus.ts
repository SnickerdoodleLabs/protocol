export enum EComponentStatus {
  InUse = "In Use",
  Available = "Available",
  TemporarilyDisabled = "Temporarily Disabled",
  Disabled = "Disabled",
  Error = "Error",
  NoKeyProvided = "NoKeyProvided",
}

/**
 * Returns the "better" of the two EComponentStatus enums.
 * InUse > Available > TemporarilyDisabled > Disabled > Error > NoKeyProvided
 * @param lhs
 * @param rhs
 * @returns The better of the two statuses
 */
export function compareComponentStatus(
  lhs: EComponentStatus,
  rhs: EComponentStatus,
): EComponentStatus {
  if (lhs == EComponentStatus.InUse) {
    return lhs;
  } else if (
    lhs == EComponentStatus.Available &&
    [
      EComponentStatus.TemporarilyDisabled,
      EComponentStatus.Disabled,
      EComponentStatus.Error,
      EComponentStatus.NoKeyProvided,
    ].includes(rhs)
  ) {
    return lhs;
  } else if (
    lhs == EComponentStatus.TemporarilyDisabled &&
    [
      EComponentStatus.Disabled,
      EComponentStatus.Error,
      EComponentStatus.NoKeyProvided,
    ].includes(rhs)
  ) {
    return lhs;
  } else if (
    lhs == EComponentStatus.Disabled &&
    [EComponentStatus.Error, EComponentStatus.NoKeyProvided].includes(rhs)
  ) {
    return rhs;
  } else if (
    lhs == EComponentStatus.Error &&
    [EComponentStatus.NoKeyProvided].includes(rhs)
  ) {
    return lhs;
  }
  return rhs;
}
