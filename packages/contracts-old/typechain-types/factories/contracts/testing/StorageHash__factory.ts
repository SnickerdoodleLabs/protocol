/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  StorageHash,
  StorageHashInterface,
} from "../../../contracts/testing/StorageHash";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ContentFactory",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "ContentObject",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "ERC7529",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "Pausable",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506101d1806100206000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c8063203c5fa4146100515780632c6fa84c1461006b578063a57b7f8d14610073578063f6c2a3881461007b575b600080fd5b610059610083565b60405190815260200160405180910390f35b6100596100e5565b610059610116565b610059610147565b60008060ff196100b460017f90fc0b46d5fa28fff8bcf662252c1d56796cede8da0884385c55b3ef7ef9a1b0610174565b6040516020016100c691815260200190565b60408051601f1981840301815291905280516020909101201692915050565b60008060ff196100b460017fc25745a6f4844d6334e8c74b6186760f1eee2b95e99d9a7e545c551bc81264b2610174565b60008060ff196100b460017f1ad55e21b6662c0d57e788b72983e76b769b343de0331a1dd24c82845c1c7704610174565b60008060ff196100b460017f6d3b9857c81f811ed7467f3ba87c6220db093067017d90489dec0dc981684d985b8181038181111561019557634e487b7160e01b600052601160045260246000fd5b9291505056fea26469706673582212209de58f04a5683015855a59d15010732cf8eac160b6bc56a1c6e00aebb149defe64736f6c63430008180033";

type StorageHashConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: StorageHashConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class StorageHash__factory extends ContractFactory {
  constructor(...args: StorageHashConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      StorageHash & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): StorageHash__factory {
    return super.connect(runner) as StorageHash__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): StorageHashInterface {
    return new Interface(_abi) as StorageHashInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): StorageHash {
    return new Contract(address, _abi, runner) as unknown as StorageHash;
  }
}
