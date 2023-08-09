import { ECloudStorageType } from "@objects/enum/index.js";
import { AccessToken } from "@objects/primitives";

export class AuthenticatedStorageSettings {
  public constructor(
    public type: ECloudStorageType,
    public path: string,
    public accessToken: AccessToken,
  ) {}
}
