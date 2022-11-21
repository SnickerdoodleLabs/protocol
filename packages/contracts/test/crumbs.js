const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Crumbs", () => {
  // declare variables to be used in tests
  let Crumbs;
  let crumbs;
  let accounts;
  let trustedForwarder;

  const defaultAdminRoleBytes = ethers.utils.formatBytes32String(0); //bytes for DEFAULT_ADMIN_ROLE on the contract is 0 by default

  beforeEach(async () => {
    // get a list of signers the tests can use
    accounts = await hre.ethers.getSigners();

    trustedForwarder = accounts[19];

    // deploy the Crumbs contract before each test
    Crumbs = await ethers.getContractFactory("Crumbs");

    crumbs = await Crumbs.deploy(trustedForwarder.address, "www.crumbs.com/");

    await crumbs.deployed();
  });

  describe("createCrumb", function () {
    it("Allows any address to create a crumb.", async function () {
      // accounts 1 creates a crumb
      await crumbs
        .connect(accounts[1])
        .createCrumb(
          1,
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        );

      // check token balance of the account has 1
      const tokenCount = await crumbs.balanceOf(accounts[1].address);
      expect(tokenCount).to.eq(1);

      // check token's uri
      const tokenURI = await crumbs.tokenURI(1);
      expect(tokenURI).to.eq(
        "www.crumbs.com/0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      );
    });

    it("Does not allow creating the with a crumb id that exists.", async function () {
      // accounts 1 creates a crumb with id 1
      await crumbs
        .connect(accounts[1])
        .createCrumb(
          1,
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        );

      // accounts 2 creates a crumb with id 1 as well
      await expect(
        crumbs
          .connect(accounts[2])
          .createCrumb(
            1,
            "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
          ),
      ).to.revertedWith("ERC721: token already minted");
    });

    it("Does not allow an address to create another crumb if it already has a crumb mapped to it.", async function () {
      // accounts 1 creates a crumb
      await crumbs
        .connect(accounts[1])
        .createCrumb(
          1,
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        );

      // accounts 1 tries to create another crumb
      await expect(
        crumbs
          .connect(accounts[1])
          .createCrumb(
            2,
            "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
          ),
      ).to.revertedWith("Crumb: Address already has a crumb");
    });

    it("Once a crumb is created, it is not transferable", async function () {
      // accounts 1 creates a crumb
      await crumbs
        .connect(accounts[1])
        .createCrumb(
          1,
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        );

      // accounts 1 transfers away his crumb
      await expect(
        crumbs
          .connect(accounts[1])
          .transferFrom(accounts[1].address, accounts[2].address, 1),
      ).to.revertedWith("Crumbs: Crumb tokens are non-transferrable");
    });

    it("Once a crumb is created, it can be burnt and the owner can create a new one.", async function () {
      // accounts 1 creates a crumb
      await crumbs
        .connect(accounts[1])
        .createCrumb(
          1,
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        );

      // accounts 1 creates a crumb
      await crumbs.connect(accounts[1]).burnCrumb(1);

      // accounts 1 creates a crumb
      await crumbs
        .connect(accounts[1])
        .createCrumb(
          1,
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        );
    });
  });

  describe("transferFrom", function () {
    it("Scenario 1: Someone else tries to transfer of owner's tokens, transaction reverts and the crumb id is still in original state.", async function () {
      // accounts 1 creates a crumb
      await crumbs
        .connect(accounts[1])
        .createCrumb(
          1,
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        );

      // account 2 tries to transfer away account 1's token, fails
      await expect(
        crumbs
          .connect(accounts[2])
          .transferFrom(accounts[1].address, accounts[2].address, 1),
      ).to.revertedWith("ERC721: caller is not token owner nor approved");

      // check if account 1 still owns crumb id 1
      const crumbId = await crumbs.addressToCrumbId(accounts[1].address);
      expect(crumbId).to.eq(1);
    });

    it("Scenario 2: Owner tries to transfer of other's tokens, transaction reverts and the crumb id is still in original state.", async function () {
      // accounts 1 creates a crumb
      await crumbs
        .connect(accounts[1])
        .createCrumb(
          1,
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        );

      // accounts 1 creates a crumb
      await crumbs
        .connect(accounts[2])
        .createCrumb(
          2,
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff81",
        );

      // account 1 tries to transfer accounts 2's token to himself, fails
      await expect(
        crumbs
          .connect(accounts[1])
          .transferFrom(accounts[2].address, accounts[1].address, 2),
      ).to.revertedWith("ERC721: caller is not token owner nor approved");

      // check if account 1 still owns crumb id 1
      const crumbId1 = await crumbs.addressToCrumbId(accounts[1].address);
      expect(crumbId1).to.eq(1);

      // check if account 2 still owns crumb id 2
      const crumbId2 = await crumbs.addressToCrumbId(accounts[2].address);
      expect(crumbId2).to.eq(2);
    });
  });

  describe("burnCrumb", function () {
    it("Allows any address to burn its crumb", async function () {
      // accounts 1 creates a crumb
      await crumbs
        .connect(accounts[1])
        .createCrumb(
          1,
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        );

      // accounts 1 burns his crumb
      await crumbs.connect(accounts[1]).burnCrumb(1);

      // check token balance of the account has none.
      expect(await crumbs.balanceOf(accounts[1].address)).to.eq(0);

      // check that total supply is decreased to 0
      expect(await crumbs.totalSupply()).to.eq(0);
    });

    it("Address burns crumb, another user can use the crumb id", async function () {
      // accounts 1 creates a crumb
      await crumbs
        .connect(accounts[1])
        .createCrumb(
          1,
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        );

      // accounts 1 burns his crumb
      await crumbs.connect(accounts[1]).burnCrumb(1);

      // accounts 2 creates a crumb with the burnt id
      await crumbs
        .connect(accounts[2])
        .createCrumb(
          1,
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        );

      // check token balance of the account has none.
      expect(await crumbs.balanceOf(accounts[1].address)).to.eq(0);
      expect(await crumbs.balanceOf(accounts[2].address)).to.eq(1);

      // check that total supply is correct
      expect(await crumbs.totalSupply()).to.eq(1);
    });

    it("Does not allow an address to burn another user's crumb.", async function () {
      await crumbs
        .connect(accounts[1])
        .createCrumb(
          1,
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        );

      await expect(crumbs.connect(accounts[2]).burnCrumb(1)).to.revertedWith(
        "ERC721: caller is not token owner nor approved",
      );
    });
  });

  describe("updateCrumb", function () {
    it("Allows owner to update its crumb", async function () {
      // accounts 1 creates a crumb
      await crumbs
        .connect(accounts[1])
        .createCrumb(
          1,
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        );

      // accounts 1 updates his crumb
      await expect(crumbs.connect(accounts[1]).updateCrumb(1, "newuri"))
        .to.emit(crumbs, "CrumbUpdated")
        .withArgs(accounts[1].address, 1, "newuri");

      const newURI = await crumbs.tokenURI(1);
      expect(newURI).to.eq("www.crumbs.com/newuri");
    });

    it("Does not allow an address to update another user's crumb.", async function () {
      await crumbs
        .connect(accounts[1])
        .createCrumb(
          1,
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        );

      await expect(
        crumbs.connect(accounts[2]).updateCrumb(1, "newuri"),
      ).to.revertedWith("Crumbs: Caller is not crumb id's owner");
    });
  });

  describe("setBaseURI", function () {
    it("Sets the baseURI", async function () {
      await crumbs.connect(accounts[0]).setBaseURI("www.crumbs.com");

      const currentURI = await crumbs.baseURI();
      // check token balance of the account has none.
      expect(currentURI).to.eq("www.crumbs.com");
    });

    it("Address without DEFAULT_ADMIN_ROLE sets baseURI.", async function () {
      await expect(
        crumbs.connect(accounts[1]).setBaseURI("www.crumbs.com"),
      ).to.revertedWith(
        `AccessControl: account ${accounts[1].address.toLowerCase()} is missing role ${defaultAdminRoleBytes}`,
      );
    });
  });

  describe("supportInterface", function () {
    it("Returns true that EIP165 interface is supported", async function () {
      expect(await crumbs.supportsInterface(0x01ffc9a7)).to.eq(true);
    });
  });
});
