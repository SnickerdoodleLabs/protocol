import { ChildAPI } from "postmate";

declare module "postmate" {
  interface ChildAPI {
    parentOrigin: string;
  }
}
