import { ISDQLHasObject } from "@objects/interfaces/ISDQLHasObject.js";

export interface ISDQLQueryConditions {
  in: number[];
  ge: number;
  l: number;
  le: number;
  e: number;
  g: number;
  has: ISDQLHasObject;
}
