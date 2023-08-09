import { ChildProxy } from "@snickerdoodlelabs/utils";

export interface ICoreListener extends ChildProxy {}

export const ICoreListenerType = Symbol.for("ICoreListener");
