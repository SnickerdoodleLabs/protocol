export interface ICloudStorageParams {
  /**
   * Returns the ECloudStorageType of the cloud storage we use
   */
  dropboxKey: string;
  dropboxSecret: string;
}

export const ICloudStorageParamsType = Symbol.for("ICloudStorageParams");
