import { JsonRpcEngine } from "json-rpc-engine";

export interface IPortConnectionObject {
  engine: JsonRpcEngine;
  tabId: number | undefined;
  windowId: number | undefined;
}

export interface IPortConnection {
  [id: string]: IPortConnectionObject;
}

export interface IPortConnections {
  [origin: string]: IPortConnection;
}
