export const generateRouteUrl = <T extends Record<string, string | number>>(
  path: string,
  params: T,
): string => {
  return Object.keys(params).reduce((url, key) => {
    const value = params[key];
    const paramValue = typeof value === "number" ? value.toString() : value;
    return url.replace(`:${key}`, paramValue);
  }, path);
};
