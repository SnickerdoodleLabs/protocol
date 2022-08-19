import errorCodes from "@objects/errors/errorCodes";
import { ProviderRpcError } from "@objects/errors/ProviderRpcError";
export class CrumbsContractError extends Error {
  protected errorCode: string = errorCodes[CrumbsContractError.name];
  constructor(
    message?: string,
    public reason?: string,
    public src?: ProviderRpcError | unknown,
  ) {
    super(
      `${message} ${(src as any)?.reason ? `: ${(src as any)?.reason}` : ``}`,
    );
  }
}
