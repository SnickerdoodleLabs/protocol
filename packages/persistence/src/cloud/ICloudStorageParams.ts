export interface ICloudStorageParams {
  /**
   * Returns the ECloudStorageType of the cloud storage we use
   */
  authenticateDropboxCredentials(): boolean;
  authenticateGCPCredentials(): boolean;
  dataWalletAddress(): string;

  dropboxKey: string;
  dropboxSecret: string;
}
