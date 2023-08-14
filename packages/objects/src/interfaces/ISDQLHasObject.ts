import { URLString } from "@objects/primitives/URLString.js";

export interface ISDQLHasObject {
  patternProperties: {
    [url: URLString]: number;
  };
}
