import { AccessToken, RefreshToken } from "@objects/primitives";

// export class ProfileFieldChangedNotification extends BaseNotification<ProfileFieldUpdate> {
//   constructor(public update: ProfileFieldUpdate) {
//     super(ENotificationTypes.PROFILE_FIELD_CHANGED, update);
//   }
// }

export class DropboxTokens {
  protected access_token: AccessToken;
  protected refresh_token: RefreshToken;

  public constructor(
    public accessToken: AccessToken,
    public refreshToken: RefreshToken,
  ) {
    this.access_token = accessToken;
    this.refresh_token = refreshToken;
  }
}
