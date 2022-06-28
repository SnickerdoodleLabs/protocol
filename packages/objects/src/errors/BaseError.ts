/**
 * BaseError is exactly MoleculerError, and is thus compatible with Moleculer, but it does not require the import of Moleculer, so that the requirements for the Objects package can be
 * kept extremely low.
 */
export class BaseError extends Error {
    public code: number;
    public type: string;
    public data: unknown;
    public retryable: boolean;

    constructor(
        message: string,
        code: number,
        type: string,
        data: unknown,
        retryable: boolean,
    ) {
        super(message);
        this.code = code || 500;
        this.type = type;
        this.data = data;
        this.retryable = retryable;
    }
}

export const errorCodes = {
    DatabaseError: "ERR_DATABASE",
    JWKSError: "ERR_JWKS",
    IPFSError: "ERR_IPFS",
};
