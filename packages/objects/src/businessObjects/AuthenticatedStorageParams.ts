import { ECloudStorageType } from "@objects/enum";

export class AuthenticatedStorageParams {
  public type;
  public dropboxKey;
  public dropboxSecret;
  public dropboxRedirectUri;

  public constructor(
    protected storageType: ECloudStorageType,
    protected dropboxAppKey: string | undefined,
    protected dropboxAppSecret: string | undefined,
    protected dropboxRedirect: string | undefined, // protected accessToken: string | undefined, // protected refreshToken: string | undefined, // protected path: string | undefined,
  ) {
    this.dropboxKey = dropboxAppKey;
    this.dropboxSecret = dropboxAppSecret;
    this.type = storageType;
    this.dropboxRedirectUri = dropboxRedirect;
  }
}
