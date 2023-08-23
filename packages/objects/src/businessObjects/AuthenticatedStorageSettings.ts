import { ECloudStorageType } from "@objects/enum/index.js";
import { RefreshToken } from "@objects/primitives/index.js";

export class AuthenticatedStorageSettings {
  public constructor(
    public type: ECloudStorageType,
    public path: string,
    public refresh_token: RefreshToken,
  ) {}
}
