/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export interface IERC7529Interface extends Interface {
  getFunction(nameOrSignature: "checkDomain"): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "AddDomain" | "RemoveDomain"): EventFragment;

  encodeFunctionData(functionFragment: "checkDomain", values: [string]): string;

  decodeFunctionResult(
    functionFragment: "checkDomain",
    data: BytesLike
  ): Result;
}

export namespace AddDomainEvent {
  export type InputTuple = [domain: string];
  export type OutputTuple = [domain: string];
  export interface OutputObject {
    domain: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RemoveDomainEvent {
  export type InputTuple = [domain: string];
  export type OutputTuple = [domain: string];
  export interface OutputObject {
    domain: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface IERC7529 extends BaseContract {
  connect(runner?: ContractRunner | null): IERC7529;
  waitForDeployment(): Promise<this>;

  interface: IERC7529Interface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  checkDomain: TypedContractMethod<[domain: string], [boolean], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "checkDomain"
  ): TypedContractMethod<[domain: string], [boolean], "view">;

  getEvent(
    key: "AddDomain"
  ): TypedContractEvent<
    AddDomainEvent.InputTuple,
    AddDomainEvent.OutputTuple,
    AddDomainEvent.OutputObject
  >;
  getEvent(
    key: "RemoveDomain"
  ): TypedContractEvent<
    RemoveDomainEvent.InputTuple,
    RemoveDomainEvent.OutputTuple,
    RemoveDomainEvent.OutputObject
  >;

  filters: {
    "AddDomain(string)": TypedContractEvent<
      AddDomainEvent.InputTuple,
      AddDomainEvent.OutputTuple,
      AddDomainEvent.OutputObject
    >;
    AddDomain: TypedContractEvent<
      AddDomainEvent.InputTuple,
      AddDomainEvent.OutputTuple,
      AddDomainEvent.OutputObject
    >;

    "RemoveDomain(string)": TypedContractEvent<
      RemoveDomainEvent.InputTuple,
      RemoveDomainEvent.OutputTuple,
      RemoveDomainEvent.OutputObject
    >;
    RemoveDomain: TypedContractEvent<
      RemoveDomainEvent.InputTuple,
      RemoveDomainEvent.OutputTuple,
      RemoveDomainEvent.OutputObject
    >;
  };
}
