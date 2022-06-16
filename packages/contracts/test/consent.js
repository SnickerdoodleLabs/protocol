const { expect } = require("chai");
const { ethers } = require("hardhat");

async function getSignature(address, nonce, agreementURI) {
  // Create a wallet to sign the message with
  // use the private key to sign with the same wallet hardhat node provides
  // this private key was obtained through running 'npx hardhat node'
  let privateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  let wallet = new ethers.Wallet(privateKey);
  //let message = address + nonce + agreementURI;

  var msgHash = ethers.utils.solidityKeccak256(
    ["address", "uint256", "string"],
    [address, nonce, agreementURI],
  );

  // Sign the string message
  // This step represents a business user signing a message for an approved user on their platform
  let sig = await wallet.signMessage(ethers.utils.arrayify(msgHash));

  return sig;
}

describe("Consent", () => {
  // declare variables to be used in tests
  let Consent;
  let consent;
  let accounts;

  const requesterRoleBytes = ethers.utils.id("REQUESTER_ROLE");
  const pauserRoleBytes = ethers.utils.id("PAUSER_ROLE");
  const defaultAdminRoleBytes = ethers.utils.formatBytes32String(0); //bytes for DEFAULT_ADMIN_ROLE on the contract is 0 by default

  beforeEach(async () => {
    // get a list of signers the tests can use
    accounts = await hre.ethers.getSigners();

    // deploy the Consent contract before each test
    Consent = await ethers.getContractFactory("Consent");

    consent = await Consent.deploy();
    await consent.deployed();

    // initialize the contract
    await consent.initialize(
      accounts[0].address,
      "www.businessuri.com",
      "Business1",
    );
  });

  describe("optIn", function () {
    it("Allows any address to opt-in.", async function () {
      // call opt in with an account that did not deploy the contract
      await consent.connect(accounts[1]).optIn(1, "www.uri.com/1");

      // check token balance of the account has 1
      expect(await consent.balanceOf(accounts[1].address)).to.eq(1);
    });

    it("Does not allow opt-ins when function is disabled.", async function () {
      // disable open opt ins
      await consent.disableOpenOptIn();

      await expect(consent.optIn(1, "www.uri.com/1")).to.revertedWith(
        "Consent: Open opt-ins are currently disabled",
      );
    });

    it("Does not allow opt-ins when function is paused.", async function () {
      // pause the contract
      await consent.pause();

      await expect(consent.optIn(1, "www.uri.com/1")).to.revertedWith(
        "Pausable: paused",
      );
    });

    it("Does not allow opt-ins with an existent token id.", async function () {
      // call opt in with an account that did not deploy the contract
      await consent.connect(accounts[1]).optIn(1, "www.uri.com/1");

      // call opt in with another account but using the same token it
      await expect(
        consent.connect(accounts[2]).optIn(1, "www.uri.com/1"),
      ).to.revertedWith("ERC721: token already minted");
    });
  });

  describe("restrictedOptIn", function () {
    it("Allows user who as been signed for to opt-in", async function () {
      // Business user signs user 1's address
      // pass in address in lowercase to match Solidity string conversion
      let sig = await getSignature(accounts[1].address, 1, "www.uri.com/1");

      // User 1 can now call restricted opt in if business entity has signed to approve them
      await consent
        .connect(accounts[1])
        .restrictedOptIn(1, "www.uri.com/1", 1, sig);
    });

    it("Does not allows user who has not been signed for to opt-in", async function () {
      // Business user signs user 1's address
      // pass in address in lowercase to match Solidity string conversion
      let sig = await getSignature(
        accounts[1].address.toLowerCase(),
        1,
        "www.uri.com/1",
      );

      // User 10 tries to call restricted opt in using signature the business entity signed for User 1
      await expect(
        consent
          .connect(accounts[10])
          .restrictedOptIn(1, "www.uri.com/1", 1, sig),
      ).to.revertedWith("Consent: Contract owner did not sign this message");
    });

    it("Does not allow opt-ins when function is paused.", async function () {
      // Business user signs user 1's address
      // pass in address in lowercase to match Solidity string conversion
      let sig = await getSignature(
        accounts[1].address.toLowerCase(),
        1,
        "www.uri.com/1",
      );

      // pause the contract
      await consent.pause();

      // User 1 can now call restricted opt in if business entity has signed to approve them
      await expect(
        consent
          .connect(accounts[1])
          .restrictedOptIn(1, "www.uri.com/1", 1, sig),
      ).to.revertedWith("Pausable: paused");
    });

    it("Does not allow restricted opt-ins with an existent token id.", async function () {
      // Business user signs user 1's address
      // pass in address in lowercase to match Solidity string conversion
      let sig = await getSignature(
        accounts[1].address.toLowerCase(),
        1,
        "www.uri.com/1",
      );

      // User 1 can now call restricted opt in if business entity has signed to approve them
      await consent
        .connect(accounts[1])
        .restrictedOptIn(1, "www.uri.com/1", 1, sig);

      // User 1 tried to call again with the same token id
      await expect(
        consent
          .connect(accounts[1])
          .restrictedOptIn(1, "www.uri.com/1", 1, sig),
      ).to.revertedWith("ERC721: token already minted");
    });

    it("Does not allow approved user to call restricted opt-ins with a different token id.", async function () {
      // Business user signs user 1's address
      // pass in address in lowercase to match Solidity string conversion
      let sig = await getSignature(
        accounts[1].address.toLowerCase(),
        1,
        "www.uri.com/1",
      );

      // User 1 can now call restricted opt in if business entity has signed to approve them
      await consent
        .connect(accounts[1])
        .restrictedOptIn(1, "www.uri.com/1", 1, sig);

      // User 2 tries to call restricted opt in again with another token Id
      await expect(
        consent
          .connect(accounts[1])
          .restrictedOptIn(1, "www.uri.com/1", 2, sig),
      ).to.revertedWith("Consent: Contract owner did not sign this message");
    });
  });

  describe("optOut", function () {
    it("Allows any address to opt-out after opting-in.", async function () {
      // call opt in with an account that did not deploy the contract
      await consent.connect(accounts[1]).optIn(1, "www.uri.com/1");

      // call opt out
      await consent.connect(accounts[1]).optOut(1);

      // check token balance of the account has none.
      expect(await consent.balanceOf(accounts[1].address)).to.eq(0);

      // check that total supply is descreased to 0
      expect(await consent.totalSupply()).to.eq(0);
    });

    it("Does not allow an address to opt-out another user's token.", async function () {
      // call opt in with an account that did not deploy the contract
      await consent.connect(accounts[1]).optIn(1, "www.uri.com/1");

      // call opt out with another account that does not own the token
      await expect(consent.connect(accounts[2]).optOut(1)).to.revertedWith(
        "ERC721Burnable: caller is not owner nor approved",
      );
    });
  });

  describe("requestForData", function () {
    it("Allows the REQUESTER_ROLE to request for data and emits RequestForData with the correct arguments", async function () {
      // call opt in with an account that did not deploy the contract
      await expect(consent.requestForData("cid123"))
        .to.emit(consent, "RequestForData")
        .withArgs(accounts[0].address, "cid123");
    });

    it("Does not allow non-REQUESTER_ROLE addresses to request for data", async function () {
      // call opt in with an account that did not deploy the contract
      await expect(
        consent.connect(accounts[1]).requestForData("cid123"),
      ).to.revertedWith(
        `AccessControl: account ${accounts[1].address.toLowerCase()} is missing role ${requesterRoleBytes}`,
      );
    });
  });

  describe("safeTransferFrom", function () {
    // safeTransferFrom is an overloaded function and is hence called differently in ethers.js

    it("Does not allow token owner to transfer Consent token after opting-in.", async function () {
      // call opt in with an account that did not deploy the contract
      await consent.connect(accounts[1]).optIn(1, "www.uri.com/1");

      // check token balance of the account has 1
      await expect(
        consent
          .connect(accounts[1])
          ["safeTransferFrom(address,address,uint256)"](
            accounts[1].address,
            accounts[2].address,
            1,
          ),
      ).to.revertedWith("Consent: Consent tokens are non-transferrable");
    });

    it("Does not allow contract owner/any other address to transfer Consent token after opting-in.", async function () {
      // call opt in with an account that did not deploy the contract
      await consent.connect(accounts[1]).optIn(1, "www.uri.com/1");

      // check token balance of the account has 1
      await expect(
        consent["safeTransferFrom(address,address,uint256)"](
          accounts[1].address,
          accounts[2].address,
          1,
        ),
      ).to.revertedWith("ERC721: transfer caller is not owner nor approved");

      // check token balance of the account has 1
      await expect(
        consent
          .connect(accounts[2])
          ["safeTransferFrom(address,address,uint256)"](
            accounts[1].address,
            accounts[2].address,
            1,
          ),
      ).to.revertedWith("ERC721: transfer caller is not owner nor approved");
    });
  });

  describe("burn", function () {
    it("Allow token owner to burn their Consent token after opting-in.", async function () {
      // call opt in with an account that did not deploy the contract
      await consent.connect(accounts[1]).optIn(1, "www.uri.com/1");

      // call burn
      await consent.connect(accounts[1]).burn(1);

      // check token balance of the account has none.
      expect(await consent.balanceOf(accounts[1].address)).to.eq(0);

      // check that total supply is descreased to 0
      expect(await consent.totalSupply()).to.eq(0);
    });

    it("Does not allow others to burn a user's Consent token.", async function () {
      // call opt in with an account that did not deploy the contract
      await consent.connect(accounts[1]).optIn(1, "www.uri.com/1");

      // call burn with admin
      await expect(consent.burn(1)).to.revertedWith("");

      // call burn with another user address
      await expect(consent.connect(accounts[2]).burn(1)).to.revertedWith("");
    });
  });

  describe("pause", function () {
    it("Allows address with PAUSER_ROLE to pause the contract", async function () {
      await consent.pause();

      expect(await consent.paused()).to.eq(true);
    });

    it("Does not allows address without PAUSER_ROLE to pause the contract", async function () {
      await consent.pause();

      expect(await consent.paused()).to.eq(true);
    });
  });

  describe("unpause", function () {
    it("Allows address with PAUSER_ROLE to unpause the contract", async function () {
      await consent.pause();
      await consent.unpause();

      expect(await consent.paused()).to.eq(false);
    });

    it("Does not allows address without PAUSER_ROLE to pause the contract", async function () {
      await consent.pause();
      await consent.unpause();

      expect(await consent.paused()).to.eq(false);
    });
  });

  describe("disableOpenOptIn", function () {
    it("Does not allow open opt-ins after address with PAUSER_ROLE disables it.", async function () {
      // disable open opt ins
      await consent.disableOpenOptIn();

      await expect(consent.optIn(1, "www.uri.com/1")).to.revertedWith(
        "Consent: Open opt-ins are currently disabled",
      );
    });

    it("Does not allows address without PAUSER_ROLE to disable the open opt-in.", async function () {
      await expect(
        consent.connect(accounts[1]).disableOpenOptIn(),
      ).to.revertedWith(
        `AccessControl: account ${accounts[1].address.toLowerCase()} is missing role ${pauserRoleBytes}`,
      );
    });
  });

  describe("enableOpenOptIn", function () {
    it("Allow open opt-ins after address with PAUSER_ROLE enables it.", async function () {
      // disable open opt ins
      await consent.disableOpenOptIn();

      await expect(consent.optIn(1, "www.uri.com/1")).to.revertedWith(
        "Consent: Open opt-ins are currently disabled",
      );

      // enable open opt ins
      await consent.enableOpenOptIn();

      await expect(consent.optIn(1, "www.uri.com/1"));
    });

    it("Does not allows address without PAUSER_ROLE to enable open opt-in.", async function () {
      await expect(
        consent.connect(accounts[1]).enableOpenOptIn(),
      ).to.revertedWith(
        `AccessControl: account ${accounts[1].address.toLowerCase()} is missing role ${pauserRoleBytes}`,
      );
    });
  });

  describe("setBaseURI", function () {
    it("Allows DEFAULT_ADMIN_ROLE to update the base URI.", async function () {
      // set uri
      await consent.setBaseURI("www.newURI.com");

      expect(await consent.baseURI()).to.eq("www.newURI.com");
    });

    it("Does not allow address without DEFAULT_ADMIN_ROLE to update the baseURI", async function () {
      await expect(
        consent.connect(accounts[1]).setBaseURI("www.newURI.com"),
      ).to.revertedWith(
        `AccessControl: account ${accounts[1].address.toLowerCase()} is missing role ${defaultAdminRoleBytes}`,
      );
    });
  });

  describe("setTrustedForwarder", function () {
    it("Allows DEFAULT_ADMIN_ROLE to update the trusted forwarder address.", async function () {
      // set trusted forwarder address
      await consent.setTrustedForwarder(
        "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
      );

      expect(await consent.trustedForwarder()).to.eq(
        "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
      );
    });

    it("Does not allow address without DEFAUL_ADMIN_ROLE to update the forwarder address.", async function () {
      await expect(
        consent
          .connect(accounts[1])
          .setTrustedForwarder("0xdD2FD4581271e230360230F9337D5c0430Bf44C0"),
      ).to.revertedWith(
        `AccessControl: account ${accounts[1].address.toLowerCase()} is missing role ${defaultAdminRoleBytes}`,
      );
    });
  });

  describe("tokenURI", function () {
    it("Returns the correct token uri", async function () {
      // call opt in with an account that did not deploy the contract
      await consent
        .connect(accounts[1])
        .optIn(1, "/age?=1/location?=0/gender?=0");

      expect(await consent.tokenURI(1)).to.eq(
        "www.businessuri.com/age?=1/location?=0/gender?=0",
      );
    });
  });

  describe("supportInterface", function () {
    it("Returns true that EIP165 interface is supported", async function () {
      expect(await consent.supportsInterface(0x01ffc9a7)).to.eq(true);
    });
  });
});
