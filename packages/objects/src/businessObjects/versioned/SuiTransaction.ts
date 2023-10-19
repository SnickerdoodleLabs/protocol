import { Interface } from "ethers/lib/utils";

import { EVMEvent } from "@objects/businessObjects/EVMEvent";
import {
  EVMFunctionParameter,
  EVMFunctionSignature,
} from "@objects/businessObjects/EVMFunctionSignature.js";
import { ChainTransaction } from "@objects/businessObjects/versioned/ChainTransaction.js";
import { EChain } from "@objects/enum/index.js";
import {
  SuiAccountAddress,
  BigNumberString,
  UnixTimestamp,
  EVMAccountAddressRegex,
  SuiTransactionHash,
  SuiContractAddress,
} from "@objects/primitives/index.js";

/**
 * This is a concrete implementation of the Transaction class from Ethers. I'd really prefer to not have to
 * import and depend on Ethers directly, but odds are any project that is using @snickerdoodlelabs/objects
 * is also importing Ethers.
 * Docs are here: https://docs.ethers.io/v5/api/utils/transactions/#Transaction
 */
export class SuiTransaction extends ChainTransaction {
  public accountAddresses: SuiAccountAddress[]; // null safety necessary for old transactions
  public functionSignature: EVMFunctionSignature | null = null;

  public constructor(
    public chain: EChain,
    public hash: SuiTransactionHash,
    public timestamp: UnixTimestamp,
    public blockHeight: number | null,
    public to: SuiAccountAddress | null,
    public from: SuiAccountAddress | null,
    public value: BigNumberString | null,
    public gasPrice: BigNumberString | null,
    public contractAddress: SuiContractAddress | null,
    public input: string | null,
    public methodId: string | null,
    public functionName: string | null,
    events: EVMEvent[] | null,
  ) {
    super(chain, hash, timestamp);
    let addrs = new Set<SuiAccountAddress>();
    if (this.to) {
      addrs.add(this.to);
    }
    if (this.from) {
      addrs.add(this.from);
    }
    if (
      this.input &&
      this.functionName &&
      this.methodId &&
      !this.functionName.startsWith(this.methodId)
    ) {
      try {
        const iface = new Interface([`function ${this.functionName}`]);
        const func = iface.getFunction(this.input.slice(0, 10));
        const paramValues = iface.decodeFunctionData(func.name, this.input);

        // filter out unrecognized methodIDs
        // we may want to do a secondary lookup on failure here:
        // https://www.4byte.directory/docs/
        this.functionSignature = new EVMFunctionSignature(
          func.name,
          func.type,
          func.inputs.map((input, i) => {
            return new EVMFunctionParameter(
              input.name,
              input.type,
              paramValues[i],
            );
          }),
        );

        addrs = new Set([
          ...addrs,
          ...this._getDescendants(this.functionSignature),
        ]);
      } catch (e) {
        // this is also a bit noisy
        console.warn("error decoding transaction input", e);
      }
    }

    if (events) {
      addrs = new Set([...addrs, ...this._getDescendants(events)]);
    }

    this.accountAddresses = Array.from(addrs);
  }

  private _getDescendants(obj): Set<SuiAccountAddress> {
    let result = new Set<SuiAccountAddress>();
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === "object") {
        result = new Set([...result, ...this._getDescendants(value)]);
      } else {
        if (typeof value === "string" && value.match(EVMAccountAddressRegex)) {
          result.add(SuiAccountAddress(value));
        }
      }
    }

    return result;
  }
}