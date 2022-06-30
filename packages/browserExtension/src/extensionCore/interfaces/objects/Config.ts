export class Config {
	constructor(
		public restBaseUrl: string,
		public publicGatewayBaseUrl: string,
		public buildEnv: string,
		public infuraId: string,
		public domain: string,
		public identityRegistryAddress: string,
		public userPortalUrl: string,
		public automationTestsAvaible: string,
		public gaKey: string,
	) {}
}
