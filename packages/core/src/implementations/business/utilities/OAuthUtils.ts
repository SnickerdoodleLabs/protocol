import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import { inject, injectable } from "inversify";

import { IOAuthUtils } from "@core/interfaces/business/utilities/index.js";
import {
  IPermissionRepository,
  IPermissionRepositoryType,
} from "@core/interfaces/data/index.js";
import { TokenAndSecret } from "@snickerdoodlelabs/objects";

@injectable()
export class OAuthUtils implements IOAuthUtils {
  public constructor(
    @inject(IPermissionRepositoryType)
    protected permissionRepo: IPermissionRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getOAuth1aString(
    requestOptions: OAuth.RequestOptions,
    oAuth: OAuth,
    accessTokenAndSecret?: TokenAndSecret,
  ): string {
    return oAuth.toHeader(
      oAuth.authorize(
        requestOptions,
        accessTokenAndSecret
          ? {
              key: accessTokenAndSecret.token,
              secret: accessTokenAndSecret.secret,
            }
          : undefined,
      ),
    ).Authorization;
  }
}
