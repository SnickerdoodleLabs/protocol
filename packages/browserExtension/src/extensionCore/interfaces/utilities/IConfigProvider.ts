import { Config } from "@interfaces/objects";

export interface IConfigProvider {
	getConfig(): Config;
}
