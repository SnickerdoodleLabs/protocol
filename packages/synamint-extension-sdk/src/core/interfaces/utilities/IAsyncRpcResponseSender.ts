export interface IAsyncRpcResponseSender {
  call(): Promise<void>;
}

export const IAsyncRpcResponseSenderType = Symbol.for(
  "IAsyncRpcResponseSender",
);
