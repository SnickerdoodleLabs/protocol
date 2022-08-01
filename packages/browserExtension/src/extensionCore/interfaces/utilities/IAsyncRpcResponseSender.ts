export interface IAsyncRpcResponseSender {
  call(): Promise<void>;
}
