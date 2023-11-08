import { EColorMode } from "@objects/enum/EColorMode.js";
import {
  IERC721Attribute,
  IERC721Metadata,
} from "@objects/interfaces/IERC721Metadata.js";

export type UserAgreementAttributes =
  | IUserAgreementVersionTrait
  | IUserAgreementColorModeTrait
  | IUserAgreementTitleTrait;

export interface IUserAgreementVersionTrait extends IERC721Attribute {
  trait_type: "version";
  value: number;
}

export interface IUserAgreementColorModeTrait extends IERC721Attribute {
  trait_type: "color mode";
  value: EColorMode;
}

export interface IUserAgreementTitleTrait extends IERC721Attribute {
  trait_type: "title";
  value: string;
}

export interface IUserAgreement extends IERC721Metadata {
  attributes: UserAgreementAttributes[];
}
