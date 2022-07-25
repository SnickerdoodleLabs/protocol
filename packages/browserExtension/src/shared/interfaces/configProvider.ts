import { ExtensionConfig } from "@shared/objects/Config";

export interface IConfigProvider {
  getConfig: () => ExtensionConfig;
}
