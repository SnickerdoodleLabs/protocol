import { ProxyError } from "@snickerdoodlelabs/objects";
import { injectable, unmanaged } from "inversify";
import { errAsync, ResultAsync } from "neverthrow";
import Postmate from "postmate";

interface IIFrameCallData<CallDataType> {
  callId: number;
  data: CallDataType;
}

class IFrameCallData<CallDataType> implements IIFrameCallData<CallDataType> {
  constructor(public callId: number, public data: CallDataType) {}
}

class IFrameCall<CallDataType, ResultType, ErrorType> {
  protected promise: Promise<ResultType>;
  protected resolveFunc: ((result: ResultType) => void) | null;
  protected rejectFunc: ((error: ErrorType) => void) | null;

  constructor(public callData: IIFrameCallData<CallDataType>) {
    this.resolveFunc = null;
    this.rejectFunc = null;

    this.promise = new Promise((resolve, reject) => {
      this.resolveFunc = resolve;
      this.rejectFunc = reject;
    });
  }

  public resolve(result: ResultType): void {
    if (this.resolveFunc != null) {
      this.resolveFunc(result);
    }
  }

  public reject(error: ErrorType): void {
    if (this.rejectFunc != null) {
      this.rejectFunc(error);
    }
  }

  public getResult(): ResultAsync<ResultType, ErrorType> {
    return ResultAsync.fromPromise(this.promise, (e) => {
      return e as ErrorType;
    });
  }
}

@injectable()
export abstract class ParentProxy {
  protected handshake: Postmate | undefined;
  protected child: Postmate.ParentAPI | null;
  protected callId = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected calls: IFrameCall<any, any, any>[] = [];
  protected active: boolean;
  protected activationTimeoutMS = 120000;

  constructor(
    @unmanaged() protected element: HTMLElement | null,
    @unmanaged() protected iframeUrl: string,
    @unmanaged() protected iframeName: string,
    @unmanaged() protected debug: boolean = false,
  ) {
    this.child = null;
    this.active = false;

    if (element == null) {
      this.element = document.body;
    }

    Postmate.debug = debug;
  }

  protected activateResult: ResultAsync<void, ProxyError> | undefined;

  public activate(): ResultAsync<void, ProxyError> {
    if (this.activateResult != null) {
      return this.activateResult;
    }
    this.activateResult = ResultAsync.fromPromise(
      new Promise<Postmate.ParentAPI>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(
            new ProxyError(
              `Performing a handshake with the child iframe ${this.iframeUrl} timed out, took longer than ${this.activationTimeoutMS}ms`,
            ),
          );
        }, this.activationTimeoutMS);

        // Create the iframe proxy
        try {
          this.handshake = new Postmate({
            container: this.element,
            url: this.iframeUrl,
            name: this.iframeName,
            classListArray: ["snickerdoodle-core-iframe-style"], // Classes to add to the iframe
          });

          // handshake is a promise, but we've wrapped all this in a second
          // promise. This pattern where a Postmate object is a promise
          // is very strange, and requires us to use the manual .then()/.catch()
          // syntax instead of async/await
          this.handshake
            .then((child) => {
              // Stash the child here; we need it for the
              this.child = child;

              // Do the rest of the processing inside normal neverthrow land
              clearTimeout(timeoutId);
              resolve(child);
            })
            .catch((error) => {
              clearTimeout(timeoutId);
              reject(
                new ProxyError(
                  `An error occurred while performing a handshake with a child iframe ${this.iframeUrl}`,
                  error,
                ),
              );
            });
        } catch (err) {
          clearTimeout(timeoutId);
          reject(
            new ProxyError(
              `An error occurred while creating the child iframe proxy ${this.iframeUrl}`,
              err,
            ),
          );
        }
      }),
      (e) => {
        return e as ProxyError;
      },
    )
      .map((child) => {
        child.on("callSuccess", (data: IIFrameCallData<unknown>) => {
          // Get the matching calls
          const matchingCalls = this.calls.filter((val) => {
            return val.callData.callId == data.callId;
          });

          // Remove the matching calls from the source array
          this.calls = this.calls.filter((val) => {
            return val.callData.callId != data.callId;
          });

          // Resolve the calls - should only ever be 1
          for (const call of matchingCalls) {
            call.resolve(data.data);
          }
        });

        child.on("callError", (data: IIFrameCallData<unknown>) => {
          // Get the matching calls
          const matchingCalls = this.calls.filter((val) => {
            return val.callData.callId == data.callId;
          });

          // Remove the matching calls from the source array
          this.calls = this.calls.filter((val) => {
            return val.callData.callId != data.callId;
          });

          // Reject the calls - should only ever be 1
          for (const call of matchingCalls) {
            call.reject(data.data);
          }
        });

        this.active = true;

        console.log("Handshake with iframe complete");
      })
      .mapErr((e) => {
        // If we failed to activate, we need to reset the activateResult
        this.activateResult = undefined;

        // Let the world know
        console.error(
          `Unable to create iframe proxy with ${this.iframeUrl}`,
          e,
        );

        // And enable debugging for the next attempt
        Postmate.debug = true;

        return e;
      });

    // We just assigned this.activateResult above, this is not
    // null now. activateResult can be cleared, but that is after
    // we return it here.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.activateResult!;
  }

  public destroy(): void {
    this.child?.destroy();
    this.active = false;
  }

  protected _createCall<CallDataType, ErrorType, ResultType>(
    callName: string,
    data: CallDataType,
  ): ResultAsync<ResultType, ErrorType | ProxyError> {
    if (!this.active) {
      return errAsync(
        new ProxyError(
          "Proxy is not activated or has been destroyed, cannot make a call to the iframe!",
        ),
      );
    }
    const callId = this.callId++;
    const callData = new IFrameCallData(callId, data);

    const call = new IFrameCall<CallDataType, ResultType, ErrorType>(callData);
    this.calls.push(call);

    this.child?.call(callName, callData);

    return call.getResult();
  }
}
