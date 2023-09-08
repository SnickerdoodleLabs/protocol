import { ContainerModule, interfaces } from "inversify";

import {
  IMasterIndexer,
  IMasterIndexerType,
  IAlchemyIndexerType,
  IAnkrIndexerType,
  ICovalentEVMTransactionRepositoryType,
  IEtherscanIndexerType,
  IEVMIndexer,
  IMoralisEVMPortfolioRepositoryType,
  INftScanEVMPortfolioRepositoryType,
  IOklinkIndexerType,
  IPoapRepositoryType,
  IPolygonIndexerType,
  ISimulatorEVMTransactionRepositoryType,
  ISolanaIndexer,
  ISolanaIndexerType,
} from "@indexers/interfaces/index.js";
import { MasterIndexer } from "@indexers/MasterIndexer.js";
import {
  AnkrIndexer,
  AlchemyIndexer,
  CovalentEVMTransactionRepository,
  EtherscanIndexer,
  MoralisEVMPortfolioRepository,
  NftScanEVMPortfolioRepository,
  OklinkIndexer,
  PoapRepository,
  PolygonIndexer,
  SimulatorEVMTransactionRepository,
  SolanaIndexer,
} from "@indexers/providers/index.js";

export const indexersModule = new ContainerModule(
  (
    bind: interfaces.Bind,
    _unbind: interfaces.Unbind,
    _isBound: interfaces.IsBound,
    _rebind: interfaces.Rebind,
  ) => {
    bind<IMasterIndexer>(IMasterIndexerType)
      .to(MasterIndexer)
      .inSingletonScope();

    /* EVM compatible Indexers */
    bind<IEVMIndexer>(IAnkrIndexerType).to(AnkrIndexer).inSingletonScope();
    bind<IEVMIndexer>(IAlchemyIndexerType)
      .to(AlchemyIndexer)
      .inSingletonScope();

    bind<IEVMIndexer>(ICovalentEVMTransactionRepositoryType)
      .to(CovalentEVMTransactionRepository)
      .inSingletonScope();

    bind<IEVMIndexer>(IEtherscanIndexerType)
      .to(EtherscanIndexer)
      .inSingletonScope();

    bind<IEVMIndexer>(IMoralisEVMPortfolioRepositoryType)
      .to(MoralisEVMPortfolioRepository)
      .inSingletonScope();

    bind<IEVMIndexer>(INftScanEVMPortfolioRepositoryType)
      .to(NftScanEVMPortfolioRepository)
      .inSingletonScope();

    bind<IEVMIndexer>(IOklinkIndexerType).to(OklinkIndexer).inSingletonScope();

    bind<IEVMIndexer>(IPoapRepositoryType)
      .to(PoapRepository)
      .inSingletonScope();

    bind<IEVMIndexer>(IPolygonIndexerType)
      .to(PolygonIndexer)
      .inSingletonScope();

    bind<IEVMIndexer>(ISimulatorEVMTransactionRepositoryType)
      .to(SimulatorEVMTransactionRepository)
      .inSingletonScope();

    /* Solana Indexers */
    bind<ISolanaIndexer>(ISolanaIndexerType)
      .to(SolanaIndexer)
      .inSingletonScope();
  },
);