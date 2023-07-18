import { Signature } from "@objects/primitives/Signature.js";

export class BaseBEError extends Error {
  public code: number;
  public type: string;
  public data: unknown;
  public retryable: boolean;
  public signature: Signature | null = null;

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
