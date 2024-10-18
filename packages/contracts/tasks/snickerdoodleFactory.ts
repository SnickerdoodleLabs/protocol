import { task } from "hardhat/config";

const SNICKERDOODLE_FACTORY_CONTRACT_NAME = "SnickerdoodleFactory";
const SNICKERDOODLE_FACTORY_PROXY =
  "0xa901cDA47cd5637B0a2aE7c3C1B781190a3d1615";
const OPERATOR_GATEWAY_CONTRACT_NAME = "OperatorGateway";
const OPERATOR_GATEWAY_PROXY = "0xd746d066Dc666A54776a4aF965fc967954bEFc1a";

task(
  "snickerdoodleWalletFactorySetPeer",
  "Hooks up SnickerdoodleWalletFactory contracts on the target chains together",
)
  .addParam("eid", "Layer Zero endpoint id for target chain")
  .addParam(
    "peercontract",
    "The SnickerdoodleWalletFactory contract on the target chain",
  )
  .addParam(
    "currentcontract",
    "The SnickerdoodleWalletFactory contract on the current chain",
  )
  .setAction(async (taskArgs, hre) => {
    const eid = taskArgs.eid;
    let peerContract = taskArgs.peercontract;

    // Format it to bytes32
    const padding = "0x000000000000000000000000";
    peerContract = padding.concat(peerContract.substring(2));

    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
    );

    const txResponse = await factory.setPeer(eid, peerContract);
    const txReceipt = await txResponse.wait();

    console.log("Set peer successful!");
  });

// Looks like this is removed now
//   task("snickerdoodleWalletFactoryIsPeer", "Check if snickerdoodleWalletFactory contracts are peers")
//     .addParam("eid", "Layer Zero endpoint id for target chain")
//     .addParam("peercontract", "The snickerdoodleWalletFactory contract on the target chain")
//     .addParam("currentcontract", "The snickerdoodleWalletFactory contract on the current chain")
//     .setAction(async (taskArgs, hre) => {
//       const eid = taskArgs.eid;
//       let peerContract = taskArgs.peercontract;

//       // Formet it to bytes32
//       const padding = "0x000000000000000000000000";
//       peerContract = padding.concat(peerContract.substring(2));

//       const factory = await hre.viem.getContractAt("SnickerdoodleWalletFactory", SNICKERDOODLE_FACTORY_PROXY);
//       const isPeerCheck = await factory.read.isPeer([eid, peerContract]);
//       console.log("Is peer check:", isPeerCheck);
//     });

task(
  "deployOperatorGatewayProxy",
  "Deploy a Snickerdoodle Operator gateway beacon proxy",
)
  .addParam("domain", "name operator's domain")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const signers = await ethers.getSigners();
    const owner = signers[0];

    const factory = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
    );

    // Deploy the proxy and wait for transaction confirmation
    const txResponse = await factory.deployOperatorGatewayProxy(
      taskArgs.domain,
      [owner.address],
    );

    const txReceipt = await txResponse.wait();

    console.log("Snickerdoodle Operator deployed!");
    console.log("Transaction receipt:", txReceipt);
  });

task(
  "deploySnickerdoodleWalletProxyViaOperatorGateway",
  "Deploy a Snickerdoodle wallet beacon proxy",
)
  .addParam("username", "User name of the wallet")
  .addParam("qx", "X coordinate of the Passkey public key")
  .addParam("qy", "Y coordinate of the Passkey public key")
  .addParam("keyid", "Passkey id")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const operator = await ethers.getContractAt(
      OPERATOR_GATEWAY_CONTRACT_NAME,
      OPERATOR_GATEWAY_PROXY,
    );

    // Make sure this is
    const txResponse = await operator.deploySnickerdoodleWallets(
      [taskArgs.username],
      [
        {
          x: taskArgs.qx,
          y: taskArgs.qy,
          keyId: taskArgs.keyid,
        },
      ],
      [[]],
    );

    const txReceipt = await txResponse.wait();
    console.log("Snickerdoodle wallet deployed!");
    console.log("Transaction receipt", txReceipt);
  });

task(
  "computeSnickerdoodleWalletProxyAddress",
  "Computes the snickerdoodle wallet address prior to deployment",
)
  .addParam("name", "Name of the Proxy Vault")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
    );

    const snickerdoodleWalletAddress =
      await factory.computeSnickerdoodleWalletProxyAddress(taskArgs.name);
    console.log("Proxy Address:", snickerdoodleWalletAddress);
  });

