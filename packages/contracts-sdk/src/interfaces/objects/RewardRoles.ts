import { ethers } from "ethers";

const minterRoleBytes = ethers.utils.id("MINTER_ROLE"); // 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6
const defaultAdminRoleBytes =
  "0x0000000000000000000000000000000000000000000000000000000000000000"; //bytes for DEFAULT_ADMIN_ROLE on the contract is 0 by default

export enum RewardRoles {
  DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000",
  MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
}
