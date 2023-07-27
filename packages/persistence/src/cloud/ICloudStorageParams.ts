export interface ICloudStorageParams {
    /**
     * Returns the ECloudStorageType of the cloud storage we use
     */
    getDropboxKey(): string;
    getDropboxSecret(): string;
    getGCPBucket(): string;
    authenticateDropboxCredentials(): boolean;
    authenticateGCPCredentials(): boolean;
    dataWalletAddress(): string;
}
