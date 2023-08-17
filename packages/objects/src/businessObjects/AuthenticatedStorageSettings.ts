import { ECloudStorageType } from "@objects/enum/index.js";
import { AccessToken } from "@objects/primitives/index.js";

export class AuthenticatedStorageSettings {
  public constructor(
    public type: ECloudStorageType,
    public path: string,
    public accessToken: AccessToken,
  ) {}
}
