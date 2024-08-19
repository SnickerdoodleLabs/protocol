import { task } from "hardhat/config";
import { keccak256 } from "viem";

const SMART_WALLET_FACTORY = "0xddee1970fFaE317E23bE0D49d31D6Bb907570c95";

task("keccak256", "Returns the keccak256 of the given string")
  .addParam("string", "String to hash")
  .setAction(async (taskArgs) => {
    console.log(keccak256(taskArgs.string));
  });

task(
  "smartWalletFactorySetPeer",
  "Hooks up SmartWalletFactory contracts on the target chains together",
)
  .addParam("eid", "Layer Zero endpoint id for target chain")
  .addParam(
    "peercontract",
    "The SmartWalletFactory contract on the target chain",
  )
  .addParam(
    "currentcontract",
    "The SmartWalletFactory contract on the current chain",
  )
  .setAction(async (taskArgs) => {
    const eid = taskArgs.eid;
    let peerContract = taskArgs.peercontract;

    // Format it to bytes32
    const padding = "0x000000000000000000000000";
    peerContract = padding.concat(peerContract.substring(2));

    const publicClient = await hre.viem.getPublicClient();
    const factory = await hre.viem.getContractAt(
      "SmartWalletFactory",
      SMART_WALLET_FACTORY,
    );
    const hash = await factory.write.setPeer([eid, peerContract]);
    const txReceipt = await publicClient.waitForTransactionReceipt({ hash });

    console.log("Set peer successful!");
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

task(
  "deploySmartWalletUpgradeableBeacon",
  "Deploy a smart wallet upgradeable beacon",
)
  .addParam("name", "name of the wallet")
  .addParam("owner", "owner address")
  .addParam(
    "eid",
    "layer zero endpoint id for destination chain to send message to",
  )
  .addParam(
    "currentcontract",
    "The SmartWalletFactory contract on the current chain",
  )
  .addParam("valueinwei", "Value to send in wei after getting the quote price")
  .setAction(async (taskArgs) => {
    const publicClient = await hre.viem.getPublicClient();
    const factory = await hre.viem.getContractAt(
      "SmartWalletFactory",
      SMART_WALLET_FACTORY,
    );
    const hash = await factory.write.deploySmartWalletUpgradeableBeacon(
      [taskArgs.name, taskArgs.owner, 60000],
      { value: taskArgs.valueinwei },
    );
    const txReceipt = await publicClient.waitForTransactionReceipt({ hash });

    console.log("Smart wallet deployed!", txReceipt);
  });

task(
  "getSendQuote",
  "Get the gas price needed to call _lzSend() within deploySmartWalletUpgradeableBeacon()",
)
  .addParam("eid", "Layer Zero endpoint id for target chain")
  .addParam("currentcontract", "The OFT20Reward contract on the current chain")
  .addParam("owner", "The owner address contract on the current chain")
  .addParam(
    "smartwalletaddress",
    "The OFT20Reward contract on the current chain",
  )
  .setAction(async (taskArgs) => {
    // for ONFT - extraOptions: "0x00030100110100000000000000000000000000030d40", // assuming 200k gas

    const factory = await hre.viem.getContractAt(
      "SmartWalletFactory",
      SMART_WALLET_FACTORY,
    );

    try {
      const quotePrice = await factory.read.quote([
        Number(taskArgs.eid),
        taskArgs.owner,
        taskArgs.smartwalletaddress,
        "0x0003010011010000000000000000000000000000ea60",
        false,
      ]);

      console.log("Quoted price:", quotePrice);
    } catch (e) {
      console.log("FAILED", e);
    }
  });

task(
  "computeSmartWalletProxyAddress",
  "Computes the smart wallet address prior to deployment",
)
  .addParam("name", "Name of the Proxy Vault")
  .setAction(async (taskargs) => {
    const factory = await hre.viem.getContractAt(
      "SmartWalletFactory",
      SMART_WALLET_FACTORY,
    );
    const smartWalletAddress = await factory.read.computeProxyAddress([
      taskargs.name,
    ]);
    console.log("Proxy Address:", smartWalletAddress);
  });

task("getOwnerOfSmartWallet", "Get owner of the smart wallet address")
  .addParam(
    "smartwalletaddress",
    "The smart wallet address on the current chain",
  )
  .setAction(async (taskArgs) => {
    // for ONFT - extraOptions: "0x00030100110100000000000000000000000000030d40", // assuming 60k gas

    const factory = await hre.viem.getContractAt(
      "SmartWalletFactory",
      SMART_WALLET_FACTORY,
    );

    try {
      const ownerAddress = await factory.read.deployedSmartWalletAddressToOwner(
        [taskArgs.smartwalletaddress],
      );

      console.log("Owner address:", ownerAddress);
    } catch (e) {
      console.log("FAILED", e);
    }
  });

task(
  "smartWalletFactoryUpdateChainEIDs",
  "Update the mapping of chain ids to their layer zero EIDs",
)
  .addParam("chainids", "List of chain ids")
  .addParam("eids", "List of EIDs")
  .setAction(async (taskArgs) => {
    const publicClient = await hre.viem.getPublicClient();
    const factory = await hre.viem.getContractAt(
      "SmartWalletFactory",
      SMART_WALLET_FACTORY,
    );
    const hash = await factory.write.updateChainEIDs([
      taskArgs.chainids.split(",").map(Number),
      taskArgs.eids.split(",").map(Number),
    ]);
    const txReceipt = await publicClient.waitForTransactionReceipt({ hash });

    console.log("Updated chain EIDs!");
  });

task(
  "quoteFactoryDeployedOnDestinationChain",
  "Get the gas price needed to call _sendFactoryDeployedOnDestinationChain()",
)
  .addParam("sourcechaineid", "Layer Zero endpoint id for source chain")
  .addParam("destinationchainid", "The destination chain id")
  .setAction(async (taskArgs) => {
    // for ONFT - extraOptions: "0x00030100110100000000000000000000000000030d40", // assuming 200k gas

    const factory = await hre.viem.getContractAt(
      "SmartWalletFactory",
      SMART_WALLET_FACTORY,
    );

    try {
      const quotePrice =
        await factory.read.quoteFactoryDeployedOnDestinationChain([
          Number(taskArgs.sourcechaineid),
          Number(taskArgs.destinationchainid),
          SMART_WALLET_FACTORY,
          "0x0003010011010000000000000000000000000000ea60",
        ]);

      console.log("Quoted price:", quotePrice);
    } catch (e) {
      console.log("FAILED", e);
    }
  });

task(
  "sendFactoryDeployedOnDestinationChain",
  "Announce to the source chain that it has been deployed on the destination chain",
)
  .addParam("gas", "Gas for the lzReceive call")
  .addParam(
    "msgvalue",
    "The actual fee to submit with the function call in native token wei",
  )
  .setAction(async (taskArgs) => {
    const publicClient = await hre.viem.getPublicClient();
    const factory = await hre.viem.getContractAt(
      "SmartWalletFactory",
      SMART_WALLET_FACTORY,
    );
    const hash = await factory.write.sendFactoryDeployedOnDestinationChain(
      [60000],
      { value: BigInt(taskArgs.msgvalue) },
    );
    const txReceipt = await publicClient.waitForTransactionReceipt({ hash });

    console.log("Submitted message to source chain!", txReceipt);
  });

task(
  "quoteSmartWalletDeployedOnSourceChain",
  "Get the gas price needed to call _lzSend() within deploySmartWalletUpgradeableBeacon()",
)
  .addParam("eid", "Layer Zero endpoint id for target chain")
  .addParam("currentcontract", "The OFT20Reward contract on the current chain")
  .addParam("owner", "The owner address contract on the current chain")
  .addParam(
    "smartwalletaddress",
    "The OFT20Reward contract on the current chain",
  )
  .setAction(async (taskArgs) => {
    // for ONFT - extraOptions: "0x00030100110100000000000000000000000000030d40", // assuming 200k gas

    const factory = await hre.viem.getContractAt(
      "SmartWalletFactory",
      SMART_WALLET_FACTORY,
    );

    try {
      const quotePrice =
        await factory.read.quoteSmartWalletDeployedOnSourceChain([
          Number(taskArgs.eid),
          taskArgs.owner,
          taskArgs.smartwalletaddress,
          "0x0003010011010000000000000000000000000000ea60",
        ]);

      console.log("Quoted price:", quotePrice);
    } catch (e) {
      console.log("FAILED", e);
    }
  });

task(
  "getSupportedChainEIDs",
  "Returns list of supported EIDs on the contract",
).setAction(async () => {
  const factory = await hre.viem.getContractAt(
    "SmartWalletFactory",
    SMART_WALLET_FACTORY,
  );
  const list = await factory.read.getSupportedChainEIDs();
  console.log("Suppoted EIDs:", list);
});

function padding(addressToPad) {
  // Format it to bytes32
  const padding = "0x000000000000000000000000";
  return padding.concat(addressToPad.substring(2));
}
