export const abbreviateString = (
  inputString: string,
  prefixLength = 4,
  suffixLength = 4,
  dotCount = 4,
): string => {
  if (inputString.length < prefixLength + suffixLength) {
    return inputString;
  }

  const prefix = prefixLength <= 0 ? "" : inputString.slice(0, prefixLength);
  const suffix = suffixLength <= 0 ? "" : inputString.slice(-suffixLength);
  const dots = ".".repeat(dotCount);

  return `${prefix}${dots}${suffix}`;
};
