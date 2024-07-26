import { task } from "hardhat/config";

const SMART_WALLET_FACTORY = '0x9AfB3AC96078B6415230A708247720dc5F908a8A';

task(
    "smartWalletFactorySetPeer",
    "Hooks up SmartWalletFactory contracts on the target chains together",
  )
    .addParam("eid", "Layer Zero endpoint id for target chain")
    .addParam("peercontract", "The SmartWalletFactory contract on the target chain")
    .addParam("currentcontract", "The SmartWalletFactory contract on the current chain")
    .setAction(async (taskArgs) => {
      const eid = taskArgs.eid;
      let peerContract = taskArgs.peercontract;
  
      // Format it to bytes32
      const padding = "0x000000000000000000000000";
      peerContract = padding.concat(peerContract.substring(2));
  
      const publicClient = await hre.viem.getPublicClient();
      const factory = await hre.viem.getContractAt("SmartWalletFactory", SMART_WALLET_FACTORY);
      const hash = await factory.write.setPeer([eid, peerContract]);
      const txReceipt = await publicClient.waitForTransactionReceipt({ hash });

      console.log("Set peer successful!")
    });

  // Looks like this is removed now
//   task("smartWalletFactoryIsPeer", "Check if SmartWalletFactory contracts are peers")
//     .addParam("eid", "Layer Zero endpoint id for target chain")
//     .addParam("peercontract", "The SmartWalletFactory contract on the target chain")
//     .addParam("currentcontract", "The SmartWalletFactory contract on the current chain")
//     .setAction(async (taskArgs) => {
//       const eid = taskArgs.eid;
//       let peerContract = taskArgs.peercontract;
  
//       // Formet it to bytes32
//       const padding = "0x000000000000000000000000";
//       peerContract = padding.concat(peerContract.substring(2));
  
//       const factory = await hre.viem.getContractAt("SmartWalletFactory", SMART_WALLET_FACTORY);
//       const isPeerCheck = await factory.read.isPeer([eid, peerContract]);
//       console.log("Is peer check:", isPeerCheck);
//     });
  
  task("deploySmartWalletUpgradeableBeacon", "Deploy a smart wallet upgradeable beacon")
    .addParam("name", "name of the wallet")
    .addParam("owner", "owner address")
    .addParam("eid", "layer zero endpoint id for destination chain to send message to")
    .addParam("currentcontract", "The SmartWalletFactory contract on the current chain")
    .addParam("valueinwei", "Value to send in wei after getting the quote price")
    .setAction(async (taskArgs) => {
  
        const publicClient = await hre.viem.getPublicClient();
        const factory = await hre.viem.getContractAt("SmartWalletFactory", SMART_WALLET_FACTORY);
        const hash = await factory.write.deploySmartWalletUpgradeableBeacon([Number(taskArgs.eid), taskArgs.name, taskArgs.owner, "0x0003010011010000000000000000000000000000ea60"], {value: 7846711690236811});
        const txReceipt  = await publicClient.waitForTransactionReceipt({ hash });

        console.log("Smart wallet deployed!", txReceipt);
    });
  

  task("getSendQuote", "Get the gas price needed to call _lzSend() within deploySmartWalletUpgradeableBeacon()")
    .addParam("eid", "Layer Zero endpoint id for target chain")
    .addParam("currentcontract", "The OFT20Reward contract on the current chain")
    .addParam("owner", "The owner address contract on the current chain")
    .addParam("smartwalletaddress", "The OFT20Reward contract on the current chain")
    .setAction(async (taskArgs) => {

      // for ONFT - extraOptions: "0x00030100110100000000000000000000000000030d40", // assuming 200k gas

      const factory = await hre.viem.getContractAt("SmartWalletFactory", SMART_WALLET_FACTORY);
      
      try {
        const quotePrice = await factory.read.quote([
            Number(taskArgs.eid),
            taskArgs.owner,
            taskArgs.smartwalletaddress,
            "0x0003010011010000000000000000000000000000ea60", 
            false
          ]);

        console.log("Quoted price:", quotePrice);
      } catch (e) {
        console.log("FAILED", e);
      }
      
    });

  task("computeSmartWalletProxyAddress", "Computes the smart wallet address prior to deployment")
    .addParam("name", "Name of the Proxy Vault")
    .setAction(async (taskargs) => {
        const factory = await hre.viem.getContractAt("SmartWalletFactory", SMART_WALLET_FACTORY);
        const smartWalletAddress = await factory.read.computeProxyAddress([taskargs.name]);
        console.log("Proxy Address:", smartWalletAddress);
    });

  task("getOwnerOfSmartWallet", "Get owner of the smart wallet address")
    .addParam("smartwalletaddress", "The smart wallet address on the current chain")
    .setAction(async (taskArgs) => {

      // for ONFT - extraOptions: "0x00030100110100000000000000000000000000030d40", // assuming 200k gas

      const factory = await hre.viem.getContractAt("SmartWalletFactory", SMART_WALLET_FACTORY);
      
      try {
        const ownerAddress = await factory.read.deployedSmartWalletAddressToOwner([taskArgs.smartwalletaddress]);

        console.log("Owner address:", ownerAddress);
      } catch (e) {
        console.log("FAILED", e);
      }
    });
  
  function padding(addressToPad) {
    // Format it to bytes32
    const padding = "0x000000000000000000000000";
    return padding.concat(addressToPad.substring(2));
  }
  