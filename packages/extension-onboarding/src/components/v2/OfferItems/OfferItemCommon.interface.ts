import { IpfsCID } from "@snickerdoodlelabs/objects";
import {
  ECustomTypographyVariant,
  IMultiQuestionItem,
  ISingleQuestionnaireItem,
  ISingleVirtualQuestionnaireItem,
} from "@snickerdoodlelabs/shared-components";

export interface IOfferItemCommonProps {
  brandImage?: string;
  onProcceed: (cid: IpfsCID) => void;
  disabled?: boolean;
  padding?: number;
  offer:
    | ISingleQuestionnaireItem
    | ISingleVirtualQuestionnaireItem
    | IMultiQuestionItem;
  mt?: number;
  mb?: number;
  nameFontVariant?: `${ECustomTypographyVariant}`;
  descriptionFontVariant?: `${ECustomTypographyVariant}`;
}
