import { EVMEvent } from "@objects/businessObjects/EVMEvent.js";
import { ChainTransaction } from "@objects/businessObjects/versioned/ChainTransaction.js";
import { EVMTransaction } from "@objects/businessObjects/versioned/EVMTransaction.js";
import { SolanaTransaction } from "@objects/businessObjects/versioned/SolanaTransaction.js";
import { VersionedObjectMigrator } from "@objects/businessObjects/versioned/VersionedObject.js";
import { getChainInfoByChainId } from "@objects/configuration/index.js";
import { EChainTechnology } from "@objects/enum/index.js";
import {
  BigNumberString,
  ChainId,
  EVMAccountAddress,
  EVMContractAddress,
  EVMTransactionHash,
  ISO8601DateString,
  SolanaTransactionSignature,
  UnixTimestamp,
} from "@objects/primitives/index.js";

export class ChainTransactionMigrator extends VersionedObjectMigrator<ChainTransaction> {
  public getCurrentVersion(): number {
    return ChainTransaction.CURRENT_VERSION;
  }

  protected factory(data: Record<string, unknown>): ChainTransaction {
    switch (getChainInfoByChainId(data["chainId"] as ChainId).chainTechnology) {
      case EChainTechnology.Solana:
        return new SolanaTransaction(
          data["ChainId"] as ChainId,
          data["hash"] as SolanaTransactionSignature,
          data["timestamp"] as UnixTimestamp,
          data["slot"] as number,
          data["err"] as object,
          data["memo"] as string,
          data["measurementDate"] as ISO8601DateString,
        );
      case EChainTechnology.EVM:
        return new EVMTransaction(
          data["chainId"] as ChainId,
          data["hash"] as EVMTransactionHash,
          data["timestamp"] as UnixTimestamp,
          data["blockHeight"] as number,
          data["to"] as EVMAccountAddress,
          data["from"] as EVMAccountAddress,
          data["value"] as BigNumberString,
          data["gasPrice"] as BigNumberString,
          data["contractAddress"] as EVMContractAddress,
          data["input"] as string,
          data["methodId"] as string,
          data["functionName"] as string,
          data["events"] as EVMEvent[],
          data["measurementDate"] as ISO8601DateString,
        );
      default:
        throw new Error("chain ID does not match known technology");
    }
  }


  protected getUpgradeFunctions(): Map<
  number,
  (data: Record<string, unknown>, version: number) => Record<string, unknown>
> {
  return new Map([
    [
      1,
      (data, version) => {
        data["measurementDate"] = ( new Date().toISOString())
        return data;
      },
    ],
  ]);
}
}