task(
  "getOwnerOfSnickerdoodleWallet",
  "Get owner of the snickerdoodle wallet address",
)
  .addParam(
    "snickerdoodlewalletaddress",
    "The snickerdoodle wallet address on the current chain",
  )
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
    );

    try {
      const operatorAndPoints =
        await factory.deployedSnickerdoodleWalletAddressToOwner(
          taskArgs.snickerdoodlewalletaddress,
        );

      console.log("Operator:", operatorAndPoints[0]);
      console.log("Passkey point X:", operatorAndPoints[1]);
      console.log("Passkey point Y:", operatorAndPoints[2]);
      console.log("Passkey Id:", operatorAndPoints[3]);
    } catch (e) {
      console.log("FAILED", e);
    }
  });

task(
  "quoteReserveOperatorGatewayOnDestinationChain",
  "Get the gas price needed to call ()",
)
  .addParam(
    "destinationchainid",
    "Layer Zero endpoint id for the destination chain",
  )
  .addParam("domain", "domain of the operator")
  .addParam(
    "gas",
    "Amount of gas in wei to include in the quote to cover the function of lzReceive",
  )

  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
    );

    try {
      const quotePrice =
        await factory.quoteReserveOperatorGatewayOnDestinationChain(
          Number(taskArgs.destinationchainid),
          taskArgs.domain,
          Number(taskArgs.gas),
        );

      console.log("Quoted price:", quotePrice);
    } catch (e) {
      console.log("FAILED", e);
    }
  });

task(
  "reserveOperatorGatewayOnDestinationChain",
  "Send a message to the destination chain to reserve the operator domain name",
)
  .addParam(
    "destinationchaineid",
    "Layer Zero endpoint id for the destination chain",
  )
  .addParam("domain", "the operator domain name")
  .addParam(
    "gas",
    "Amount of gas in wei to include in the quote to cover the function of lzReceive",
  )
  .addParam(
    "feeinwei",
    "The fees from the quoteReserveOperatorGatewayOnDestinationChain call",
  )

  .setAction(async (taskArgs, hre) => {
    // for ONFT - extraOptions: "0x00030100110100000000000000000000000000030d40", // assuming 200k gas
    // 0x0003010011010000000000000000000000000000ea60
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
    );

    try {
      const txResponse = await factory.reserveOperatorGatewayOnDestinationChain(
        Number(taskArgs.destinationchaineid),
        taskArgs.domain,
        Number(taskArgs.gas),
        {
          value: taskArgs.feeinwei,
        },
      );

      const txReceipt = await txResponse.wait();
      console.log(
        "Operator domain reserve request submitted to destination chain! Txhash:",
        txReceipt,
      );
    } catch (e) {
      console.log("FAILED", e);
    }
  });

task(
  "quoteReserveWalletOnDestinationChain",
  "Get the gas price needed to call _sendFactoryDeployedOnDestinationChain()",
)
  .addParam(
    "destinationchainid",
    "Layer Zero endpoint id for the destination chain",
  )
  .addParam("namewithdomain", "Name plus domain of the wallet")
  .addParam("operator", "Operator address of the wallet")
  .addParam(
    "gas",
    "Amount of gas in wei to include in the quote to cover the function of lzReceive",
  )

  .setAction(async (taskArgs, hre) => {
    // for ONFT - extraOptions: "0x00030100110100000000000000000000000000030d40", // assuming 200k gas
    // 0x0003010011010000000000000000000000000000ea60
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
    );

    try {
      const quotePrice = await factory.quoteReserveWalletOnDestinationChain(
        Number(taskArgs.destinationchainid),
        taskArgs.namewithdomain,
        taskArgs.operator,
        Number(taskArgs.gas),
      );

      console.log("Quoted price:", quotePrice);
    } catch (e) {
      console.log("FAILED", e);
    }
  });

task(
  "reserveWalletAddressOnDestinationChainViaOperatorGateway",
  "Send a message to the destination chain to reserve the wallet address",
)
  .addParam(
    "destinationchaineid",
    "Layer Zero endpoint id for the destination chain",
  )
  .addParam("username", "Username of the wallet")
  .addParam(
    "gas",
    "Amount of gas in wei to include in the quote to cover the function of lzReceive",
  )
  .addParam(
    "feeinwei",
    "The fees from the quoteReserveWalletOnDestinationChain call",
  )

  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const operator = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
    );

    try {
      //   const txResponse = await operator.reserveWalletsOnDestinationChain(
      //     Number(taskArgs.destinationchaineid),
      //     [taskArgs.username],
      //     Number(taskArgs.gas),
      //     {
      //       value: taskArgs.feeinwei,
      //     },
      //   );

      const txResponse = await operator.reserveWalletOnDestinationChain(
        Number(taskArgs.destinationchaineid),
        taskArgs.username,
        Number(taskArgs.gas),
        {
          value: taskArgs.feeinwei,
        },
      );

      const txReceipt = await txResponse.wait();
      console.log(
        "Wallet claimed request submitted to destination chain! Txhash:",
        txReceipt,
      );
    } catch (e) {
      console.log("FAILED", e);
    }
  });

