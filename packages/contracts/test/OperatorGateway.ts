import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("OperatorGateway Local Functions", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOperatorGateway() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const KEYID = "TAp_FZMZshG7RuJhiObFTQ";
    const QX =
      "0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5";
    const QY =
      "0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f";

    const gateway = await hre.ethers.deployContract("OperatorGateway", []);
    await gateway.initialize(
      [owner.address],
      "0x000000000000000000000000000000000000dEaD",
    );

    return {
      gateway,
      owner,
      otherAccount,
      KEYID,
    };
  }

  describe("ERC7529 Functions", function () {
    it("Test adding and removing an eTLD+1 domain", async function () {
      const { gateway, owner } = await loadFixture(deployOperatorGateway);

      const domain = "snickerdoodle.com";
      await expect(gateway.addERC7529Domain(domain))
        .to.emit(gateway, "AddERC7529Domain")
        .withArgs(domain);

      await expect(gateway.removeERC7529Domain(domain))
        .to.emit(gateway, "RemoveERC7529Domain")
        .withArgs(domain);
    });
  });
});
