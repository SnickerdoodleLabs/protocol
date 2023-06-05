import { ChainComponentStatus } from "@objects/businessObjects";
import { EChain, EIndexer, EDataProvider } from "@objects/enum";
import { EComponentStatus } from "@objects/enum/EComponentStatus";
import { EIndexerFunction } from "@objects/enum/EIndexerFunction";

export class ComponentStatus {
  public constructor(
    public primaryProvider: EComponentStatus,
    public secondaryProvider: EComponentStatus,
    public alchemyIndexer: Map<EChain, EComponentStatus>,
    public etherscanIndexer: Map<EChain, EComponentStatus>,
    public moralisIndexer: Map<EChain, EComponentStatus>,
    public nftScanIndexer: Map<EChain, EComponentStatus>,
    public oklinkIndexer: Map<EChain, EComponentStatus>,
    public chainStatus: ChainComponentStatus[],
  ) {}
}
