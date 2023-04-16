import { HashAlgorithm, SignatureAlgorithm } from "@objects/businessObjects";

export type SignatureMethod = `${SignatureAlgorithm}-${HashAlgorithm}`;
