export type PropertiesOf<T> = {
  [K in keyof T]: T[K] extends Function ? never : T[K];
};
