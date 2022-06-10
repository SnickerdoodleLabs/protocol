const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

async function getAddress(contract) {
    const txHash = contract.deployTransaction.hash;
    const txReceipt = await ethers.provider.waitForTransaction(txHash);
    return txReceipt.contractAddress;
}

describe("ConsentFactory", () => {

    // declare variables to be used in tests
    let Consent;
    let consentAddress;
    let ConsentFactory;

    let accounts;
    let owner;
    let user1;
    let user2;
    let trustedForwarder;
    
    const minterRoleBytes = ethers.utils.id("MINTER_ROLE");
    const pauserRoleBytes = ethers.utils.id("PAUSER_ROLE");
    const adminRoleBytes = ethers.utils.id("ADMIN_ROLE");
    const signerRoleBytes = ethers.utils.id("SIGNER_ROLE");

    beforeEach(async() => {

        accounts = await hre.ethers.getSigners();
        owner = accounts[0];
        user1 = accounts[1];
        user2 = accounts[2];
        trustedForwarder = accounts[19];

        // deploy the Consent contract 
        Consent = await ethers.getContractFactory("Consent");
        consent = await Consent.deploy();
        await consent.deployed();
        consentAddress = getAddress(consent);

        // deploy the Consent Factory contract before each test
        ConsentFactory = await ethers.getContractFactory("ConsentFactory");
        consentFactory = await ConsentFactory.deploy(trustedForwarder.address);
        await consentFactory.deployed();
        
    });

    describe("deployBeacon", function () {
        
        it("Deploys an Upgradable Beacon contract with ADMIN_ROLE", async function () {

            await consentFactory.connect(owner).deployBeacon(consentAddress);

        });

        it("Deploys an Upgradable Beacon contract without ADMIN_ROLE", async function () {

            await expect(consentFactory.connect(user1).deployBeacon(consentAddress))
            .to.revertedWith(`AccessControl: account ${user1.address.toLowerCase()} is missing role ${adminRoleBytes}`);

        });

    })

    describe("createConsent", function () {

        beforeEach( async() => {

            await consentFactory.connect(owner).deployBeacon(consentAddress);
        })
        
        it("Deploys a Beacon Proxy pointing to a new instance of a Consent contract", async function () {

            await consentFactory.connect(owner).createConsent(user1.address, "www.user1uri.com");

            // get the address of the deployed Consent Beacon Proxy
            const arrayOfBPs = await consentFactory.connect(owner).getConsentBP(user1.address);
            const addressOfDeployedConsent = arrayOfBPs[0];

            // attach the deployed Consent address and check it's uri 
            const deployedConsentInstance = consent.attach(addressOfDeployedConsent);

            // check the base uri
            expect (await deployedConsentInstance.connect(owner).baseURI()).to.eq("www.user1uri.com");

            // check the owner of the consent contract
            expect (await deployedConsentInstance.owner()).to.eq(user1.address);

            // check if owner of the consent contract has appropriate roles
            expect (await deployedConsentInstance.hasRole(adminRoleBytes, user1.address)).to.eq(true);
            expect (await deployedConsentInstance.hasRole(minterRoleBytes, user1.address)).to.eq(true);
            expect (await deployedConsentInstance.hasRole(signerRoleBytes, user1.address)).to.eq(true);
            expect (await deployedConsentInstance.hasRole(pauserRoleBytes, user1.address)).to.eq(true);

        });

        it("Deploys two Beacon Proxy pointing to a new instance of a Consent contract", async function () {

            await consentFactory.connect(owner).createConsent(user2.address, "www.user2uri.com");
            await consentFactory.connect(owner).createConsent(user2.address, "www.user2uri2.com");

            // get the address of the deployed Consent Beacon Proxy
            const arrayOfBPs = await consentFactory.connect(owner).getConsentBP(user2.address);
            const addressOfDeployedConsent1 = arrayOfBPs[0];
            const addressOfDeployedConsent2 = arrayOfBPs[1];

            // attach the deployed Consent address and check it's uri 
            const deployedConsentInstance1 = consent.attach(addressOfDeployedConsent1);
            const deployedConsentInstance2 = consent.attach(addressOfDeployedConsent2);

            expect (await deployedConsentInstance1.connect(owner).baseURI()).to.eq("www.user2uri.com");
            expect (await deployedConsentInstance2.connect(owner).baseURI()).to.eq("www.user2uri2.com");

        });

        it("Deploys a Beacon Proxy pointing to a new instance of a Consent contract with trusted forwarder address", async function () {

            await consentFactory.connect(trustedForwarder).createConsent(user1.address, "www.user1uri.com");

            // get the address of the deployed Consent Beacon Proxy
            await expect(consentFactory.connect(owner).getConsentBP(trustedForwarder.address))
                .to.revertedWith("ConsentFactory : User has not deployed Consents");
        });

    })

    describe("UpgradableBeacon test", function () {

        it("Upgrade the Consent implementation contract with HardHat Upgrades and check", async function () {

            let Consent = await ethers.getContractFactory("Consent");
            let ConsentV2 = await ethers.getContractFactory("ConsentV2");
            
            const beacon = await upgrades.deployBeacon(Consent);

            await consentFactory.connect(owner).setBeaconAddress(beacon.address);

            await consentFactory.connect(owner).createConsent(user1.address, "www.user1uri.com");

            // get the address of the deployed Consent Beacon Proxy
            const arrayOfBPs = await consentFactory.connect(owner).getConsentBP(user1.address);
            const addressOfDeployedConsent = arrayOfBPs[0];

            // attach the deployed Consent address and check it's uri 
            const deployedConsentInstance = consent.attach(addressOfDeployedConsent);

            expect (await deployedConsentInstance.connect(owner).baseURI()).to.eq("www.user1uri.com");

            // Upgrade the beacon using hardhat upgrades
            await upgrades.upgradeBeacon(beacon, ConsentV2);

             // attach the proxy's address to the new contract  
            const upgraded = ConsentV2.attach(addressOfDeployedConsent);

            await upgraded.setIsVersion2();

            const check = await upgraded.getIsVersion2();

            expect(check).to.eq(true);
        });

        it("Upgrade the Consent implementation contract with ABI and check", async function () {

            let Consent = await ethers.getContractFactory("Consent");
            let ConsentV2 = await ethers.getContractFactory("ConsentV2");
            let UpgradeableBeacon = await ethers.getContractFactory("UpgradeableBeacon");
            
            // TODO: test with contract's deploybeacon and forceImport from hardhat upgrades
            const beacon = await upgrades.deployBeacon(Consent);

            await consentFactory.connect(owner).setBeaconAddress(beacon.address);

            await consentFactory.connect(owner).createConsent(user1.address, "www.user1uri.com");

            // get the address of the deployed Consent Beacon Proxy
            const arrayOfBPs = await consentFactory.connect(owner).getConsentBP(user1.address);
            const addressOfDeployedConsent = arrayOfBPs[0];

            // attach the deployed Consent address and check it's uri 
            const deployedConsentInstance = consent.attach(addressOfDeployedConsent);

            expect (await deployedConsentInstance.connect(owner).baseURI()).to.eq("www.user1uri.com");

            // Upgrade the beacon using hardhat upgrades
            const beaconInstance = await UpgradeableBeacon.attach(beacon.address);

            // deploy an instance of the new ConsentV2 contract 
            ConsentV2 = await ethers.getContractFactory("ConsentV2");
            consentV2 = await ConsentV2.deploy();
            await consentV2.deployed();
            consentAddressV2 = getAddress(consentV2);

            await beaconInstance.upgradeTo(consentAddressV2);

             // attach the proxy's address to the new contract  
            const upgraded = ConsentV2.attach(addressOfDeployedConsent);

            await upgraded.setIsVersion2();

            const check = await upgraded.getIsVersion2();

            expect(check).to.eq(true);
        });

    })

});
