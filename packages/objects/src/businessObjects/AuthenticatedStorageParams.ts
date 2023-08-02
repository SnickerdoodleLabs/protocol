import { ECloudStorageType } from "@objects/enum";

export class AuthenticatedStorageParams {
  public type;
  public dropboxKey;
  public dropboxSecret;

  public constructor(
    protected storageType: ECloudStorageType,
    protected dropboxAppKey: string | undefined,
    protected dropboxAppSecret: string | undefined,
  ) {
    this.dropboxKey = dropboxAppKey;
    this.dropboxSecret = dropboxAppSecret;
    this.type = storageType;
  }
}
