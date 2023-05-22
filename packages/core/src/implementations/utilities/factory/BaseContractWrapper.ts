import { ILogUtils } from "@snickerdoodlelabs/common-utils";
import {
  IBaseContract,
  IConsentContract,
} from "@snickerdoodlelabs/contracts-sdk";
import { EExternalApi } from "@snickerdoodlelabs/objects";
import { ResultAsync, errAsync } from "neverthrow";

import { IContextProvider } from "@core/interfaces/utilities/index.js";

/**
 * This wrapper implements some metrics utilities and well as reliability (by implementing fallbacks to a secondary provider)
 */
export abstract class BaseContractWrapper<TContract extends IBaseContract> {
  public constructor(
    protected primary: TContract,
    protected secondary: TContract | null,
    protected contextProvider: IContextProvider,
    protected logUtils: ILogUtils,
  ) {
    if (
      secondary != null &&
      primary.getContractAddress() != secondary.getContractAddress()
    ) {
      throw new Error(
        "Tried to create a BaseContractWrapper with two contracts with different addresses!",
      );
    }
  }

  // This method implements our primary/secondary fallback logic. If the primary fails multiple times,
  // we can stop using it for some time and rely on the secondary; if both fail we can even queue
  // calls for some time and do backoff and retry. This could get as complex as we want.
  protected fallback<T, TErr>(
    primary: () => ResultAsync<T, TErr>,
    secondary: () => ResultAsync<T, TErr> | undefined,
  ): ResultAsync<T, TErr> {
    return this.contextProvider.getContext().andThen((context) => {
      context.privateEvents.onApiAccessed.next(EExternalApi.PrimaryControl);
      return primary().orElse((e) => {
        // If we do not have a secondary provider, the secondary() method will return null when called,
        // don't bother.
        if (this.secondary == null) {
          return errAsync(e);
        }

        // If we have a secondary provider, then we can attempt it. secondary() should produce a ResultAsync
        this.logUtils.debug("Falling back to secondary provider");
        context.privateEvents.onApiAccessed.next(EExternalApi.SecondaryControl);
        return secondary() as ResultAsync<T, TErr>;
      });
    });
  }

  //   protected fallback2<T, TErr>(
  //     name: FunctionKeys,
  //     ...args
  //   ): ResultAsync<unknown, unknown> {
  //     this.contextProvider.incrementApi(this.primaryName);

  //     // eslint-disable-next-line prefer-spread
  //     return this.primary[name](...args);

  //     return primary().orElse((e) => {
  //       this.contextProvider.incrementApi(this.secondaryName);
  //       return secondary();
  //     });
  //   }
}

type FunctionKeys = {
  [K in keyof IConsentContract]: IConsentContract[K] extends (
    this: IConsentContract,
    ...args
  ) => ResultAsync<unknown, unknown>
    ? K
    : never;
}[keyof IConsentContract];
