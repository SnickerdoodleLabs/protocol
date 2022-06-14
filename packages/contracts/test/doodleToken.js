const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DoodleToken", () => {

    // declare variables to be used in tests
    let DoodleToken;
    let doodleToken;
    let Timelock;
    let timelock;
    let snickerdoodleGovernor;
    let accounts;
    let owner;
    let addr1;
    let distributor;

    beforeEach(async() => {
        
        accounts = await ethers.getSigners();
        owner = accounts[0];
        addr1 = accounts[1];
        distributor = accounts[2];

        // deploy the Doodle Token contract
        DoodleToken = await ethers.getContractFactory("DoodleToken");
        doodleToken = await DoodleToken.deploy(distributor.address);
        await doodleToken.deployed();

    });

    describe("delegate and getVotes" , function () {
        
        it("Has voting power if it delegated", async function () {

            // the distributor delegate votes to itself
            tx = await doodleToken.connect(distributor).delegate(distributor.address);
            tx.wait();

                       
            let distributorVotes = await doodleToken.getVotes(distributor.address);
            expect(distributorVotes).to.equal(
              ethers.utils.parseEther("100000000"),
            );
          
        });

        it("Voting power changes based on token balance", async function () {

            // the distributor delegate votes to itself
            tx = await doodleToken.connect(distributor).delegate(distributor.address);
            tx.wait();

            // give some tokens to the addr1 contract
            tx = await doodleToken.connect(distributor).transfer(
                addr1.address,
                ethers.utils.parseEther("1000"),
            );
            tx.wait() 
                       
            let distributorVotes = await doodleToken.getVotes(distributor.address);
            expect(distributorVotes).to.equal(
              ethers.utils.parseEther("99999000"),
            );
          
        });

        it("Has no voting power if it has not delegated", async function () {

            // give some tokens to the addr1 contract
            tx = await doodleToken.connect(distributor).transfer(
                addr1.address,
                ethers.utils.parseEther("1000"),
            );
            tx.wait() 

            let addr1Balance = await doodleToken.balanceOf(addr1.address);
                expect(addr1Balance).to.equal(
                ethers.utils.parseEther("1000"),
            );
    
            // if delegate() is not called, the account has no voting power
            let addr1Votes = await doodleToken.getVotes(addr1.address);
                expect(addr1Votes).to.equal(
                ethers.utils.parseEther("0"),
            );
 
        });

    })

});
