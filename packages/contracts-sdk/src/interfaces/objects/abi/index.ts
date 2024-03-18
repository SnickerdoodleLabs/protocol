import MinimalForwarderAbi from "@contracts-sdk//interfaces/objects/abi/MinimalForwarder.js";
import ConsentAbi from "@contracts-sdk/interfaces/objects/abi/ConsentAbi.js";
import ConsentFactoryAbi from "@contracts-sdk/interfaces/objects/abi/ConsentFactoryAbi.js";
import CrumbsAbi from "@contracts-sdk/interfaces/objects/abi/CrumbsAbi.js";
import ERC1155RewardAbi from "@contracts-sdk/interfaces/objects/abi/ERC1155RewardAbi.js";
import ERC20Abi from "@contracts-sdk/interfaces/objects/abi/ERC20Abi.js";
import ERC20RewardAbi from "@contracts-sdk/interfaces/objects/abi/ERC20RewardAbi.js";
import ERC721RewardAbi from "@contracts-sdk/interfaces/objects/abi/ERC721RewardAbi.js";
import ERC7529Abi from "@contracts-sdk/interfaces/objects/abi/ERC7529Abi.js";
import OFT20RewardAbi from "@contracts-sdk/interfaces/objects/abi/OFT20RewardAbi.js";
import ONFT721RewardAbi from "@contracts-sdk/interfaces/objects/abi/ONFT721RewardAbi.js";
import SiftAbi from "@contracts-sdk/interfaces/objects/abi/SiftAbi.js";
import ZkSyncERC721RewardAbi from "@contracts-sdk/interfaces/objects/abi/ZkSyncERC721RewardAbi.js";

export const ContractsAbis = {
  ConsentFactoryAbi: ConsentFactoryAbi,
  ConsentAbi: ConsentAbi,
  CrumbsAbi: CrumbsAbi,
  MinimalForwarderAbi: MinimalForwarderAbi,
  SiftAbi: SiftAbi,
  ERC721Reward: ERC721RewardAbi,
  ERC7529Abi: ERC7529Abi,
  ZkSyncERC721RewardAbi: ZkSyncERC721RewardAbi,
  ERC20Reward: ERC20RewardAbi,
  ERC1155Reward: ERC1155RewardAbi,
  OFT20Reward: OFT20RewardAbi,
  ONFT721Reward: ONFT721RewardAbi,
};
