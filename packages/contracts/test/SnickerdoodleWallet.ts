import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("SnickerdoodleWallet", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySnickerdoodleWallet() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const KEYID = "TAp_FZMZshG7RuJhiObFTQ";
    const QX =
      "0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5";
    const QY =
      "0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f";

    const sdwallet = await hre.ethers.deployContract("SnickerdoodleWallet", []);
    await sdwallet.initialize(owner.address, { keyId: KEYID, x: QX, y: QY }, [
      owner,
    ]);
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
      const { sdwallet, KEYID } = await loadFixture(deploySnickerdoodleWallet);

      const AUTH_DATA_BYTES = `0x${"d8a0bf4f8294146ab009857f0c54e7b47dd13980a9ce558becd61dbced0bd8411900000000"}`;
      const CLIENT_DATA_JSON_LEFT = '{"type":"webauthn.get","challenge":"';
      const CLIENT_DATA_JSON_RIGHT =
        '","origin":"https://toddchapman.io","crossOrigin":false}';

      const CHALLENGE = "0x9fEad8B19C044C2f404dac38B925Ea16ADaa2954";

      const R_VALUE =
        "0x0895fecc5c53fe1d33888913da1a4f0cd0703e044cd61e559af5589b5ff1943b";
      const S_VALUE =
        "0xc958635b00097bf5f3ae74cdb366c38be69e19b0c48dd228164bc83043c0ff0b";

      // This function should pass without throwing an error to pass P256 verification
      await expect(
        sdwallet.addEVMAddressWithP256Key(
          KEYID,
          {
            authenticatorData: AUTH_DATA_BYTES,
            clientDataJSONLeft: CLIENT_DATA_JSON_LEFT,
            clientDataJSONRight: CLIENT_DATA_JSON_RIGHT,
          },
          CHALLENGE,
          {
            r: R_VALUE,
            s: S_VALUE,
          },
        ),
      )
        .to.emit(sdwallet, "EVMAccountAdded")
        .withArgs(CHALLENGE);

      // This function should throw an error since the P256 signature has already been used
      await expect(
        sdwallet.addEVMAddressWithP256Key(
          KEYID,
          {
            authenticatorData: AUTH_DATA_BYTES,
            clientDataJSONLeft: CLIENT_DATA_JSON_LEFT,
            clientDataJSONRight: CLIENT_DATA_JSON_RIGHT,
          },
          CHALLENGE,
          {
            r: R_VALUE,
            s: S_VALUE,
          },
        ),
      ).to.be.revertedWith("P256 signature already used.");
    });

    it("Add a P256 key with an existing P256 key", async function () {
      const { sdwallet, KEYID } = await loadFixture(deploySnickerdoodleWallet);

      const NEW_KEYID = "JH-njR4k8ML7Oy7-LlUFmA";
      const NEW_QX =
        "0xe08d76826ed6e9f0a60cdf7a751579216e5f6db52049861d56041ab4341b9037";
      const NEW_QY =
        "0x97508faea6ba8ed1f1ddae1274a789c46460687d828429ea3a371f99de9388b7";
      const AUTH_DATA_BYTES = `0x${"d8a0bf4f8294146ab009857f0c54e7b47dd13980a9ce558becd61dbced0bd8411900000000"}`;
      const CLIENT_DATA_JSON_LEFT = '{"type":"webauthn.get","challenge":"';
      const CLIENT_DATA_JSON_RIGHT =
        '","origin":"https://toddchapman.io","crossOrigin":false}';
      const R_VALUE =
        "0xec7a86b27b7483ada3ef26e8438cbca2b6ddab27d3b28bb58c7378b3064b7fc0";
      const S_VALUE =
        "0xa40a69494f527dbee67f4643939a62a9d76ee74b0231a25c91a42e6eb9b95550";

      // This function should pass without throwing an error to pass P256 verification
      await expect(
        sdwallet.addP256KeyWithP256Key(
          KEYID,
          {
            authenticatorData: AUTH_DATA_BYTES,
            clientDataJSONLeft: CLIENT_DATA_JSON_LEFT,
            clientDataJSONRight: CLIENT_DATA_JSON_RIGHT,
          },
          {
            keyId: NEW_KEYID,
            x: NEW_QX,
            y: NEW_QY,
          },
          {
            r: R_VALUE,
            s: S_VALUE,
          },
        ),
      ).to.emit(sdwallet, "P256KeyAdded");

      await expect(
        sdwallet.addP256KeyWithP256Key(
          KEYID,
          {
            authenticatorData: AUTH_DATA_BYTES,
            clientDataJSONLeft: CLIENT_DATA_JSON_LEFT,
            clientDataJSONRight: CLIENT_DATA_JSON_RIGHT,
          },
          {
            keyId: NEW_KEYID,
            x: NEW_QX,
            y: NEW_QY,
          },
          {
            r: R_VALUE,
            s: S_VALUE,
          },
        ),
      ).to.be.revertedWith("P256 signature already used.");
    });

    it("Use EVM Account to add and EVM Account", async function () {
      const { sdwallet, otherAccount } = await loadFixture(
        deploySnickerdoodleWallet,
      );

      await expect(sdwallet.addEVMAccountWithEVMAccount(otherAccount.address))
        .to.emit(sdwallet, "EVMAccountAdded")
        .withArgs(otherAccount.address);

      await expect(
        sdwallet.addEVMAccountWithEVMAccount(otherAccount.address),
      ).to.be.revertedWith("EVM address already added to the wallet");
    });
  });

  describe("Withdraw functions", function () {
    it("Withdraw vanillaToken from the Snickerdoodle Wallet", async function () {
      const { sdwallet, vanillaToken, owner } = await loadFixture(
        deploySnickerdoodleWallet,
      );

      await expect(
        sdwallet.withdrawLocalERC20Asset(await vanillaToken.getAddress()),
      ).to.changeTokenBalances(
        vanillaToken,
        [await sdwallet.getAddress(), owner.address],
        ["-1000000000000000000000", "1000000000000000000000"],
      );
    });
  });
});