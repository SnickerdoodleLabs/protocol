import { URLString } from "@objects/primitives/index.js";

// https://docs.opensea.io/docs/metadata-standards#metadata-structure
export interface IERC721Metadata {
  image?: URLString;
  image_data?: string; // not recommended to use
  external_url?: URLString;
  description?: string;
  name?: string;
  attributes?: IERC721Attribute[];
  background_color?: string; // six-digit hex color code, ex. "#FF0000"
  animation_url?: URLString;
  youtube_url?: URLString;
}

export interface IERC721Attribute {
  display_type?: string;
  trait_type: string;
  value: string | number;
}
