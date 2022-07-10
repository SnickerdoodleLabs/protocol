const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

async function getSignature(owner, address, tokenId, agreementURI) {
  var msgHash = ethers.utils.solidityKeccak256(
    ["address", "uint256", "string"],
    [address, tokenId, agreementURI],
  );

  // Sign the string message
  // This step represents a business user signing a message for an approved user on their platform
  let sig = await owner.signMessage(ethers.utils.arrayify(msgHash));

  return sig;
}

describe("Consent", () => {
  // declare variables to be used in tests
  let Consent;
  let consent;
  let accounts;
  let owner;

  const requesterRoleBytes = ethers.utils.id("REQUESTER_ROLE");
  const pauserRoleBytes = ethers.utils.id("PAUSER_ROLE");
  const defaultAdminRoleBytes = ethers.utils.formatBytes32String(0); //bytes for DEFAULT_ADMIN_ROLE on the contract is 0 by default

  beforeEach(async () => {
    // get a list of signers the tests can use
    accounts = await hre.ethers.getSigners();
    owner = accounts[0];
    user1 = accounts[1];
    trustedForwarder = accounts[19];

    // deploy the Consent contract before each test
    Consent = await ethers.getContractFactory("Consent");
    consent = await Consent.deploy();
    const deployedConsent = await consent.deployed();
    const consentImpAddress = deployedConsent.address;

    // deploy the Consent factory contract before each test
    // the Consent factory also deploys the UpgradeableBeacon contract
    ConsentFactory = await ethers.getContractFactory("ConsentFactory");
    consentFactory = await ConsentFactory.deploy(
      trustedForwarder.address,
      consentImpAddress,
    );
    await consentFactory.deployed();

    // create a consent contract
    await consentFactory
      .connect(owner)
      .createConsent(user1.address, "www.user1uri.com", "USER1");

    const deployedConsentAddressArray =
      await consentFactory.getUserDeployedConsentsByIndex(user1.address, 0, 5);

    consent = await Consent.attach(deployedConsentAddressArray[0]);
  });

  describe("optIn", function () {
    it("Allows any address to opt-in.", async function () {
      // call opt in
      await consent.connect(accounts[1]).optIn(1, "www.uri.com/1");

      // check token balance of the account has 1
      expect(await consent.balanceOf(accounts[1].address)).to.eq(1);
    });

    it("Does not allows address to opt-in twice.", async function () {
      // call opt in
      await consent.connect(accounts[1]).optIn(1, "www.uri.com/1");

      await expect(
        consent.connect(accounts[1]).optIn(1, "www.uri.com/1"),
      ).to.revertedWith("Consent: User has already opted in");

      // check token balance of the account has 1
      expect(await consent.balanceOf(accounts[1].address)).to.eq(1);
    });

    it("Does not allow opt-ins when function is disabled.", async function () {
      // disable open opt ins
      await consent.connect(accounts[1]).disableOpenOptIn();

      await expect(consent.optIn(1, "www.uri.com/1")).to.revertedWith(
        "Consent: Open opt-ins are currently disabled",
      );
    });

    it("Does not allow opt-ins when function is paused.", async function () {
      // pause the contract
      await consent.connect(accounts[1]).pause();

      await expect(consent.optIn(1, "www.uri.com/1")).to.revertedWith(
        "Pausable: paused",
      );
    });

    it("Does not allow opt-ins with an existent token id.", async function () {
      // call opt in
      await consent.connect(accounts[1]).optIn(1, "www.uri.com/1");

      // call opt in with another account but using the same token it
      await expect(
        consent.connect(accounts[2]).optIn(1, "www.uri.com/1"),
      ).to.revertedWith("ERC721: token already minted");
    });
  });

  describe("restrictedOptIn", function () {
    it("Allows user who as been signed for to opt-in", async function () {
      // user1 who is the owner signs user 2's address
      // pass in address in lowercase to match Solidity string conversion
      let sig = await getSignature(
        user1,
        accounts[2].address.toLowerCase(),
        1,
        "www.uri.com/1",
      );

      // User 2 can now call restricted opt in if business entity has signed to approve them
      await consent
        .connect(accounts[2])
        .restrictedOptIn(1, "www.uri.com/1", sig);
    });

    it("Does not allows user to opt-in twice even if signed for", async function () {
      // user1 who is the owner signs user 2's address
      // pass in address in lowercase to match Solidity string conversion
      let sig = await getSignature(
        user1,
        accounts[2].address.toLowerCase(),
        1,
        "www.uri.com/1",
      );

      // user1 who is the owner signs user 2's address
      // pass in address in lowercase to match Solidity string conversion
      let sig2 = await getSignature(
        user1,
        accounts[2].address.toLowerCase(),
        2,
        "www.uri.com/1",
      );

      // User 2 can now call restricted opt in if business entity has signed to approve them
      await consent
        .connect(accounts[2])
        .restrictedOptIn(1, "www.uri.com/1", sig);

      // User 2 tries to now call restricted opt in again with second business signature
      await expect(
        consent.connect(accounts[2]).restrictedOptIn(2, "www.uri.com/1", sig2),
      ).to.revertedWith("Consent: User has already opted in");
    });

    it("Does not allows user who has not been signed for to opt-in", async function () {
      // Business user signs user 2's address
      // pass in address in lowercase to match Solidity string conversion
      let sig = await getSignature(
        user1,
        accounts[2].address.toLowerCase(),
        1,
        "www.uri.com/1",
      );

      // User 10 tries to call restricted opt in using signature the business entity signed for User 1
      await expect(
        consent.connect(accounts[10]).restrictedOptIn(1, "www.uri.com/1", sig),
      ).to.revertedWith("Consent: Contract owner did not sign this message");
    });

    it("Does not allow opt-ins when function is paused.", async function () {
      // Business user signs user 2's address
      // pass in address in lowercase to match Solidity string conversion
      let sig = await getSignature(
        user1,
        accounts[2].address.toLowerCase(),
        1,
        "www.uri.com/1",
      );

      // pause the contract
      await consent.connect(user1).pause();

      // User 2 can now call restricted opt in if business entity has signed to approve them
      await expect(
        consent.connect(accounts[2]).restrictedOptIn(1, "www.uri.com/1", sig),
      ).to.revertedWith("Pausable: paused");
    });

    it("Does not allow restricted opt-ins with an existent token id.", async function () {
      // Business user signs user 2's address
      // pass in address in lowercase to match Solidity string conversion
      let sig = await getSignature(
        user1,
        accounts[2].address.toLowerCase(),
        1,
        "www.uri.com/1",
      );

      let sig3 = await getSignature(
        user1,
        accounts[3].address.toLowerCase(),
        1,
        "www.uri.com/1",
      );

      // User 2 can now call restricted opt in if business entity has signed to approve them
      await consent
        .connect(accounts[2])
        .restrictedOptIn(1, "www.uri.com/1", sig);

      // User 2 tried to call again with the same token id
      await expect(
        consent.connect(accounts[3]).restrictedOptIn(1, "www.uri.com/1", sig3),
      ).to.revertedWith("ERC721: token already minted");
    });

    it("Does not allow approved user to call restricted opt-ins with a different token id.", async function () {
      // Business user signs user 2's address
      // pass in address in lowercase to match Solidity string conversion
      let sig = await getSignature(
        user1,
        accounts[2].address.toLowerCase(),
        1,
        "www.uri.com/1",
      );

      // User 2 tries to call restricted opt in again with another token Id
      await expect(
        consent.connect(accounts[2]).restrictedOptIn(2, "www.uri.com/1", sig),
      ).to.revertedWith("Consent: Contract owner did not sign this message");
    });
  });

  describe("optOut", function () {
    it("Allows any address to opt-out after opting-in.", async function () {
      // call opt in
      await consent.connect(accounts[1]).optIn(1, "www.uri.com/1");

      // call opt out
      await consent.connect(accounts[1]).optOut(1);

      // check token balance of the account has none.
      expect(await consent.balanceOf(accounts[1].address)).to.eq(0);

      // check that total supply is decreased to 0
      expect(await consent.totalSupply()).to.eq(0);
    });

    it("Does not allow an address to opt-out another user's token.", async function () {
      // call opt in
      await consent.connect(accounts[1]).optIn(1, "www.uri.com/1");

      // call opt out with another account that does not own the token
      await expect(consent.connect(accounts[2]).optOut(1)).to.revertedWith(
        "ERC721Burnable: caller is not owner nor approved",
      );
    });
  });

  describe("requestForData", function () {
    it("Allows the REQUESTER_ROLE to request for data and emits RequestForData with the correct arguments", async function () {
      // call opt in
      await expect(
        consent
          .connect(user1)
          .requestForData("QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq9"),
      )
        .to.emit(consent, "RequestForData")
        .withArgs(
          user1.address,
          "QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq9",
          "QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq9",
        );
    });

    it("Does not allow non-REQUESTER_ROLE addresses to request for data", async function () {
      // call opt in
      await expect(
        consent
          .connect(accounts[2])
          .requestForData("QmdsB4FMQ2jBfrTL2kx6Eaq5Up8rF44h6aqPP9BPpHDAq9"),
      ).to.revertedWith(
        `AccessControl: account ${accounts[2].address.toLowerCase()} is missing role ${requesterRoleBytes}`,
      );
    });
  });

  describe("safeTransferFrom", function () {
    // safeTransferFrom is an overloaded function and is hence called differently in ethers.js

    it("Does not allow token owner to transfer Consent token after opting-in.", async function () {
      // call opt in
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
      // call opt in
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
      // call opt in
      await consent.connect(accounts[1]).optIn(1, "www.uri.com/1");

      // call burn
      await consent.connect(accounts[1]).burn(1);

      // check token balance of the account has none.
      expect(await consent.balanceOf(accounts[1].address)).to.eq(0);

      // check that total supply is descreased to 0
      expect(await consent.totalSupply()).to.eq(0);
    });

    it("Does not allow others to burn a user's Consent token.", async function () {
      // call opt in
      await consent.connect(accounts[1]).optIn(1, "www.uri.com/1");

      // call burn with admin
      await expect(consent.burn(1)).to.revertedWith("");

      // call burn with another user address
      await expect(consent.connect(accounts[2]).burn(1)).to.revertedWith("");
    });
  });

  describe("pause", function () {
    it("Allows address with PAUSER_ROLE to pause the contract", async function () {
      await consent.connect(user1).pause();

      expect(await consent.paused()).to.eq(true);
    });

    it("Does not allow address without PAUSER_ROLE to pause the contract", async function () {
      await expect(consent.connect(accounts[2]).pause()).to.revertedWith(
        `AccessControl: account ${accounts[2].address.toLowerCase()} is missing role ${pauserRoleBytes}`,
      );
    });
  });

  describe("unpause", function () {
    it("Allows address with PAUSER_ROLE to unpause the contract", async function () {
      await consent.connect(user1).pause();
      await consent.connect(user1).unpause();

      expect(await consent.paused()).to.eq(false);
    });

    it("Does not allows address without PAUSER_ROLE to pause the contract", async function () {
      await consent.connect(user1).pause();
      await expect(consent.connect(accounts[2]).unpause()).to.revertedWith(
        `AccessControl: account ${accounts[2].address.toLowerCase()} is missing role ${pauserRoleBytes}`,
      );
    });
  });

  describe("disableOpenOptIn", function () {
    it("Does not allow open opt-ins after address with PAUSER_ROLE disables it.", async function () {
      // disable open opt ins
      await consent.connect(user1).disableOpenOptIn();

      await expect(consent.optIn(1, "www.uri.com/1")).to.revertedWith(
        "Consent: Open opt-ins are currently disabled",
      );
    });

    it("Does not allows address without PAUSER_ROLE to disable the open opt-in.", async function () {
      await expect(
        consent.connect(accounts[2]).disableOpenOptIn(),
      ).to.revertedWith(
        `AccessControl: account ${accounts[2].address.toLowerCase()} is missing role ${pauserRoleBytes}`,
      );
    });
  });

  describe("enableOpenOptIn", function () {
    it("Allow open opt-ins after address with PAUSER_ROLE enables it.", async function () {
      // disable open opt ins
      await consent.connect(user1).disableOpenOptIn();

      await expect(consent.optIn(1, "www.uri.com/1")).to.revertedWith(
        "Consent: Open opt-ins are currently disabled",
      );

      // enable open opt ins
      await consent.connect(user1).enableOpenOptIn();

      await consent.optIn(1, "www.uri.com/1");
    });

    it("Does not allows address without PAUSER_ROLE to enable open opt-in.", async function () {
      await expect(
        consent.connect(accounts[2]).enableOpenOptIn(),
      ).to.revertedWith(
        `AccessControl: account ${accounts[2].address.toLowerCase()} is missing role ${pauserRoleBytes}`,
      );
    });
  });

  describe("setBaseURI", function () {
    it("Allows DEFAULT_ADMIN_ROLE to update the base URI.", async function () {
      // set uri
      await consent.connect(user1).setBaseURI("www.newURI.com");

      expect(await consent.baseURI()).to.eq("www.newURI.com");
    });

    it("Does not allow address without DEFAULT_ADMIN_ROLE to update the baseURI", async function () {
      await expect(
        consent.connect(accounts[2]).setBaseURI("www.newURI.com"),
      ).to.revertedWith(
        `AccessControl: account ${accounts[2].address.toLowerCase()} is missing role ${defaultAdminRoleBytes}`,
      );
    });
  });

  describe("setTrustedForwarder", function () {
    it("Allows DEFAULT_ADMIN_ROLE to update the trusted forwarder address.", async function () {
      // set trusted forwarder address
      await consent
        .connect(user1)
        .setTrustedForwarder("0xdD2FD4581271e230360230F9337D5c0430Bf44C0");

      expect(await consent.trustedForwarder()).to.eq(
        "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
      );
    });

    it("Does not allow address without DEFAUL_ADMIN_ROLE to update the forwarder address.", async function () {
      await expect(
        consent
          .connect(accounts[2])
          .setTrustedForwarder("0xdD2FD4581271e230360230F9337D5c0430Bf44C0"),
      ).to.revertedWith(
        `AccessControl: account ${accounts[2].address.toLowerCase()} is missing role ${defaultAdminRoleBytes}`,
      );
    });
  });

  describe("tokenURI", function () {
    it("Returns the correct token uri", async function () {
      // call opt in
      await consent
        .connect(accounts[1])
        .optIn(1, "/age?=1/location?=0/gender?=0");

      expect(await consent.tokenURI(1)).to.eq(
        "www.user1uri.com/age?=1/location?=0/gender?=0",
      );
    });
  });

  describe("supportInterface", function () {
    it("Returns true that EIP165 interface is supported", async function () {
      expect(await consent.supportsInterface(0x01ffc9a7)).to.eq(true);
    });
  });

  describe("addDomain, removeDomain, getDomains", function () {
    it("Returns the array of domains", async function () {
      const domain1 = "www.domain1.com";
      const domain2 = "www.domain2.com";
      const domain3 = "www.domain3.com";

      // add domains
      await expect(consent.connect(accounts[1]).addDomain(domain1))
        .to.emit(consent, "LogAddDomain")
        .withArgs(domain1);
      await expect(consent.connect(accounts[1]).addDomain(domain2))
        .to.emit(consent, "LogAddDomain")
        .withArgs(domain2);
      await expect(consent.connect(accounts[1]).addDomain(domain3))
        .to.emit(consent, "LogAddDomain")
        .withArgs(domain3);

      const domains = await consent.getDomains();

      expect(domains[0]).to.eq(domain1);
      expect(domains[1]).to.eq(domain2);
      expect(domains[2]).to.eq(domain3);
    });

    it("Returns the correct array of domains after removing 1", async function () {
      const domain1 = "www.domain1.com";
      const domain2 = "www.domain2.com";
      const domain3 = "www.domain3.com";

      // add domains
      await expect(consent.connect(accounts[1]).addDomain(domain1))
        .to.emit(consent, "LogAddDomain")
        .withArgs(domain1);
      await expect(consent.connect(accounts[1]).addDomain(domain2))
        .to.emit(consent, "LogAddDomain")
        .withArgs(domain2);
      await expect(consent.connect(accounts[1]).addDomain(domain3))
        .to.emit(consent, "LogAddDomain")
        .withArgs(domain3);

      await expect(consent.connect(accounts[1]).removeDomain(domain1))
        .to.emit(consent, "LogRemoveDomain")
        .withArgs(domain1);

      const domains = await consent.getDomains();

      expect(domains[0]).to.eq(domain3);
      expect(domains[1]).to.eq(domain2);
    });

    it("Does not allow address without DEFAULT_ADMIN_ROLE to addDomain", async function () {
      const domain1 = "www.domain1.com";

      // add domain without role
      await expect(
        consent.connect(accounts[0]).addDomain(domain1),
      ).to.revertedWith(
        `AccessControl: account ${accounts[0].address.toLowerCase()} is missing role ${defaultAdminRoleBytes}`,
      );
    });

    it("Does not allow address without DEFAULT_ADMIN_ROLE to removeDomain", async function () {
      const domain1 = "www.domain1.com";

      // add domain
      await expect(consent.connect(accounts[1]).addDomain(domain1))
        .to.emit(consent, "LogAddDomain")
        .withArgs(domain1);

      // remove domain without role
      await expect(
        consent.connect(accounts[0]).removeDomain(domain1),
      ).to.revertedWith(
        `AccessControl: account ${accounts[0].address.toLowerCase()} is missing role ${defaultAdminRoleBytes}`,
      );
    });

    it("Reverts if admin tries to remove a domain that does not exist", async function () {
      const domain2 = "www.domain2.com";
      // remove domain without role
      await expect(
        consent.connect(accounts[1]).removeDomain(domain2),
      ).to.revertedWith("Consent : Domain is not in the list");
    });

    it("Reverts if admin tries to add a domain that already exists", async function () {
      const domain1 = "www.domain1.com";

      // add domain
      await expect(consent.connect(accounts[1]).addDomain(domain1))
        .to.emit(consent, "LogAddDomain")
        .withArgs(domain1);

      // add same domain
      await expect(
        consent.connect(accounts[1]).addDomain(domain1),
      ).to.revertedWith("Consent : Domain already added");
    });
  });
});
