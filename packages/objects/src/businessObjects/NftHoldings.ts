import { TokenAddress } from "@objects/businessObjects";
import { EChain} from "@objects/enum";


export class NftHolding{
  public constructor(
    public chain : keyof typeof EChain | "not registered",
    public tokenAddress: TokenAddress,
    public amount : number,
    public name :string,
  ) {}
}
