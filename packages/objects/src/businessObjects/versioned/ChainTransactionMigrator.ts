import { ChainTransaction } from "@objects/businessObjects/versioned/ChainTransaction.js";
import { EVMTransaction } from "@objects/businessObjects/versioned/EVMTransaction.js";
import { SolanaTransaction } from "@objects/businessObjects/versioned/SolanaTransaction.js";
import { SuiTransaction } from "@objects/businessObjects/versioned/SuiTransaction.js";
import { VersionedObjectMigrator } from "@objects/businessObjects/versioned/VersionedObject.js";
import { getChainInfoByChainId } from "@objects/configuration/index.js";
import { EChainTechnology } from "@objects/enum/index.js";
import { ChainId } from "@objects/primitives/index.js";
import { PropertiesOf } from "@objects/utilities/index.js";

export class ChainTransactionMigrator extends VersionedObjectMigrator<ChainTransaction> {
  public getCurrentVersion(): number {
    return ChainTransaction.CURRENT_VERSION;
  }

  protected factory(data: PropertiesOf<ChainTransaction>): ChainTransaction {
    switch (getChainInfoByChainId(data.chain as ChainId).chainTechnology) {
      case EChainTechnology.Solana: {
        const solanaTransaction = data as PropertiesOf<SolanaTransaction>;
        return new SolanaTransaction(
          solanaTransaction.chainId,
          solanaTransaction.hash,
          solanaTransaction.timestamp,
          solanaTransaction.slot,
          solanaTransaction.err,
          solanaTransaction.memo,
          solanaTransaction.measurementDate,
        );
      }

      case EChainTechnology.EVM: {
        const evmTransaction = data as PropertiesOf<EVMTransaction>;
        return new EVMTransaction(
          evmTransaction.chain,
          evmTransaction.hash,
          evmTransaction.timestamp,
          evmTransaction.blockHeight,
          evmTransaction.to,
          evmTransaction.from,
          evmTransaction.value,
          evmTransaction.gasPrice,
          evmTransaction.contractAddress,
          evmTransaction.input,
          evmTransaction.methodId,
          evmTransaction.functionName,
          evmTransaction.events,
          evmTransaction.measurementDate,
        );
      }

      case EChainTechnology.Sui: {
        const suiTransaction = data as PropertiesOf<SuiTransaction>;
        return new SuiTransaction(
          suiTransaction.chain,
          suiTransaction.hash,
          suiTransaction.timestamp,
          suiTransaction.to,
          suiTransaction.from,
          suiTransaction.value,
          suiTransaction.gasPrice,
          suiTransaction.contractAddress,
          suiTransaction.input,
          suiTransaction.methodId,
          suiTransaction.functionName,
          null, // TODO: fix whatever is going on with events
          suiTransaction.measurementDate,
        );
      }

      default:
        throw new Error("chain ID does not match known technology");
    }
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
