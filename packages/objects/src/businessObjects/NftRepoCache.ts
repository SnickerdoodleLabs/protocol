import { WalletNftWithHistory } from "@objects/businessObjects/versioned/WalletNFTHistory.js";
import { EChain } from "@objects/enum/index.js";
import { AccountAddress } from "@objects/primitives/AccountAddress.js";
import { NftTokenAddressWithTokenId } from "@objects/primitives/NftTokenAddressWithTokenId.js";
import { UnixTimestamp } from "@objects/primitives/UnixTimestamp.js";

export type NftRepositoryCache = Map<
  EChain,
  {
    data: Map<
      AccountAddress,
      Map<NftTokenAddressWithTokenId, WalletNftWithHistory>
    >;
    lastUpdateTime: UnixTimestamp;
  }
>;
