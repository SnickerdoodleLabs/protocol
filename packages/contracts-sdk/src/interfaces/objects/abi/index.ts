import ConsentAbi from "@contracts-sdk/interfaces/objects/abi/ConsentAbi.js";
import ConsentFactoryAbi from "@contracts-sdk/interfaces/objects/abi/ConsentFactoryAbi.js";
import ERC20Abi from "@contracts-sdk/interfaces/objects/abi/ERC20Abi.js";
import ERC20RewardAbi from "@contracts-sdk/interfaces/objects/abi/ERC20RewardAbi.js";
import ERC721RewardAbi from "@contracts-sdk/interfaces/objects/abi/ERC721RewardAbi.js";
import ERC7529Abi from "@contracts-sdk/interfaces/objects/abi/ERC7529Abi.js";
import QuestionnairesAbi from "@contracts-sdk/interfaces/objects/abi/QuestionnairesAbi.js";
import ZkSyncERC721RewardAbi from "@contracts-sdk/interfaces/objects/abi/ZkSyncERC721RewardAbi.js";

export const ContractsAbis = {
  ConsentFactoryAbi: ConsentFactoryAbi,
  ConsentAbi: ConsentAbi,
  ERC721Reward: ERC721RewardAbi,
  ERC7529Abi: ERC7529Abi,
  ZkSyncERC721RewardAbi: ZkSyncERC721RewardAbi,
  ERC20Reward: ERC20RewardAbi,
  QuestionnairesAbi: QuestionnairesAbi,
};
