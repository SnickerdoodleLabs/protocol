import { ITokenAndSecret } from "@snickerdoodlelabs/objects";

export interface TwitterOAuth1aAccessTokenAPIResponse extends ITokenAndSecret {
  userName: string;
  userId: string;
}
