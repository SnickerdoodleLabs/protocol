import { ECloudStorageType } from "@objects/enum/index.js";
import { AccessToken } from "@objects/primitives/index.js";
import { DropboxTokens } from "..";

export class AuthenticatedStorageSettings {
  public constructor(
    public type: ECloudStorageType,
    public path: string,
    public dropboxTokens: DropboxTokens,
  ) {}
}
