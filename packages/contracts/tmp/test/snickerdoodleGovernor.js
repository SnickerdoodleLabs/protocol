const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SnickerdoodleGovernor", () => {

    // NOTE proposalStates = ['Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed'];

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
        addr2 = accounts[2];
        distributor = accounts[3];

        // deploy the Doodle Token contract
        DoodleToken = await ethers.getContractFactory("DoodleToken");
        doodleToken = await DoodleToken.deploy(distributor.address);
        await doodleToken.deployed();

        // deploy timelockupgradeable contract
        Timelock = await ethers.getContractFactory("SnickerdoodleTimelock");
        timelock = await Timelock.deploy(1, [], []);
        await timelock.deployed();

        // deploy the snickerdoodle governor contract
        const SnickerdoodleGovernor = await ethers.getContractFactory(
            "SnickerdoodleGovernor",
            );

        snickerdoodleGovernor = await SnickerdoodleGovernor.deploy(
                doodleToken.address,
                timelock.address,
            );
        await snickerdoodleGovernor.deployed();

        // give the governor contract the Proposer role in the timelock contract
        let tx = await timelock.grantRole(
            timelock.PROPOSER_ROLE(),
            snickerdoodleGovernor.address,
        );
        tx.wait();
    
        // give the governor contract the Executor role in the timelock contract
        tx = await timelock.grantRole(
            timelock.EXECUTOR_ROLE(),
            snickerdoodleGovernor.address,
        );
        tx.wait();

         // deployer address should now renounce admin role for security
        tx = await timelock.renounceRole(
            timelock.TIMELOCK_ADMIN_ROLE(),
            owner.address,
        );
        await tx.wait();

        // the distributor delegate votes to itself
        tx = await doodleToken.connect(distributor).delegate(distributor.address);
        tx.wait();

        // give some tokens to the timelock contract
        tx = await doodleToken.connect(distributor).transfer(
            timelock.address,
            ethers.utils.parseEther("1000"),
        );
        tx.wait();

        let balanceOfTimelock = await doodleToken.balanceOf(timelock.address);
        expect(balanceOfTimelock).to.equal(
          ethers.utils.parseEther("1000"),
        );

        // if delegate() is not called, the account has no voting power
        let timelockVotes = await doodleToken.getVotes(timelock.address);
        expect(timelockVotes).to.equal(
          ethers.utils.parseEther("0"),
        );
        
        let distributorVotes = await doodleToken.getVotes(distributor.address);
        expect(distributorVotes).to.equal(
          ethers.utils.parseEther("99999000"),
        );
    });


    it("Allows token holder who meet proposal threshold token amount to propose ", async function () {
        // create proposal call data
        let proposalDescription = "Proposal #1: Give grant to address"; // Human readable description
        
        let descriptionHash = ethers.utils.id(proposalDescription); // Hash description to help compute the proposal ID
        
        let transferCalldata = doodleToken.interface.encodeFunctionData("transfer", [
            addr1.address,
            ethers.utils.parseEther("7"),
            ]); // encode the function to be called

        // propose a vote
        await snickerdoodleGovernor.connect(distributor).propose(
            [doodleToken.address],
            [0],
            [transferCalldata],
            proposalDescription,
        );
    });

    it("Does not allow token holder with insufficient tokens to propose (less than proposal threshold amount).", async function () {
        
        // create proposal call data
        let proposalDescription = "Proposal #1: Give grant to address"; // Human readable description
        
        let descriptionHash = ethers.utils.id(proposalDescription); // Hash description to help compute the proposal ID
        
        let transferCalldata = doodleToken.interface.encodeFunctionData("transfer", [
            addr1.address,
            ethers.utils.parseEther("7"),
            ]); // encode the function to be called
        
        // propose a vote with insufficient voting power (does not meet prposal threshold)
        await expect(snickerdoodleGovernor.connect(addr2).propose(
            [doodleToken.address],
            [0],
            [transferCalldata],
            proposalDescription,
        )).to.revertedWith("Governor: proposer votes below proposal threshold");
        
    });

    it("Proposal is only active after voting delay period", async function () {

            // create proposal call data
            let proposalDescription = "Proposal #1: Give grant to address"; // Human readable description
        
            let descriptionHash = ethers.utils.id(proposalDescription); // Hash description to help compute the proposal ID
            
            let transferCalldata = doodleToken.interface.encodeFunctionData("transfer", [
                addr1.address,
                ethers.utils.parseEther("7"),
                ]); // encode the function to be called
            
            // use the governor contract's hashProposal function to pre-compute the proposal ID for easy lookup later
            let proposalID = await snickerdoodleGovernor.hashProposal(
                [doodleToken.address],
                [0],
                [transferCalldata],
                descriptionHash,
            );  

            // propose a vote
            await snickerdoodleGovernor.connect(distributor).propose(
                [doodleToken.address],
                [0],
                [transferCalldata],
                proposalDescription,
            );

            // check state of proposal, should be inactive as voting delay is 1 block
            // inactive state is 0
            expect(await snickerdoodleGovernor.state(proposalID)).to.equal(0);
            
            // fast forward chain by 2 blocks blocks as voting delay requires 1 block
            await ethers.provider.send("evm_mine")
            await ethers.provider.send("evm_mine")

        // check state of proposal, should be inactive as voting delay is 1
        // active state is 1
        expect(await snickerdoodleGovernor.state(proposalID)).to.equal(1);
    });

    it("Proposal is 'Defeated' state if there are no votes after voting period and cannot be queued", async function () {
        
        // create proposal call data
        let proposalDescription = "Proposal #1: Give grant to address"; // Human readable description
        
        let descriptionHash = ethers.utils.id(proposalDescription); // Hash description to help compute the proposal ID
        
        let transferCalldata = doodleToken.interface.encodeFunctionData("transfer", [
            addr1.address,
            ethers.utils.parseEther("7"),
            ]); // encode the function to be called
        
        // use the governor contract's hashProposal function to pre-compute the proposal ID for easy lookup later
        let proposalID = await snickerdoodleGovernor.hashProposal(
            [doodleToken.address],
            [0],
            [transferCalldata],
            descriptionHash,
        );  

        // propose a vote
        await snickerdoodleGovernor.connect(distributor).propose(
            [doodleToken.address],
            [0],
            [transferCalldata],
            proposalDescription,
        );

        // fast forward chain by 2 blocks blocks as voting delay is 1 block
        await ethers.provider.send("evm_mine")
        await ethers.provider.send("evm_mine")

        // check state of proposal, should be inactive as voting delay is 1
        // active state is 1
        expect(await snickerdoodleGovernor.state(proposalID)).to.equal(1);

        // fast forward chain by 3 blocks blocks as voting period is 2 blocks
        await ethers.provider.send("evm_mine")
        await ethers.provider.send("evm_mine")
        await ethers.provider.send("evm_mine")

        // check state of proposal, should be inactive as voting delay is 1
        // Defeated state is 3, OZ's governor's ProposalState follows Compound's definition
        // https://compound.finance/docs/governance
        expect(await snickerdoodleGovernor.state(proposalID)).to.equal(3);

        await expect(snickerdoodleGovernor.queue(
            [doodleToken.address],
            [0],
            [transferCalldata],
            descriptionHash,
        )).to.revertedWith('Governor: proposal not successful');

    });

    it("Proposal is 'Succeeded' state if there are sufficient votes after voting period and can be queued and executed", async function () {
        // create proposal call data
        let proposalDescription = "Proposal #1: Give grant to address 2"; // Human readable description
        
        let descriptionHash = ethers.utils.id(proposalDescription); // Hash description to help compute the proposal ID
        
        let transferCalldata = doodleToken.interface.encodeFunctionData("transfer", [
            addr2.address,
            ethers.utils.parseEther("7"),
            ]); // encode the function to be called
        
        // use the governor contract's hashProposal function to pre-compute the proposal ID for easy lookup later
        let proposalID = await snickerdoodleGovernor.hashProposal(
            [doodleToken.address],
            [0],
            [transferCalldata],
            descriptionHash,
        );  

        // propose a vote
        await snickerdoodleGovernor.connect(distributor).propose(
            [doodleToken.address],
            [0],
            [transferCalldata],
            proposalDescription,
        );

        // fast forward chain by 2 blocks blocks as voting delay is 1 block
        await ethers.provider.send("evm_mine")
        await ethers.provider.send("evm_mine")

        // check state of proposal, should be inactive as voting delay is 1
        // active state is 1
        expect(await snickerdoodleGovernor.state(proposalID)).to.equal(1);
        
        // cast a vote
        await snickerdoodleGovernor.connect(distributor).castVote(proposalID, 1);

        // check who has voted
        expect(await snickerdoodleGovernor.hasVoted(proposalID, distributor.address)).to.equal(
            true,
        );
        expect(await snickerdoodleGovernor.hasVoted(proposalID, addr1.address)).to.equal(
            false,
        );

        // fast forward chain by 3 blocks blocks as voting delay is 1 block
        await ethers.provider.send("evm_mine")
        await ethers.provider.send("evm_mine")
        await ethers.provider.send("evm_mine")

        // check state of proposal, should be 4 for succedded
        expect(await snickerdoodleGovernor.state(proposalID)).to.equal(4);

        // queue the proposal
        await snickerdoodleGovernor.queue(
            [doodleToken.address],
            [0],
            [transferCalldata],
            descriptionHash,
        );
        
        let balanceOfAddr2Before = await doodleToken.balanceOf(addr2.address);
        balanceOfAddr2Before = Number(ethers.utils.formatEther(balanceOfAddr2Before));

        //execute the proposal 
        await snickerdoodleGovernor.execute(
            [doodleToken.address],
            [0],
            [transferCalldata],
            descriptionHash,
        );

        let balanceOfAddr2After = await doodleToken.balanceOf(addr2.address);
        balanceOfAddr2After = Number(ethers.utils.formatEther(balanceOfAddr2After));
        
        // expect that address 2 has increased by 7 ethers based on proposal
        expect(balanceOfAddr2After - balanceOfAddr2Before).to.equal(7);
    });

});
