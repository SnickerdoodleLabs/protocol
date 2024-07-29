/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  ERC721HolderUpgradeable,
  ERC721HolderUpgradeableInterface,
} from "../../../../../../@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable";

const _abi = [
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error",
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class ERC721HolderUpgradeable__factory {
  static readonly abi = _abi;
  static createInterface(): ERC721HolderUpgradeableInterface {
    return new Interface(_abi) as ERC721HolderUpgradeableInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ERC721HolderUpgradeable {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as ERC721HolderUpgradeable;
  }
}