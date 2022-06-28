import { IPFSHTTPClient } from "ipfs-http-client"; // NOTE if you change to version after @55.0.0 you will get an error that requires EMS compiler instead of CJS
import { ResultAsync } from "neverthrow";
import { IPFSError } from "@browser-extension/../../objects/src/errors/IPFSError";

export interface IIPFSProvider {
    getIFPSClient(): ResultAsync<IPFSHTTPClient, IPFSError>;
}

export const IIPFSProviderType = Symbol.for("IIPFSProvider");
