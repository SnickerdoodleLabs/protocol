import { UnixTimestamp } from "@snickerdoodlelabs/objects";

export const getCalculatedAge = (timestamp: UnixTimestamp): string => {
  const now = new Date();
  const operationDate = new Date(timestamp * 1000);

  const timeDifference = now.getTime() - operationDate.getTime();
  const seconds = Math.floor(timeDifference / 1000);

  if (seconds < 60) {
    return `${seconds} s ago`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    if (remainingSeconds === 0) {
      return `${minutes} m ago`;
    }
    return `${minutes} m ${remainingSeconds} s ago`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours < 24) {
    if (remainingMinutes === 0) {
      return `${hours} h ago`;
    }
    return `${hours} h ${remainingMinutes} m ago`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (remainingHours === 0) {
    return `${days} d ago`;
  }
  return `${days} d ${remainingHours} h ago`;
};