task(
  "computeWalletProxyAddress",
  "Calculate the proxy address for a given user name with domain Snickerdoodle wallet",
)
  .addParam("usernamewithdomain", "Name plus domain of the wallet")

  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
    );

    try {
      const walletBeacon = await factory.walletBeacon();

      const walletProxyAddress = await factory.computeProxyAddress(
        taskArgs.usernamewithdomain,
        walletBeacon,
      );

      console.log("Wallet proxy address:", walletProxyAddress);
    } catch (e) {
      console.log("FAILED", e);
    }
  });

task(
  "computeOperatorGatewayProxyAddress",
  "Calculate the Operator gateway proxy address for a given domain",
)
  .addParam("domain", "Domain of the operator")

  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
    );

    try {
      const operatorBeacon = await factory.gatewayBeacon();

      const operatorGatewayProxyAddress = await factory.computeProxyAddress(
        taskArgs.domain,
        operatorBeacon,
      );

      console.log(
        "Operator gateway proxy address:",
        operatorGatewayProxyAddress,
      );
    } catch (e) {
      console.log("FAILED", e);
    }
  });

task(
  "getWalletAndOperatorGatewayBeaconAddresses",
  "Return the wallet and operator gateway beacon addresses",
).setAction(async (taskArgs, hre) => {
  const { ethers } = hre;

  const factory = await ethers.getContractAt(
    SNICKERDOODLE_FACTORY_CONTRACT_NAME,
    SNICKERDOODLE_FACTORY_PROXY,
  );

  try {
    const walletBeacon = await factory.walletBeacon();
    const operatorBeacon = await factory.gatewayBeacon();

    console.log("Wallet beacon address:", walletBeacon);
    console.log("Operator gateway beacon address:", operatorBeacon);
  } catch (e) {
    console.log("FAILED", e);
  }
});

task(
  "getDeployedOperatorGatewayProxyDetails",
  "Return operator gateway details for a given operator address",
)
  .addParam("operatoraddress", "Address of the operator gateway proxy contract")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
    );

    try {
      const operatorGatewayParams =
        await factory.deployedOperatorGatewayAddressToParams(
          taskArgs.operatoraddress,
        );

      if (Array.isArray(operatorGatewayParams)) {
        console.log("Operator gateway params:");
        console.log(
          "- Domain:",
          operatorGatewayParams[0].length > 0
            ? operatorGatewayParams[0]
            : "No domain",
        );
        console.log(
          "- Operator Accounts:",
          operatorGatewayParams.length == 2
            ? operatorGatewayParams[1]
            : "No operator accounts",
        );
      } else {
        console.log("Operator gateway params:");
        console.log(
          "- Domain:",
          operatorGatewayParams.length > 0
            ? operatorGatewayParams
            : "No domain",
        );
        console.log("- Operator Accounts: No operator accounts");
      }
    } catch (e) {
      console.log("FAILED", e);
    }
  });

task(
  "getDeployedWalletProxyDetails",
  "Return the wallet proxy details for a given username plus domain",
)
  .addParam(
    "walletaddress",
    "Username plus domain of the operator gateway proxy contract",
  )
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
    );

    try {
      const walletParams =
        await factory.deployedSnickerdoodleWalletAddressToOwner(
          taskArgs.walletaddress,
        );

      console.log("Wallet params:");
      console.log(" - Operator:", walletParams[0]);
      console.log(" - Name:", walletParams[1]);
      console.log(" - P256 details:");
      console.log("   - X:", walletParams[2][0]);
      console.log("   - Y:", walletParams[2][1]);
      console.log("   - Key Id:", walletParams[2][2]);
      console.log(
        "EVM Accounts:",
        walletParams.length == 4 ? walletParams[3] : "No EVM accounts",
      );
    } catch (e) {
      console.log("FAILED", e);
    }
  });
function padding(addressToPad) {
  // Format it to bytes32
  const padding = "0x000000000000000000000000";
  return padding.concat(addressToPad.substring(2));
}
