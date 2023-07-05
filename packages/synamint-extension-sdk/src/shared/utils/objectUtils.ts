export const mapToObj = <K extends string, V>(map: Map<K, V>) => {
  return Array.from(map).reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {} as Record<K, V>);
};
