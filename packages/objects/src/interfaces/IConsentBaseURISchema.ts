import { IUserAgreement } from "@objects/interfaces/IUserAgreement.js";
import { URLString } from "@objects/primitives/URLString.js";

export interface IConsentBaseURISchema extends IUserAgreement {
  brandName?: string;
  brandImage?: URLString;
  brandDescription?: string;
}
