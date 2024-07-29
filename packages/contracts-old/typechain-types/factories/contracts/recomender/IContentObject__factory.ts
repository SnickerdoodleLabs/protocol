/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IContentObject,
  IContentObjectInterface,
} from "../../../contracts/recomender/IContentObject";

const _abi = [
  {
    inputs: [],
    name: "getContentAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "stakingToken",
        type: "address",
      },
    ],
    name: "getNumberOfStakedTags",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "stakingToken",
        type: "address",
      },
    ],
    name: "getTagArray",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "tag",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "slot",
            type: "uint256",
          },
        ],
        internalType: "struct IContentObject.Tag[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "tag",
        type: "string",
      },
      {
        internalType: "address",
        name: "stakingToken",
        type: "address",
      },
    ],
    name: "tagIndices",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class IContentObject__factory {
  static readonly abi = _abi;
  static createInterface(): IContentObjectInterface {
    return new Interface(_abi) as IContentObjectInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IContentObject {
    return new Contract(address, _abi, runner) as unknown as IContentObject;
  }
}