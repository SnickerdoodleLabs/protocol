import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

import {
  getP256Keys,
  getWebAuthnComponentsForEVMKeyChallenge,
  getWebAuthnComponentsForP256KeyChallenge,
  P256Key,
  WebAuthnComponents,
} from "./helpers";

describe("SnickerdoodleWallet", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployWallet() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const [ownerP256] = getP256Keys();
    const KEYID = ownerP256.keyId;

    const sdwallet = await hre.ethers.deployContract("SnickerdoodleWallet", []);
    await sdwallet.initialize(
      owner.address,
      owner.address,
      "cookie.snickerdoodle",
      [{ keyId: ownerP256.keyId, x: ownerP256.x, y: ownerP256.y }],
      [owner.address],
    );
    const sdwalletAddress = await sdwallet.getAddress();

    const vanillaToken = await hre.ethers.deployContract("VanillaToken", [
      owner.address,
    ]);
    await vanillaToken.transfer(sdwalletAddress, 1000000000000000000000n); // 1000 tokens

    return {
      sdwallet,
      vanillaToken,
      owner,
      otherAccount,
      KEYID,
    };
  }

  describe("Access Control and Permissioning", function () {
    it("Use P256 to add and EVM Account", async function () {
      const { sdwallet, KEYID } = await loadFixture(deployWallet);

      const webAthnComponents = getWebAuthnComponentsForEVMKeyChallenge();
      const challenge: string = webAthnComponents.challenge as string;

      // This function should pass without throwing an error to pass P256 verification
      await expect(
        sdwallet.addEVMAddressWithP256Key(
          KEYID,
          {
            authenticatorData: webAthnComponents.authenticatorData,
            clientDataJSONLeft: webAthnComponents.clientDataJSONLeft,
            clientDataJSONRight: webAthnComponents.clientDataJSONRight,
          },
          challenge,
          {
            r: webAthnComponents.r,
            s: webAthnComponents.s,
          },
        ),
      )
        .to.emit(sdwallet, "EVMAccountAdded")
        .withArgs(challenge);

      // This function should throw an error since the P256 signature has already been used
      await expect(
        sdwallet.addEVMAddressWithP256Key(
          KEYID,
          {
            authenticatorData: webAthnComponents.authenticatorData,
            clientDataJSONLeft: webAthnComponents.clientDataJSONLeft,
            clientDataJSONRight: webAthnComponents.clientDataJSONRight,
          },
          challenge,
          {
            r: webAthnComponents.r,
            s: webAthnComponents.s,
          },
        ),
      ).to.be.revertedWithCustomError(sdwallet, "P256NoncedUsed");
    });

    it("Add a P256 key with an existing P256 key", async function () {
      const { sdwallet, KEYID } = await loadFixture(deployWallet);

      const webAthnComponents: WebAuthnComponents =
        getWebAuthnComponentsForP256KeyChallenge();
      const challenge: P256Key = webAthnComponents.challenge as P256Key;

      // This function should pass without throwing an error to pass P256 verification
      await expect(
        sdwallet.addP256KeyWithP256Key(
          KEYID,
          {
            authenticatorData: webAthnComponents.authenticatorData,
            clientDataJSONLeft: webAthnComponents.clientDataJSONLeft,
            clientDataJSONRight: webAthnComponents.clientDataJSONRight,
          },
          {
            keyId: challenge.keyId,
            x: challenge.x,
            y: challenge.y,
          },
          {
            r: webAthnComponents.r,
            s: webAthnComponents.s,
          },
        ),
      ).to.emit(sdwallet, "P256KeyAdded");

      await expect(
        sdwallet.addP256KeyWithP256Key(
          KEYID,
          {
            authenticatorData: webAthnComponents.authenticatorData,
            clientDataJSONLeft: webAthnComponents.clientDataJSONLeft,
            clientDataJSONRight: webAthnComponents.clientDataJSONRight,
          },
          {
            keyId: challenge.keyId,
            x: challenge.x,
            y: challenge.y,
          },
          {
            r: webAthnComponents.r,
            s: webAthnComponents.s,
          },
        ),
      ).to.be.revertedWithCustomError(sdwallet, "P256NoncedUsed");
    });

    it("Use EVM Account to add and EVM Account", async function () {
      const { sdwallet, otherAccount } = await loadFixture(deployWallet);

      await expect(sdwallet.addEVMAccountWithEVMAccount(otherAccount.address))
        .to.emit(sdwallet, "EVMAccountAdded")
        .withArgs(otherAccount.address);

      await expect(
        sdwallet.addEVMAccountWithEVMAccount(otherAccount.address),
      ).to.be.revertedWithCustomError(sdwallet, "KeyAlreadyAdded");
    });
  });

  describe("Withdraw functions", function () {
    it("Withdraw vanillaToken from the Snickerdoodle Wallet", async function () {
      const { sdwallet, vanillaToken, owner } = await loadFixture(deployWallet);

      await expect(
        sdwallet.withdrawLocalERC20Asset(await vanillaToken.getAddress()),
      ).to.changeTokenBalances(
        vanillaToken,
        [await sdwallet.getAddress(), owner.address],
        ["-1000000000000000000000", "1000000000000000000000"],
      );
    });

    it("Withdraw native asset from the Snickerdoodle Wallet", async function () {
      const { sdwallet, owner } = await loadFixture(deployWallet);
      await owner.sendTransaction({
        value: hre.ethers.parseEther("1"),
        to: await sdwallet.getAddress(),
      });

      await expect(sdwallet.withdrawNativeAsset()).to.changeEtherBalances(
        [await sdwallet.getAddress(), owner.address],
        [-1000000000000000000n, 1000000000000000000n],
      );
    });
  });
});
