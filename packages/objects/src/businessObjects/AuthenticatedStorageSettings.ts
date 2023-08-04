import { ECloudStorageType } from "@objects/enum";
import { AccessToken } from "@objects/primitives";

export class AuthenticatedStorageSettings {
  public constructor(
    public type: ECloudStorageType,
    public path: string,
    public accessToken: AccessToken,
  ) {}
}
